import InputText from '@/components/inputs/InputText';
import { useGlobal } from '@/context/GlobalContext';
import { 
  Box,
  Flex,
  Button,
  Grid,
  GridItem,
  Spacer,
  Text,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { useState , useRef , useEffect} from 'react';
import CustomHead from '@/components/CustomHead';
import api from '@/utils/api';
import InputSelect from '@/components/inputs/InputSelect';

export default function Usuario() {
    const keyName = "Usuario"
    const key = "usuarios";
    const editKey = "usuario";
    const {navigate, permissoes} = useGlobal()
    const [ formulario, setFormulario] = useState({})
    
    const [ errors, setErrors] = useState({})
    const [ loading, setLoading] = useState(false)
    const router = useRouter()
    const { id } = router.query;
    const toast = useToast()

    useEffect(() => {
      if(!permissoes?.permTags) {
          // router.back()
      }
    },[])

    const handleFormChange = (dado) => {
      setErrors({})
      setFormulario({ ...formulario, ...dado });
    }
    const handleValidateForm = (form) => {
      const newErrors = { 
          nome:  !form.nome ? "Infome o nome" : false,
          email:  !form.email ? "Infome o e-mail" : false,
          telefone:  !form.telefone ? "Infome o telefone" : false
      }
      setErrors(newErrors)

      for (const [chave, valor] of Object.entries(newErrors)) {
        if (!!valor) {
          if(refs[chave]?.current?.focus) {
            refs[chave]?.current?.focus();
          }
          if(refs[chave]?.current?.scrollIntoView){
            refs[chave]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          break; 
        }
      }

      return !Object.entries(newErrors).some(([chave, valor]) => !!valor)
    }

    const refs = {
      nome : useRef(null),
      email : useRef(null),
      telefone : useRef(null),
    }

    const submitHandler = async (event) => {
      event.preventDefault()
      if(!handleValidateForm(formulario) || loading) return 
      setLoading(true)
      try{
        //INSERINDO
        if(id)  await api.patch(`${key}/${id}`, { ...formulario })
        else  await api.post(`${key}`, { ...formulario })
       
        // router.back()
        setFormulario({})
        toast({
          description: (
            id ?  
                "Salvo(a) com sucesso!"  : 
                "Castrado(a) com sucesso!"
          ),
          status: 'success',
          duration: 9000,
          isClosable: true
        })
      }catch(error){
        toast({
            description: error?.response.data?.message,
            status: 'success',
            duration: 9000,
            isClosable: true
          })
      } finally {
        setLoading(false)
      }
    }


    useEffect(() => {
       if(id) getTag(id)
    },[id])


    const getTag = async (id) => {
        setLoading(true)
        try{
            const response = await api.get(`${key}/${id}`)
            setFormulario(response.data)
        }catch(error){

        } finally {
            setLoading(false)
        }
    }

    return (
      <>
        <CustomHead
          title={"Formulário cadastro"}
        />
        <Flex
          align="center"
          justify="center"
          w="100%"
          direction="column"
        >
          <form onSubmit={submitHandler} >
            <Text fontWeight="600" fontSize={20}>{keyName}</Text>
            <Divider my="30px"/>
            <Flex justify="space-between" minWidth={{ base: '200px', lg: "900px"}} maxWidth="1000px" width="100%" display={"flex"}  mb="25px">
              <Button
                  w="150px"
                  onClick={() => {
                    // router.back()
                  }}
                  size="sm"
                >
                  Voltar
                </Button>
                <Spacer/>
                <Button
                  w="150px"
                  type='submit'
                  isLoading={loading}
                  disabled={loading}
                  colorScheme="teal"
                  size="sm"
                >
                { id ? "Salvar" : "Cadastrar"}
                </Button>
            </Flex>
            <Box boxShadow='base' maxWidth="1000px" w="100%" py="30px" px={{base: "15px", lg: "30px"}} bgColor="#fff" borderRadius="md">
              <Grid templateColumns={{ base: 'repeat(1, 1fr)',lg: 'repeat(4, 1fr)' }} gap="5px" mb={3}>
                <GridItem w='100%' colSpan={{ base: 4, lg: 1}}>
                  <InputSelect
                      label="Status*"
                      widht="100%"
                      value={formulario.status}
                      isError={!!errors.status}
                      errorText={errors.status}
                      onChange={(e) => handleFormChange({ status: e.value })}
                      inputRef={refs.status}
                      options={[
                        { value : 'ativo', label: 'Ativo'},
                        { value : 'inativo', label: 'Inativo'},
                        { value : 'banido', label: 'Banido'},
                        { value : 'bloqueado', label: 'Bloqueado'},
                      ]}
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <InputText
                    label="Nome*"
                    widht="100%"
                    value={formulario.nome}
                    isError={!!errors.nome}
                    errorText={errors.nome}
                    onChange={(e) => handleFormChange({ nome: e.target.value })}
                    inputRef={refs.nome}
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <InputText
                    label="Email*"
                    widht="100%"
                    value={formulario.email}
                    isError={!!errors.email}
                    errorText={errors.email}
                    onChange={(e) => handleFormChange({ email: e.target.value })}
                    inputRef={refs.email}
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 1}}>
                  <InputText
                    label="Telefone*"
                    widht="100%"
                    value={formulario.telefone}
                    isError={!!errors.telefone}
                    errorText={errors.telefone}
                    onChange={(e) => handleFormChange({ telefone: e.target.value })}
                    inputRef={refs.telefone}
                    mb="15px"
                    type='phone'
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 3}}/>
                <GridItem w='100%' colSpan={{ base: 4, lg: 2}}>
                  <InputText
                    label="Senha*"
                    widht="100%"
                    value={formulario.senha}
                    isError={!!errors.senha}
                    errorText={errors.senha}
                    onChange={(e) => handleFormChange({ senha: e.target.value })}
                    inputRef={refs.senha}
                    mb="15px"
                    type='phone'
                  />
                </GridItem>
              </Grid>
            </Box>
            <Flex justify="space-between" maxWidth="1000px" mt="20px" width="100%" display={"flex"}  mb="25px">
              <Button
                  w="150px"
                  onClick={() => {
                    // router.back()
                  }}
                  size="sm"
                >
                  Voltar
                </Button>
                <Spacer/>
                <Button
                  w="150px"
                  type='submit'
                  isLoading={loading}
                  disabled={loading}
                  colorScheme="teal"
                  size="sm"
                >
                  { id ?  "Salvar"  : "Cadastrar"}
                </Button>
            </Flex>
          </form>
        </Flex>
      </>
      
    );
  }
  
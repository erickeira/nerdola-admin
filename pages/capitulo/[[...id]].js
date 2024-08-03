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
  Image,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { useState , useRef , useEffect} from 'react';
import CustomHead from '@/components/CustomHead';
import api from '@/utils/api';
import FotoPicker from '@/components/FotoPicker';
import { imageUrl } from '@/utils';
import InputSelect from '@/components/inputs/InputSelect';
import { IconTrash } from '@tabler/icons-react';

export default function Capitulo() {
    const keyName = "Capitulo"
    const key = "capitulos";

    const {navigate , permissoes} = useGlobal()
    const [ formulario, setFormulario] = useState({})
    const [ errors, setErrors] = useState({})
    const [ loading, setLoading] = useState(false)
    const router = useRouter()
    const { id , obra } = router.query;
    const toast = useToast()

    useEffect(() => {
      if(!permissoes?.permObras) {
          // router.back()
      }
    },[])


    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()
  

    const handleFormChange = (dado) => {
      setErrors({})
      setFormulario({ ...formulario, ...dado });
    }
    const handleValidateForm = (form) => {
      const newErrors = { 
          nome:  !form.nome ? "Infome o nome" : false,
          numero:  !form.numero ? "Infome o numero" : false,
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
      numero : useRef(null),
    }

    const submitHandler = async (notification) => {
      
      if(!handleValidateForm(formulario) || loading) return 
      setLoading(true)
      try{
        //INSERINDO
        if(id)  await api.patch(`${key}/${id}`, { ...formulario })
        else  await api.post(`${key}`, { ...formulario, obra, notification })
        
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

    useEffect(() => {
      getSites()
    },[])

    const [sites, setSites] = useState([])
    const getSites = async (id) => {
      setLoading(true)
      try{
          const response = await api.get(`site`)
          setSites(response.data)
      }catch(error){

      } finally {
          setLoading(false)
      }
  }

    const handleAddLink = () => {
      const links = formulario.links ? [...formulario.links] : [];
      links.push({
        site: sites[0]?.id || '',
        url: '',
        status: 'ativo'
      })
      handleFormChange({ links  })
    }

    const handleRemoveLink = (index) => {
      const links = formulario.links.filter(( link, i) => i != index)
      handleFormChange({ links })
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
          <form onSubmit={(event) => {
              event.preventDefault()
              if(!id){
                onOpen()
              }else{
                submitHandler()
              }
              
            }} 
          >
            <Flex justify="space-between">
              <Text fontWeight="600" fontSize={20}>{keyName}</Text>
              {
                !!formulario?.prox_cap &&
                <Button
                  w="150px"
                  type='submit'
                  isLoading={loading}
                  disabled={loading}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => {
                    navigate(`/capitulo/${formulario?.prox_cap}`)
                  }}
                >
                  Próximo capitulo
                </Button>
              }
             
            </Flex>
            
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
                <GridItem w='100%' colSpan={{ base: 4, lg: 2}}>
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
                <GridItem w='100%' colSpan={{ base: 4, lg: 2}}>
                  <InputText
                    label="Número*"
                    widht="100%"
                    value={formulario.numero}
                    isError={!!errors.numero}
                    errorText={errors.numero}
                    onChange={(e) => handleFormChange({ numero: e.target.value })}
                    inputRef={refs.numero}
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 2}}>
                  <InputText
                    label="Lançado em"
                    widht="100%"
                    value={formulario.lancado_em}
                    isError={!!errors.lancado_em}
                    errorText={errors.lancado_em}
                    onChange={(e) => handleFormChange({ lancado_em: e.target.value })}
                    inputRef={refs.lancado_em}
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <InputText
                    label="Descrição*"
                    widht="100%"
                    height="200px"
                    value={formulario.descricao}
                    isError={!!errors.descricao}
                    errorText={errors.descricao}
                    onChange={(e) => handleFormChange({ descricao: e.target.value })}
                    inputRef={refs.descricao}
                    area
                  />
                </GridItem>
                <GridItem mt="20px" w='100%' colSpan={{ base: 4, lg: 4}} mb="15px">
                  <Text as="b">IMAGEM:</Text>
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <InputText
                    widht="100%"
                    placeholder="Url da imagem"
                    value={formulario.imagem}
                    isError={!!errors.imagem}
                    errorText={errors.imagem}
                    onChange={(e) => handleFormChange({ imagem: e.target.value })}
                    inputRef={refs.imagem}
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <FotoPicker 
                    imagem={formulario.imagem}
                    url={`${imageUrl}obras/${formulario.obra?.id}/`}
                    height={300}
                    onChange={(imagem) => {
                      handleFormChange({ imagem })
                    }}  
                  />
                </GridItem>
                <GridItem mt="20px" w='100%' colSpan={{ base: 4, lg: 4}} mb="15px">
                  <Divider my="30px"/>
                </GridItem>
                <GridItem mt="20px" w='100%' colSpan={{ base: 4, lg: 4}} mb="15px">
                  <Text as="b">Links:</Text>
                </GridItem>
                {
                  formulario.links?.map((link, index) => (
                    <>
                      <GridItem w='100%' colSpan={{ base: 4, lg: 4}} mb="10px" display="flex" alignItems="flex-end" gap="10px">
                        <InputText
                          label="Url*"
                          widht="100%"
                          value={link.url}
                          onChange={(e) => {
                            const links = formulario.links ? [...formulario.links] : [];
                            links[index].url = e.target.value
                            handleFormChange({ links })
                          }}
                          inputRef={refs.descricao}
                        />
                         <IconButton
                          colorScheme={"red"}
                          icon={<IconTrash size={18} />}
                          onClick={() => handleRemoveLink(index)}
                        />
                      </GridItem>
                      <GridItem w='100%' colSpan={{ base: 4, lg: 1}}>
                        <InputSelect
                            label="Site*"
                            widht="100%"
                            value={link.site?.id || link.site}
                            onChange={(item) => {
                              const links = formulario.links ? [...formulario.links] : [];
                              links[index].site = item.value
                              handleFormChange({ links })
                            }}
                            options={sites.map(site => ({
                              value: site.id,
                              label: site.nome
                            }))}
                            mb="15px"
                          />
                      </GridItem>
                      <GridItem w='100%' colSpan={{ base: 4, lg: 1}}>
                        <InputSelect
                            label="Status*"
                            widht="100%"
                            value={link.status}
                            onChange={(item) => {
                              const links = formulario.links ? [...formulario.links] : [];
                              links[index].status = item.value
                              handleFormChange({ links })
                            }}
                            options={[
                              {
                                value : 'ativo',
                                label: 'Ativo'
                              },
                              {
                                value : 'inativo',
                                label: 'Inativo'
                              }
                            ]}
                            mb="15px"
                          />
                      </GridItem>
                      <GridItem w='100%' colSpan={{ base: 4, lg: 2}}>
                       
                      </GridItem>
                    </>
                  ))
                }
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <Button size="sm" colorScheme="blue" variant="outline" onClick={handleAddLink}>
                    Adicionar link
                  </Button>
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
        <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Notificação
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja notificar os leitoras dessa obra?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => { onClose(); submitHandler(true) }} >
                Somente cadastrar
              </Button>
              <Button colorScheme='green' onClick={() => { onClose(); submitHandler(true) }} ml={3}>
                Sim, enviar notificação
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      </>
      
    );
  }
  
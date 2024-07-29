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
  IconButton
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { useState , useRef , useEffect} from 'react';
import dayjs from 'dayjs';
import CustomHead from '@/components/CustomHead';
import FotoPicker from '@/components/FotoPicker';
import InputSelect from '@/components/inputs/InputSelect';
import api from '@/utils/api';
import { imageUrl } from '@/utils';
import { IconTrash } from '@tabler/icons-react';

export default function Obra() {
    const {navigate} = useGlobal()
    const router = useRouter()
    const { id, pedido, nome } = router.query;
    const [obra, setObra] = useState({
      status: 1
    })

    const [dadosAlterado, setDadosAlterados] = useState({})

    const [ errors, setErrors] = useState({})
    const [ loading, setLoading] = useState(false)
    
    
    const toast = useToast()

    useEffect(() => {
      if(pedido){
        handleFormChange({
          pedido,
          nome
        })
      }
    },[pedido])

    const handleFormChange = (dado) => {
      setErrors({})
      setObra({ ...obra, ...dado });
      setDadosAlterados({ ...dadosAlterado, ...dado })
    }
    const handleValidateForm = (form) => {
      const newErrors = { 
          nome:  !form.nome ? "Infome o nome da obra" : false,
          formato:  !form.formato ? "Infome o formato da obra" : false,
          descricao:  !form.descricao || form.descricao.length < 10 ? "Infome a descrição da obra" : false
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
      descricao : useRef(null),
      imagem : useRef(null),
      formato : useRef(null),
    }

    const submitHandler = async (event) => {
      event.preventDefault()
      if(!handleValidateForm(obra) || loading) return 
      setLoading(true)
      try{
        //INSERINDO
        if(id)  await api.patch(`obras/${id}`, { ...dadosAlterado })
        else  await api.post('obras', { ...obra })
       
        router.back()
        setObra({})
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
       if(id) getObra(id)
    },[id])

    useEffect(() => {
        getTags()
        getStatusList()
    },[])

    const getObra = async (id) => {
        setLoading(true)
        try{
            const response = await api.get(`obras/${id}`)
            setObra({
              ...response.data,
              tags: response.data.tags?.map(tag => tag.id),
              status: response.data.status.id
            })
        }catch(error){

        } finally {
            setLoading(false)
        }
    }

    const[ tags, setTags] = useState([])
    const getTags = async (id) => {
        setLoading(true)
        try{
            const response = await api.get(`tags`)
            setTags(response.data)
        }catch(error){

        } finally {
            setLoading(false)
        }
    }

    const[ statusList, setStatusList] = useState([])
    const getStatusList = async (id) => {
        try{
            const response = await api.get(`obra-status`)
            setStatusList(response.data)
        }catch(error){

        } finally {
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
      const links = obra.links ? [...obra.links] : [];
      links.push({
        site: sites[0]?.id || '',
        url: '',
        status: 'ativo'
      })
      handleFormChange({ links  })
    }

    const handleRemoveLink = (index) => {
      const links = obra.links.filter(( link, i) => i != index)
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
          <form onSubmit={submitHandler} >
          <Text fontWeight="600" fontSize={20}>Obra</Text>
          <Divider my="30px"/>
            <Flex justify="space-between" minWidth="900px" maxWidth="1000px" width="100%" display={"flex"}  mb="25px">
              <Button
                  w="150px"
                  onClick={() => {
                    router.back()
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
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <InputText
                    label="Nome obra*"
                    widht="100%"
                    value={obra.nome}
                    isError={!!errors.nome}
                    errorText={errors.nome}
                    onChange={(e) => handleFormChange({ nome: e.target.value })}
                    inputRef={refs.nome}
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <InputSelect
                      label="Tags*"
                      widht="100%"
                      value={obra.tags}
                      isError={!!errors.tags}
                      errorText={errors.tags}
                      onChange={(e) => {
                        const tags = e.map(t => t.value)
                        handleFormChange({ tags })
                      }}
                      inputRef={refs.tags}
                      options={tags.map((opt) => ({
                        value : opt.id,
                        label: opt.nome
                      }))}
                      isMulti
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 1}}>
                  <InputText
                    label="Formato*"
                    placeholder='Mangá, Manhwa ....'
                    widht="100%"
                    value={obra.formato}
                    isError={!!errors.formato}
                    errorText={errors.formato}
                    onChange={(e) => handleFormChange({ formato: e.target.value })}
                    inputRef={refs.formato}
                      mb="15px"
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 1}}>
                    <InputSelect
                        label="Status*"
                        widht="100%"
                        value={obra.status}
                        isError={!!errors.status}
                        errorText={errors.status}
                        onChange={(e) => handleFormChange({ status: e.value })}
                        inputRef={refs.status}
                        options={statusList.map((status) => ({
                            value : status.id,
                            label: status.nome
                        }))}
                        mb="15px"
                    />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
                  <InputText
                    label="Descrição*"
                    widht="100%"
                    height="300px"
                    value={obra.descricao}
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
                    value={obra.imagem}
                    isError={!!errors.imagem}
                    errorText={errors.imagem}
                    onChange={(e) => handleFormChange({ imagem: e.target.value })}
                    inputRef={refs.imagem}
                  />
                </GridItem>
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}} >
                  <FotoPicker 
                    imagem={obra.imagem}
                    url={`${imageUrl}obras/${id}/`}
                    onChange={(imagem) => {
                      handleFormChange({ imagem })
                    }}  
                  />
                </GridItem>
                {
                  !id && 
                  <GridItem w='100%' colSpan={{ base: 4, lg: 1}} mt="25px">
                    <InputText
                      label="Número de capitulos*"
                      widht="100%"
                      value={obra.total_capitulos}
                      isError={!!errors.total_capitulos}
                      errorText={errors.total_capitulos}
                      onChange={(e) => handleFormChange({ total_capitulos: e.target.value })}
                      inputRef={refs.total_capitulos}
                      type="number"
                    />
                  </GridItem>
                }
                {
                  obra.links?.map((link, index) => (
                    <>
                      <GridItem w='100%' colSpan={{ base: 4, lg: 4}} mb="10px" mt="20px" display="flex" alignItems="flex-end" gap="10px">
                        <InputText
                          label="Url*"
                          widht="100%"
                          value={link.url}
                          onChange={(e) => {
                            const links = obra.links ? [...obra.links] : [];
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
                              const links = obra.links ? [...obra.links] : [];
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
                              const links = obra.links ? [...obra.links] : [];
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
                <GridItem w='100%' colSpan={{ base: 4, lg: 4}} mt="20px">
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
                    router.back()
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
  
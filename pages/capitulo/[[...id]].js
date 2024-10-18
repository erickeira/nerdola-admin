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
  Icon,
  IconPhotoOff,
  SimpleGrid,
} from '@chakra-ui/react';

import { useRouter } from 'next/router';
import { useState , useRef , useEffect} from 'react';
import CustomHead from '@/components/CustomHead';
import api from '@/utils/api';
import FotoPicker from '@/components/FotoPicker';
import { imageUrl } from '@/utils';
import InputSelect from '@/components/inputs/InputSelect';
import { IconTrash } from '@tabler/icons-react';

// Importe os componentes necessários do dnd-kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDebouncedDragEnd
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/components/SortableItem';
import { useDropzone } from 'react-dropzone';
import { resizeImage } from '@/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

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

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { 
      isOpen: isImageModalOpen, 
      onOpen: onImageModalOpen, 
      onClose: onImageModalClose 
    } = useDisclosure() // Movido para cá

    const cancelRef = useRef()

    useEffect(() => {
      if(!permissoes?.permObras) {
          router.back()
      }
    },[])


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
        if(id)  await api.patch(`${key}/${id}`, { ...formulario, paginas: JSON.stringify(paginas) })
        else  await api.post(`${key}`, { ...formulario, obra, notification, paginas: JSON.stringify(paginas) })
        
        router.back()
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
       if(id) getForm(id)
    },[id])


    const getForm = async (id) => {
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
    
    const [paginas, setPaginas] = useState([]);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          delay: 250,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    useEffect(() => {
      if (formulario.paginas) {
        setPaginas(formulario.paginas);
      }
    }, [formulario.paginas]);

    const handleDragEnd = (event) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setPaginas((items) => {
          const oldIndex = items.findIndex((item) => item.src === active.id);
          const newIndex = items.findIndex((item) => item.src === over?.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };

    const [imageLoadErrors, setImageLoadErrors] = useState({});

    const handleImageError = (src) => {
      setImageLoadErrors(prev => ({ ...prev, [src]: true }));
    };

    const onDrop = async (acceptedFiles) => {
      const newPaginas = await Promise.all(
        acceptedFiles.map(async (file) => {
          if (file.size > 10 * 1024 * 1024) {
            toast({
              description: 'A imagem não deve exceder 10 MB',
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'bottom-right',
            });
            return null;
          }

          const base64String = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });

          const resizedImage = await resizeImage(base64String);
          return { src: resizedImage };
        })
      );

      const validPaginas = newPaginas.filter(pagina => pagina !== null);
      setPaginas([...paginas, ...validPaginas]);
    };

    const { getRootProps, getInputProps, open } = useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true,
    });

    const handleRemovePagina = (index, event) => {
      event.preventDefault();
      event.stopPropagation();
      setPaginas(paginas.filter((_, i) => i !== index));
    };

    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const handleImageClick = (index) => {
      setSelectedImageIndex(index);
      onImageModalOpen();
    };

    const handlePrevImage = () => {
      setSelectedImageIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : paginas.length - 1
      );
    };

    const handleNextImage = () => {
      setSelectedImageIndex((prevIndex) => 
        prevIndex < paginas.length - 1 ? prevIndex + 1 : 0
      );
    };

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (isImageModalOpen) {
          if (event.key === 'ArrowLeft') {
            handlePrevImage();
          } else if (event.key === 'ArrowRight') {
            handleNextImage();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isImageModalOpen, handlePrevImage, handleNextImage]);

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
              
             
            </Flex>
            
            <Divider my="30px"/>
            <Flex justify="space-between" gap="10px" minWidth={{ base: '200px', lg: "900px"}} maxWidth="1000px" width="100%" display={"flex"}  mb="25px">
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
                {
                  !!formulario?.cap_anterior && formulario?.cap_anterior != formulario?.id &&
                  <Button
                    w="150px"
                    isLoading={loading}
                    disabled={loading}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      getForm(formulario?.cap_anterior)
                    }}
                  >
                    Capítulo anterior
                  </Button>
                }
                {
                  !!formulario?.prox_cap &&
                  <Button
                    w="150px"
                    isLoading={loading}
                    disabled={loading}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      getForm(formulario?.prox_cap)
                    }}
                  >
                    Próximo capitulo
                  </Button>
                }
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
                {/* <GridItem w='100%' colSpan={{ base: 4, lg: 2}}>
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
                </GridItem> */}
                {/* <GridItem w='100%' colSpan={{ base: 4, lg: 4}}>
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
                </GridItem> */}
                <GridItem mt="20px" w='100%' colSpan={{ base: 4, lg: 4}} mb="15px">
                  <Text as="b" mb={4} display="block">Páginas:</Text>
                  <Box {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button onClick={open} colorScheme="blue" mb={4}>
                      Adicionar imagens
                    </Button>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={paginas.map(p => p.src)}
                        strategy={rectSortingStrategy}
                      >
                        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
                          {paginas.map((pagina, index) => (
                            <SortableItem key={pagina.src} id={pagina.src}>
                              {(provided) => (
                                <Flex 
                                  alignItems="center" 
                                  justifyContent="center"
                                  flexDirection="column"
                                  borderRadius={3}
                                  overflow="hidden"
                                  boxShadow="md"
                                  bg="white"
                                  p={2}
                                  height="200px"
                                  _hover={{ boxShadow: "lg" }}
                                  position="relative"
                                  {...provided.attributes}
                                  {...provided.listeners}
                                >
                                  {imageLoadErrors[pagina.src] ? (
                                    <Flex
                                      flex={1}
                                      bg="gray.100"
                                      alignItems="center"
                                      justifyContent="center"
                                      flexDirection="column"
                                      width="100%"
                                    >
                                      <Icon as={IconPhotoOff} boxSize={8} color="gray.500" />
                                      <Text fontSize="xs" color="gray.500" mt={1} textAlign="center">
                                        Imagem não carregada
                                      </Text>
                                    </Flex>
                                  ) : (
                                    <Image
                                      src={pagina.src.startsWith('data:') ? pagina.src : `${imageUrl}obras/${formulario.obra?.id}/capitulos/${formulario.numero}/${pagina.src}`}
                                      alt={`Página ${index + 1}`}
                                      objectFit="cover"
                                      width="100%"
                                      height="150px"
                                      onError={() => handleImageError(pagina.src)}
                                      onClick={() => handleImageClick(index)}
                                      cursor="pointer"
                                    />
                                  )}
                                  <Text color="gray.600" fontSize="13px" mt={2}>Página {index + 1}</Text>
                                  <IconButton
                                    icon={<IconTrash size={16} />}
                                    size="sm"
                                    colorScheme="red"
                                    position="absolute"
                                    top={1}
                                    right={1}
                                    onClick={(e) => handleRemovePagina(index, e)}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                  />
                                </Flex>
                              )}
                            </SortableItem>
                          ))}
                        </SimpleGrid>
                      </SortableContext>
                    </DndContext>
                  </Box>
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

      {/* Modal para visualização da imagem */}
      <Modal isOpen={isImageModalOpen} onClose={onImageModalClose} size="full">
        <ModalOverlay />
        <ModalContent bg="rgba(0,0,0,0.8)">
          <ModalHeader color="white">Página {selectedImageIndex !== null ? selectedImageIndex + 1 : ''}</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Flex alignItems="center" justifyContent="space-between" height="calc(100vh - 100px)">
              <IconButton
                icon={<ChevronLeftIcon />}
                onClick={handlePrevImage}
                aria-label="Página anterior"
                variant="ghost"
                color="white"
                size="lg"
              />
              <Box maxHeight="100%" maxWidth="calc(100% - 100px)" overflow="auto" textAlign="center">
                {selectedImageIndex !== null && paginas[selectedImageIndex] && (
                  <Image
                    src={paginas[selectedImageIndex].src.startsWith('data:') 
                      ? paginas[selectedImageIndex].src 
                      : `${imageUrl}obras/${formulario.obra?.id}/capitulos/${formulario.numero}/${paginas[selectedImageIndex].src}`
                    }
                    alt={`Página ${selectedImageIndex + 1}`}
                    maxHeight="100%"
                    maxWidth="100%"
                    objectFit="contain"
                  />
                )}
              </Box>
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={handleNextImage}
                aria-label="Próxima página"
                variant="ghost"
                color="white"
                size="lg"
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      </>
      
    );
  }
  













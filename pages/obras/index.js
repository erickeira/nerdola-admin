import { useEffect, useRef, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import { 
    Box,
    Button,
    Image,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Spacer,
    Flex,
    IconButton,
    Tag,
    useDisclosure,
    useToast,
    color,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Divider,
    Text,
    useBreakpointValue,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    InputGroup,
    Input,
    InputRightElement,
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconEdit, IconListNumbers, IconPhoto , IconRowInsertTop , IconCloudUpload } from '@tabler/icons-react';
import { imageUrl } from '@/utils';
import { useRouter } from 'next/router';
import InputText from '@/components/inputs/InputText';
import { SearchIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';


export default function Obras() {
    const router = useRouter();
    const { navigate, permissoes } = useGlobal()
    const [obras, setObras] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(20);
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen : isOpenAdicionar, onOpen : onOpenAdicionar, onClose: onCloseAdicionar } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const { pagina, limite, busca } = router.query;
        if (pagina) setPage(Number(pagina));
        if (limite) setLimit(Number(limite));
        if (busca) setSearchTerm(busca);
    }, [router.query]);

    useEffect(() => {
        getObras()
    }, [page, limit, searchTerm])

    const getObras = async () => {
        try {
            setLoading(true)
            const response = await api.get('obras', {
                params: {
                    pagina: page,
                    limite: limit,
                    string: searchTerm
                }
            })
            setObras(response.data.resultados)
            setTotalPages(Math.ceil(response.data.total / limit))
            
            router.push({
                pathname: router.pathname,
                query: { ...router.query, pagina: page, limite: limit, busca: searchTerm },
            }, undefined, { shallow: true });
        } catch(error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onEdit = (id) => {
        navigate(`/obra/${id}`)
    };   

    const onDelete = async (e) => {
        onCloseDelete()
        if(idAction){
            try{
                const response = await api.delete(`obras/${idAction}`)
                toast({
                    title: 'Obra removida com sucesso!.',
                    status: 'success',
                    position: 'bottom-right',
                    duration: 3000,
                    isClosable: true,
                })
                getObras()
            }catch(error){
              console.log(error)
            } finally {
              setLoading(false)
            }
        }
    };

    const onCapitulos = (id) => {
        navigate(`/capitulos/${id}`)
    }

    const [isLoadingImportacao, setIsLoadingImportacao] = useState(false)
    const  handleImportarPaginas = async (id) => {
        setIsLoadingImportacao(true)
        try{
            toast({
                description: `As obras estão na fila de importação, por favor aguarde`,
                status: 'info',
                isClosable: true,
            })
            await api.post(`obras/${id}/importar-todos-capitulos`)
        }catch(error){
            console.log(error)
        } finally {
            setIsLoadingImportacao(false)
        }
    }

    const [isLoadingAdicionar, setIsLoadingAdicionar] = useState(false)
    const [ ate, setAte ] = useState('')
    const [ isErroAte ,setIsErrorAte] = useState(false)
    const handleAdicionarCapitulos = async () => {
        setIsLoadingAdicionar(true)
        if(!ate) setIsErrorAte(true)
        try{
            await api.post(`obras/${idAction}/criar-capitulos`,{
                ate
            })
            toast({
                description: `Capitulos adicionados com sucesso!`,
                status: 'success',
                isClosable: true,
            })
            getObras()
        }catch(error){
        } finally {
            onCloseAdicionar()
            setIsLoadingAdicionar(false)
        }
    }

    useEffect(() => {
        setAte('')
    },[isOpenAdicionar])


    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Resetar para a primeira página ao buscar
        getObras();
    };

    return (
        <Flex justify="center" >
            <Box 
                maxWidth="1500px"
                minWidth="1000px"
                sx={{
                    '.even' : {
                        bgColor: '#f6f6f6'
                    }
                }}    
            >
                {/* <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Obras</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb> */}
                <Flex mb="10px" alignItems="center">
                    <form onSubmit={handleSearch} style={{ flex: 1 }}>
                        <InputGroup>
                            <Input
                                placeholder="Buscar obras..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(e);
                                    }
                                }}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Buscar obras"
                                    icon={<SearchIcon />}
                                    onClick={handleSearch}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </form>
                    <Spacer />
                    <Button 
                        size="sm" 
                        rightIcon={<AddIcon/>}
                        onClick={() => {
                            navigate('/obra')
                        }}
                        variant="outline"
                        colorScheme="blue"
                        ml={4}
                    >
                        Adicionar
                    </Button>
                </Flex>
                <Divider my="30px"/>
                <TableContainer>
                    <Table variant="striped" size="sm" colorScheme="gray">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Imagem</Th>
                                <Th>Nome</Th>
                                <Th>Formato</Th>
                                <Th>Atualização</Th>
                                <Th>Cap.</Th>
                                <Th>Imp.</Th>
                                <Th>Lendo</Th>
                                <Th>Links</Th>
                                <Th>Status</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {obras.map((obra) => (
                                <Tr key={obra.id}>
                                    <Td>{obra.id}</Td>
                                    <Td>
                                        <Box height="80px" p="0px">
                                            {obra.imagem ? (
                                                <Image
                                                    src={`${imageUrl}obras/${obra.id}/${obra.imagem}`}
                                                    w="100%"
                                                    h="100%"
                                                    objectFit="contain"
                                                />
                                            ) : (
                                                <Flex
                                                    flexDirection="column"
                                                    gap={3}
                                                    w={'100%'}
                                                    h={'100%'}
                                                    justify="center"
                                                    alignItems={'center'}
                                                    borderColor={'#fff'}
                                                    borderRadius="5px"
                                                >
                                                    <IconPhoto color="#666" />
                                                </Flex>
                                            )}
                                        </Box>
                                    </Td>
                                    <Td>{obra.nome}</Td>
                                    <Td>{obra.formato.nome}</Td>
                                    <Td>
                                        {
                                            {
                                                semanal: "Semanal",
                                                mensal: "Mensal",
                                                bisemanal: "Bi semanal"
                                            }[obra.atualizacoes.frequencia]
                                        }
                                    </Td>
                                    <Td>{obra.total_capitulos}</Td>
                                    <Td>{obra.capitulos_importados}</Td>
                                    <Td>{obra.total_usuarios_lendo}</Td>
                                    <Td>{obra.links.length}</Td>
                                    <Td>
                                        <Tag
                                            colorScheme={
                                                {
                                                    1: 'blue',
                                                    2: 'green',
                                                    3: 'yellow',
                                                    4: 'red'
                                                }[obra.status.id]
                                            }
                                            borderRadius="full"
                                            size="sm"
                                            w="100px"
                                            justifyContent="center"
                                        >
                                            {obra.status.nome}
                                        </Tag>
                                    </Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton size="md" as={IconButton} icon={<HamburgerIcon />} />
                                                <MenuList>
                                                    <MenuItem icon={<IconEdit stroke={1.25} size={16}/>} onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        onEdit(obra.id)
                                                    }}>
                                                        Editar
                                                    </MenuItem>
                                                    <MenuItem icon={<IconListNumbers stroke={1.25} size={16} />} onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        onCapitulos(obra.id)
                                                    }}>
                                                        Capitulos
                                                    </MenuItem>
                                                    <Divider my="8px"/>
                                                    <MenuItem icon={<IconCloudUpload stroke={1.25} size={16} />} onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        handleImportarPaginas(obra.id)
                                                    }}>
                                                        Importar páginas
                                                    </MenuItem>
                                                    <MenuItem icon={<IconRowInsertTop  stroke={1.25} size={16} />} onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        setIdAction(obra.id)
                                                        onOpenAdicionar()
                                                    }}>
                                                        Adicionar capitulos
                                                    </MenuItem>
                                                    <Divider my="8px"/>
                                                    <MenuItem icon={<DeleteIcon size={16}/>} onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIdAction(obra.id)
                                                        onOpenDelete();
                                                    }}>
                                                        Excluir
                                                    </MenuItem>
                                                </MenuList>
                                        </Menu>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalPages * limit}
                    itemsPerPage={limit}
                    onPageChange={setPage}
                />
                
                <AlertDialog
                    isOpen={isOpenDelete}
                    leastDestructiveRef={cancelRef}
                    onClose={onCloseDelete}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Excluir
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Tem certeza? Voce não poderá desfazer essa ação.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseDelete}>
                                Cancelar
                            </Button>
                            <Button colorScheme='red' onClick={onDelete} ml={3}>
                                Excluir
                            </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
                <Modal isOpen={isOpenAdicionar} onClose={onCloseAdicionar}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Adicionar capitulos</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <InputText
                            label="Informe o ultimo capitulo*"
                            widht="100%"
                            value={ate}
                            isError={isErroAte}
                            errorText={"Informe o ultimo capitulo"}
                            onChange={(e) => {
                                setIsErrorAte(false)
                                setAte(e.target.value)
                            }}
                            mb="15px"
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onCloseAdicionar}>
                            Fechar
                        </Button>
                        <Button 
                            variant='ghost'
                            onClick={() => {
                                handleAdicionarCapitulos()
                            }}
                        >Adicionar</Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </Flex>
    );
  }
  

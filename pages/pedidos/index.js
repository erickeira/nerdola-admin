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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Spinner,
    Text,
    useBreakpointValue,
    Link
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconListNumbers, IconPhoto , IconCheck , IconX } from '@tabler/icons-react';
import { imageUrl } from '@/utils';
import dayjs from 'dayjs'
import InputSelect from '@/components/inputs/InputSelect';
import InputText from '@/components/inputs/InputText';
import { useRouter } from 'next/router';
import Pagination from '@/components/Pagination';


export default function Pedidos() {
    const { navigate, permissoes } = useGlobal()
    const [pedidos, setPedidos] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen : isOpenObras, onOpen : onOpenObras, onClose: onCloseObras } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()
    const router = useRouter()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if(!permissoes?.permPedidos) {
           // router.back()
        }
    },[])

    useEffect(() => {
        const { pagina, limite, busca } = router.query;
        if (pagina) setPage(Number(pagina));
        if (limite) setLimit(Number(limite));
        if (busca) setSearchTerm(busca);
    }, [router.query]);

    useEffect(() => {
        getPedidos()
    }, [page, limit, searchTerm])

    const getPedidos = async () => {
        try {
            setLoading(true)
            const response = await api.get('pedido', {
                params: {
                    pagina: page,
                    limite: limit,
                    string: searchTerm
                }
            })
            setPedidos(response.data.resultados)
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

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        getPedidos();
    };


    useEffect(() => {
        getPedidos()
    },[])

    const onEdit = (pedido, nome) => {
        navigate(`/obra`, {
            pedido,
            nome,
        })
    };   

    const onDelete = async (e) => {
        onCloseDelete()
        if(idAction){
            try{
                const response = await api.patch(`pedido/${idAction}`,{
                    status: 'reprovado'
                })
                toast({
                    title: 'Pedido reprovado com sucesso!.',
                    status: 'success',
                    position: 'bottom-right',
                    duration: 3000,
                    isClosable: true,
                })
                getPedidos()
            }catch(error){
              console.log(error)
            } finally {
              setLoading(false)
            }
        }
    };

    const [obras, setObras] = useState([])
    const [string, setString] = useState("")
    const [isLoadingObras, setIsLoadingObras] = useState(false)

    const getObras = async () => {
        setIsLoadingObras(true)
        try{
            const response = await api.get('obras', {
                params: {
                    limite: 15,
                    string
                }
            })
            
            setObras(response.data)
        }catch(error){
          console.log(error)
        } finally {
          setIsLoadingObras(false)
        }
    }


    const updatePedido = async (obra) => {
        try{
            const response = await api.patch(`pedido/${idAction}`, { obra })
            getPedidos()
        }catch(error){
          console.log(error)
        } finally {
        }
    }

    useEffect(() => {
        getObras()
    },[string])

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
                <Flex mb="10px" alignItems="center">
                    <form onSubmit={handleSearch} style={{ flex: 1 }}>
                        <InputGroup>
                            <Input
                                placeholder="Buscar pedidos..."
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
                                    aria-label="Buscar pedidos"
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
                                <Th>Nome</Th>
                                <Th>Onde Ler</Th>
                                <Th>Quem pediu</Th>
                                <Th>Obra relacionada</Th>
                                <Th>Pedido em</Th>
                                <Th>Status</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {pedidos.map((pedido) => (
                                <Tr key={pedido.id}>
                                    <Td>{pedido.nome}</Td>
                                    <Td>{pedido.onde_ler}</Td>
                                    <Td>{pedido.usuario.nome}</Td>
                                    <Td>
                                        {pedido.obra?.id && (
                                            <Button
                                                colorScheme="gray"
                                                size="sm"
                                                onClick={() => navigate(`/obra/${pedido.obra.id}`)}
                                            >
                                                {pedido.obra.nome}
                                            </Button>
                                        )}
                                    </Td>
                                    <Td>{dayjs(pedido.criado_em).format('DD/MM/YYYY HH:mm')}</Td>
                                    <Td>
                                        <Tag 
                                            colorScheme={{
                                                "publicado" : 'green',
                                                "em_analise" : 'yellow',
                                                "reprovado" : 'red'
                                            }[pedido.status]}
                                            borderRadius="full"
                                            size="sm"
                                            w="100px"
                                            justifyContent="center"
                                        >
                                            {{
                                                "publicado" : 'Publicado',
                                                "em_analise" : 'Em analise',
                                                "reprovado" : 'Reprovado'
                                            }[pedido.status]}
                                        </Tag>
                                    </Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton size="md" as={IconButton} icon={<HamburgerIcon />} />
                                            <MenuList>
                                                {pedido.status === 'em_analise' && (
                                                    <>
                                                        <MenuItem
                                                            onClick={() => onEdit(pedido.id, pedido.nome)}
                                                            icon={<EditIcon />}
                                                        >
                                                            Criar obra
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => {
                                                                setIdAction(pedido.id)
                                                                onOpenObras()
                                                                getObras()
                                                            }}
                                                            icon={<IconListNumbers stroke={1.25} size={16} />}
                                                        >
                                                            Vincular obra
                                                        </MenuItem>
                                                        <Divider my="8px"/>
                                                        <MenuItem
                                                            onClick={() => {
                                                                setIdAction(pedido.id)
                                                                onOpenDelete();
                                                            }}
                                                            icon={<DeleteIcon />}
                                                            color="red.400"
                                                        >
                                                            Reprovar
                                                        </MenuItem>
                                                    </>
                                                )}
                                                {pedido.status !== 'em_analise' && (
                                                    <MenuItem
                                                        onClick={() => {
                                                            setIdAction(pedido.id)
                                                            onOpenObras()
                                                            getObras()
                                                        }}
                                                        icon={<IconListNumbers stroke={1.25} size={16} />}
                                                    >
                                                        Vincular obra
                                                    </MenuItem>
                                                )}
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
                                Reprovar
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Tem certeza? Voce não poderá desfazer essa ação.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseDelete}>
                                Cancelar
                            </Button>
                            <Button colorScheme='red' onClick={onDelete} ml={3}>
                                Reprovar
                            </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
                <Modal isOpen={isOpenObras} size="xl" onClose={onCloseObras}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Obra</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <InputText
                            mb="10px"
                            label='Pesquisar'
                            onStopType={(newString) => {
                                setString(newString)
                            }}
                        />
                        {
                            isLoadingObras && (
                                <Flex width="100%" height={300} alignItems="center" justify="center">
                                    <Spinner/>
                                </Flex>
                                
                            )
                        }
                        {
                            !!string && !obras.length && !isLoadingObras && (
                                <Flex width="100%" height={300} alignItems="center" justify="center">
                                    <Text color="#666" size="14px">
                                        Obra não encontrada
                                    </Text>
                                </Flex>
                            )
                        }
                        <Flex flexDirection="column" gap="5px">
                            {
                                !isLoadingObras && obras?.map((obra, index) => {
                                    return(
                                        <Button
                                            onClick={() => {
                                                updatePedido(obra.id)
                                                onCloseObras()
                                            }}
                                        >
                                            {obra.nome.slice(0, 50)}
                                        </Button>
                                    )
                                })
                            }
                        </Flex>
                       
                    </ModalBody>

                    <ModalFooter>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </Flex>
    );
  }
  

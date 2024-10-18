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
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    useBreakpointValue,
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconEdit, IconPhoto , } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { SearchIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';

export default function ObrasStatus() {
    const keyName = "Obras Status"
    const key = "obra-status";
    const editKey = "obra-status";
    const { navigate , permissoes } = useGlobal()
    const [obras, setObras] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()
    const router = useRouter()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if(!permissoes?.permObras) {
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
        getDados()
    }, [page, limit, searchTerm])

    const getDados = async () => {
        try {
            setLoading(true)
            const response = await api.get(`${key}`, {
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
        navigate(`/${editKey}/${id}`)
    };   

    const onDelete = async (e) => {
        onCloseDelete()
        if(idAction){
            try{
                const response = await api.delete(`${key}/${idAction}`)
                toast({
                    title: 'Removido(a) com sucesso!.',
                    status: 'success',
                    position: 'bottom-right',
                    duration: 3000,
                    isClosable: true,
                })
                getDados()
            }catch(error){
              console.log(error)
            } finally {
              setLoading(false)
            }
        }
        
      
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        getDados();
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
                <Flex mb="10px" alignItems="center">
                    <form onSubmit={handleSearch} style={{ flex: 1 }}>
                        <InputGroup>
                            <Input
                                placeholder="Buscar status de obras..."
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
                                    aria-label="Buscar status de obras"
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
                            navigate(`/${editKey}`)
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
                                <Th>Nome</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {obras.map((obra) => (
                                <Tr key={obra.id}>
                                    <Td>{obra.id}</Td>
                                    <Td>{obra.nome}</Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton size="md" as={IconButton} icon={<HamburgerIcon />} />
                                            <MenuList>
                                                <MenuItem
                                                    icon={<IconEdit stroke={1.25}size={16}/>}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        onEdit(obra.id)
                                                    }}
                                                >
                                                    Editar
                                                </MenuItem>
                                                <Divider my="8px"/>
                                                <MenuItem
                                                    icon={<DeleteIcon size={16}/>}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIdAction(obra.id)
                                                        onOpenDelete();
                                                    }}
                                                    color="red.400"
                                                >
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
            </Box>
        </Flex>
    );
  }

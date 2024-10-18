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
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconEdit, IconPhoto , } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { SearchIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';
import InputText from '@/components/inputs/InputText';

export default function Sites() {
    const keyName = "Sites"
    const key = "site";
    const editKey = "site";
    const { navigate , permissoes } = useGlobal()
    const [dados, setDados] = useState([])
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
        if(!permissoes?.permSites) {
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
            setDados(response.data.resultados)
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
        getDados();
    };

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
                                placeholder="Buscar sites..."
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
                                    aria-label="Buscar sites"
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
                                <Th>Endereço</Th>
                                <Th>Status</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {dados.map((site) => (
                                <Tr key={site.id}>
                                    <Td>{site.id}</Td>
                                    <Td>{site.nome}</Td>
                                    <Td>{site.url}</Td>
                                    <Td>
                                        <Tag 
                                            colorScheme={site.status === "ativo" ? "green" : "red"}
                                            borderRadius="full"
                                            size="sm"
                                            w="100px"
                                            justifyContent="center"
                                        >
                                            {site.status === "ativo" ? "Ativo" : "Inativo"}
                                        </Tag>
                                    </Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton size="md" as={IconButton} icon={<HamburgerIcon />} />
                                            <MenuList>
                                                <MenuItem
                                                    icon={<IconEdit stroke={1.25}size={16}/>}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        onEdit(site.id)
                                                    }}
                                                >
                                                    Editar
                                                </MenuItem>
                                                <Divider my="8px"/>
                                                <MenuItem
                                                    icon={<DeleteIcon size={16}/>}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIdAction(site.id)
                                                        onOpenDelete();
                                                    }}
                                                    color="red.400"
                                                >Excluir</MenuItem>
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

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
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconEdit, IconListNumbers, IconPhoto, IconX , } from '@tabler/icons-react';
import { imageUrl } from '@/utils';
import { useRouter } from 'next/router';
import Pagination from '@/components/Pagination';
import { SearchIcon } from '@chakra-ui/icons';

export default function ObrasImportando() {
    const { navigate , permissoes } = useGlobal()
    const [obras, setObras] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()
   

    const router = useRouter()
    useEffect(() => {
        if(!permissoes?.permObras) {
           // router.back()
        }
    },[])

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(20);
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
                    string: searchTerm,
                    importando: true
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

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        getObras();
    };

    const cancelarImportacao = async (id) => {
        try{
            await api.post(`obras/${id}/cancelar-importacao`)
            toast({
                title: 'Cancelado com sucesso!.',
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
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Obras importando</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
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
                                <Th>Erro</Th>
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
                                    <Td>{obra.capitulos_nao_importados}</Td>
                                    <Td>
                                        <IconButton
                                            icon={<IconX size={16}/>}
                                            onClick={() => cancelarImportacao(obra.id)}
                                            colorScheme="red"
                                            size="sm"
                                        />
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
            </Box>
        </Flex>
    );
}

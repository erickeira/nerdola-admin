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
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconEdit, IconListNumbers, IconPhoto , } from '@tabler/icons-react';
import { imageUrl } from '@/utils';
import { useRouter } from 'next/router';
import { SearchIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';

export default function ObrasDesatualizadas() {
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
                    statusatualizacao: 'desatualizado'
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

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
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
                <Flex mb="10px" alignItems="center">
                    <form onSubmit={handleSearch} style={{ flex: 1 }}>
                        <InputGroup>
                            <Input
                                placeholder="Buscar obras desatualizadas..."
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
                                <Th>Imagem</Th>
                                <Th>Nome</Th>
                                <Th>Formato</Th>
                                <Th>Cap.</Th>
                                <Th>Responsável</Th>
                                <Th>Dia da semana</Th>
                                <Th>Status</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {obras.map((obra) => (
                                <Tr key={obra.id}>
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
                                    <Td>{obra.total_capitulos}</Td>
                                    <Td>{obra.agente?.nome}</Td>
                                    <Td>
                                        {
                                            {
                                                segunda: "Segunda",
                                                terca: "Terça",
                                                quarta: "Quarta",
                                                quinta: "Quinta",
                                                sexta: "Sexta",
                                                sabado: "Sábado",
                                                domingo: "Domingo",
                                            }[obra.atualizacoes.dia_semana]
                                        }
                                    </Td>
                                    <Td>
                                        <Tag 
                                            colorScheme="yellow"
                                            borderRadius="full"
                                            size="sm"
                                            w="100px"
                                            justifyContent="center"
                                        >
                                            Desatualizada
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
                                                        onEdit(obra.id)
                                                    }}
                                                >
                                                    Editar
                                                </MenuItem>
                                                <MenuItem
                                                    icon={<IconListNumbers stroke={1.25} size={16} />}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        onCapitulos(obra.id)
                                                    }}
                                                >
                                                    Capítulos
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

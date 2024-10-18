import { useEffect, useRef, useState } from 'react';
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
    Spacer,
    Flex,
    IconButton,
    Tag,
    useDisclosure,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    Text,
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
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconEdit, IconCloudUpload } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Pagination from '@/components/Pagination';

export default function Capitulos() {
    const { navigate, permissoes } = useGlobal()
    const [capitulos, setCapitulos] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(20);
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [idAction, setIdAction] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()
    const router = useRouter()
    const { id } = router.query
    const [searchTerm, setSearchTerm] = useState('');
    const [obra, setObra] = useState({})

    useEffect(() => {
        if (id) {
            getObra(id)
            getCapitulos()
        }
    }, [id, page, limit, searchTerm])

    const getCapitulos = async () => {
        try {
            setLoading(true)
            const response = await api.get('capitulos', {
                params: {
                    obr_id: id,
                    pagina: page,
                    limite: limit,
                    string: searchTerm
                }
            })
            setCapitulos(response.data.resultados)
            setTotalPages(Math.ceil(response.data.total / limit))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getObra = async (id) => {
        setLoading(true)
        try {
            const response = await api.get(`obras/${id}`)
            setObra(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onEdit = (id) => {
        navigate(`/capitulo/${id}`)
    };   

    const onDelete = async () => {
        onCloseDelete()
        if (idAction) {
            try {
                await api.delete(`capitulos/${idAction}`)
                toast({
                    title: 'Capítulo removido com sucesso!',
                    status: 'success',
                    position: 'bottom-right',
                    duration: 3000,
                    isClosable: true,
                })
                getCapitulos()
            } catch (error) {
                console.log(error)
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        getCapitulos();
    };

    return (
        <Flex justify="center">
            <Box maxWidth="1500px" minWidth="1000px">
                <Breadcrumb mb="20px">
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/obras'>Obras</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>{obra.nome}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Flex mb="10px" alignItems="center">
                    <form onSubmit={handleSearch} style={{ flex: 1 }}>
                        <InputGroup>
                            <Input
                                placeholder="Buscar capítulos..."
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
                                    aria-label="Buscar capítulos"
                                    icon={<SearchIcon />}
                                    onClick={handleSearch}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </form>
                    <Button 
                        size="sm" 
                        rightIcon={<AddIcon/>}
                        onClick={() => {
                            navigate('/capitulo', {
                                obra: id
                            })
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
                                <Th>Número</Th>
                                <Th>Tem páginas</Th>
                                <Th>Criado em</Th>
                                <Th>Ações</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {capitulos.map((capitulo) => (
                                <Tr key={capitulo.id}>
                                    <Td>{capitulo.nome}</Td>
                                    <Td>{capitulo.numero}</Td>
                                    <Td>{capitulo.tem_paginas ? "Sim" : "Não"}</Td>
                                    <Td>{dayjs(capitulo.criado_em).format('DD/MM/YYYY HH:mm')}</Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton size="md" as={IconButton} icon={<HamburgerIcon />} />
                                            <MenuList>
                                                <MenuItem icon={<IconEdit stroke={1.25} size={16}/>} onClick={() => onEdit(capitulo.id)}>
                                                    Editar
                                                </MenuItem>
                                                <MenuItem icon={<DeleteIcon size={16}/>} onClick={() => {
                                                    setIdAction(capitulo.id)
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
                                Excluir Capítulo
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Tem certeza? Você não poderá desfazer essa ação.
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

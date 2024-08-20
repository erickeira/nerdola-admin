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
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconEdit, IconListNumbers, IconPhoto , IconRowInsertTop , IconCloudUpload } from '@tabler/icons-react';
import { imageUrl } from '@/utils';
import { useRouter } from 'next/router';
import InputText from '@/components/inputs/InputText';


export default function Obras() {
    const { navigate , permissoes } = useGlobal()
    const [obras, setObras] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const { isOpen : isOpenAdicionar, onOpen : onOpenAdicionar, onClose: onCloseAdicionar } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()
   

    const router = useRouter()
    useEffect(() => {
        if(!permissoes?.permObras) {
           // router.back()
        }
    },[])

    const columnsAll = [
        {
            field: 'id',
            headerName: 'Id ',
            editable: false,
            // flex: 1,
            width: 20
        },
        {
            field: 'imagem',
            headerName: 'Imagem',
            width: 100,
            editable: false,
            renderCell: (params) => {
                const id = params.row.id
                return (
                    <Box height="80px" p="0px">
                        {
                            params.row?.imagem ?
                            <Image
                                src={`${imageUrl}obras/${id}/${params.row?.imagem}`}
                                w="100%"
                                h="100%"
                                objectFit="contain"
                            />
                            :
                            <Flex
                                flexDirection="column" 
                                gap={3} 
                                w={'100%'}
                                h={'100%'}
                                justify="center"
                                alignItems={'center'}
                                borderColor={'#fff'}
                                // bgColor="#f4f4f4"
                                borderRadius="5px"
                            >
                                <IconPhoto color="#666"/>
                            </Flex>
                        }
                    </Box>
                   
                )
            }
        },
        {
            field: 'nome',
            headerName: 'Nome ',
            editable: false,
            // flex: 1,
            width: useBreakpointValue({
                base: 200,
                lg: 400
            }),
        },
        {
            field: 'formato',
            headerName: 'Formato',
            width: 160,
            editable: false,
            valueGetter: (formato) => formato.nome
            
        },
        {
            field: 'atualizacoes',
            headerName: 'Atualização',
            width: 160,
            editable: false,
            valueGetter: (atualizacoes) => ({
                semanal : "Semanal",
                mensal: "Mensal",
                bisemanal: "Bi semanal"
            }[atualizacoes.frequencia])
        },
        {
            field: 'total_capitulos',
            headerName: 'Cap.',
            width: 80,
            editable: false
        },
        {
            field: 'capitulos_importados',
            headerName: 'Imp.',
            width: 80,
            editable: false
        },
        {
            field: 'total_usuarios_lendo',
            headerName: 'Lendo',
            width: 80,
            editable: false
        },
        {
            field: 'links',
            headerName: 'Links',
            width: 80,
            editable: false,
            valueGetter: (links) => links.length
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: false,
            width: 130,
            renderCell: (params) => {

                const statusColor = {
                    1 : 'blue',
                    2 : 'green',
                    3 : 'yellow',
                    4 : 'red'
                }[params?.value.id]

                return (
                    <Flex
                        height="100%"
                        align="center"
                        justify="center"
                    >
                        <Tag 
                            h="fit-content" 
                            px="15px"
                            colorScheme={statusColor}
                            borderRadius="full"
                            size="sm"
                            w="100px"
                            justifyContent="center"
                        >
                            {params?.value?.nome}
                        </Tag>
                    </Flex>
                )
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 80,
            cellClassName: 'actions',
            getActions: ({ id }) => {   
              return [
                <Menu>
                    <MenuButton size="md" as={IconButton} icon={<HamburgerIcon />}/>
                    <MenuList>
                        <MenuItem
                            icon={<IconEdit stroke={1.25} size={16}/>}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onEdit(id)
                            }}
                            size="sm"
                            height="40px"
                        >
                            Editar
                        </MenuItem>
                        <MenuItem
                            icon={<IconListNumbers stroke={1.25} size={16} />}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onCapitulos(id)
                            }}
                            size="sm"
                            height="40px"
                        >
                            Capitulos
                        </MenuItem>
                        <Divider my="8px"/>
                        <MenuItem
                            icon={<IconCloudUpload stroke={1.25} size={16} />}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                handleImportarPaginas(id)
                            }}
                            size="sm"
                            height="40px"
                        >
                            Importar páginas
                        </MenuItem>
                        <MenuItem
                            icon={<IconRowInsertTop  stroke={1.25} size={16} />}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                setIdAction(id)
                                onOpenAdicionar()
                            }}
                            size="sm"
                            height="40px"
                        >
                            Adicionar capitulos
                        </MenuItem>
                            
                        <Divider my="8px"/>
                        <MenuItem
                            icon={<DeleteIcon size={16}/>}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIdAction(id)
                                onOpenDelete();
                            }}
                            color="red.400"
                            size="sm"
                            height="40px"
                        >Excluir</MenuItem>
                    </MenuList>
                </Menu>,
              ];
            },
        },
    ];

    const columns  = useBreakpointValue({
        base: [
            columnsAll[1],
            columnsAll[2],
            columnsAll[10]
        ],
        lg: columnsAll
    }) 

    useEffect(() => {
        getObras()
    },[])

    const getObras = async () => {
        try{
            const response = await api.get('obras', {
                params: {
                    limite: 500
                }
            })
            setLoading(true)
            setObras(response.data)
        }catch(error){
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


    return (
        <Flex justify="center" >
            <Box 
                maxWidth="1500px"
                sx={{
                    '.even' : {
                        bgColor: '#f6f6f6'
                    }
                }}    
            >
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Obras</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Flex mb="10px">
                    <Spacer/>
                    <Button 
                        size="sm" 
                        rightIcon={<AddIcon/>}
                        onClick={() => {
                            navigate('/obra')
                        }}
                        variant="outline"
                        colorScheme="blue"
                    >
                        Adicionar
                    </Button>
                </Flex>
                <Divider my="30px"/>
                <DataGrid
                    rows={obras}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 100,
                        },
                    },
                    }}
                    rowHeight={80}
                    pageSizeOptions={[15]}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        // minHeight: "calc(100vh - 120px)",
                        backgroundColor: '#fff',
                    }}
                    localeText={ptBR}
                    autoHeight
                    getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                    }
                />
            </Box>
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
        </Flex>
    );
  }
  
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
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconListNumbers, IconPhoto , } from '@tabler/icons-react';
import { imageUrl } from '@/utils';


export default function Obras() {
    const { navigate } = useGlobal()
    const [obras, setObras] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()

    const columns = [
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
            width: 300,
        },
        {
            field: 'formato',
            headerName: 'Formato',
            width: 200,
            editable: false,
        },
        {
            field: 'total_capitulos',
            headerName: 'Num. capitulos',
            width: 130,
            editable: false
        },
        {
            field: 'total_usuarios_lendo',
            headerName: 'Estão lendo',
            width: 130,
            editable: false
        },
        {
            field: 'links',
            headerName: 'Num. links',
            width: 130,
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
                    1 : 'green'
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
            width: 200,
            cellClassName: 'actions',
            getActions: ({ id }) => {   
              return [
                <IconButton
                    icon={<IconListNumbers stroke={1.25} />}
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onCapitulos(id)
                    }}
                />,
                <IconButton
                    icon={<EditIcon/>}
                    onClick={(e) => {
                        e.stopPropagation(); 
                        onEdit(id)
                    }}
                />,
                <IconButton
                    icon={<DeleteIcon/>}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIdAction(id)
                        onOpenDelete();
                    }}
                    colorScheme="red"
                    bgColor="red.400"
                />
              ];
            },
        },
    ];

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
                <DataGrid
                    rows={obras}
                    columns={columns}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 50,
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
        </Flex>
    );
  }
  
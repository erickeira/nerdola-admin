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
import { IconListNumbers, IconPhoto , IconCheck , IconX } from '@tabler/icons-react';
import { imageUrl } from '@/utils';
import dayjs from 'dayjs'


export default function Pedidos() {
    const { navigate } = useGlobal()
    const [pedidos, setPedidos] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()

    const columns = [
        {
            field: 'nome',
            headerName: 'Nome ',
            editable: false,
            // flex: 1,
            width: 300,
        },
        {
            field: 'onde_ler',
            headerName: 'Onde Ler',
            width: 200,
            editable: false,
        },
        {
            field: 'usuario',
            headerName: 'Quem pediu',
            width: 200,
            editable: false,
            valueGetter: (value) => value.nome
        },
        {
            field: 'criado_em',
            headerName: 'Pedido em',
            width: 200,
            editable: false,
            valueGetter: (value) => dayjs(value).format('DD/MM/YYYY HH:mm')
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: false,
            width: 130,
            renderCell: (params) => {

                const statusColor = {
                    "publicado" : 'green',
                    "em_analise" : 'yellow',
                    "reprovado" : 'red'
                }[params?.value]

                const statusLabel = {
                    "publicado" : 'Publicado',
                    "em_analise" : 'Em analise',
                    "reprovado" : 'Reprovado'
                }[params?.value]

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
                            {statusLabel}
                        </Tag>
                    </Flex>
                )
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 250,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {   
              if(row.status == 'em_analise'){
                return [
                    <IconButton
                        colorScheme={"green"}
                        icon={<IconCheck strokeWidth={1.5}/>}
                        onClick={(e) => {
                            e.stopPropagation(); 
                            onEdit(row.id, row.nome)
                        }}
                        size="sm"
                    />,
                    <IconButton
                        icon={<IconX/>}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIdAction(id)
                            onOpenDelete();
                        }}
                        colorScheme="red"
                        bgColor="red.400"
                        size="sm"
                    />
                  ]
              }else if(row.status == 'publicado' && row.obra.id){
                return  [
                    <Button
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            navigate(`/obra/${row.obra.id}`)
                        }}
                    >
                        Ver obra
                    </Button>
                  ]
              }else{
                return []
              }
            },
        },
    ];

    useEffect(() => {
        getPedidos()
    },[])

    const getPedidos = async () => {
        try{
            const response = await api.get('pedido')
            setLoading(true)
            setPedidos(response.data)
        }catch(error){
          console.log(error)
        } finally {
          setLoading(false)
        }
    }

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
                    rows={pedidos}
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
        </Flex>
    );
  }
  
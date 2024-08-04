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

    useEffect(() => {
        if(!permissoes?.permSites) {
           // router.back()
        }
    },[])

    const columnsAll = [
        {
            field: 'id',
            headerName: 'ID',
            editable: false,
            // flex: 1,
        },
        {
            field: 'nome',
            headerName: 'Nome',
            width: 250,
            editable: false,
        },
        {
            field: 'url',
            headerName: 'Endereço',
            width: 300,
            editable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            editable: false,
            width: 150,
            renderCell: (params) => {

                const statusColor = {
                    "ativo" : 'green',
                    "inativo" : 'red'
                }[params?.value]

                const statusLabel = {
                    "ativo" : 'Ativo',
                    "inativo" : 'Inativo'
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
            width: 80,
            cellClassName: 'actions',
            getActions: ({ id }) => {   
              return [
                <Menu>
                    <MenuButton size="md" as={IconButton} icon={<HamburgerIcon />}/>
                    <MenuList>
                        <MenuItem
                            icon={<IconEdit stroke={1.25}size={16}/>}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onEdit(id)
                            }}
                            size="sm"
                            height="40px"
                        >
                            Editar
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
                </Menu>
              ];
            },
        },
    ];

    const columns  = useBreakpointValue({
        base: [
            columnsAll[1],
            columnsAll[4]
        ],
        lg: columnsAll
    }) 


    useEffect(() => {
        getDados()
    },[])

    const getDados = async () => {
        try{
            const response = await api.get(`${key}`)
            setLoading(true)
            setDados(response.data)
        }catch(error){
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
                        <BreadcrumbLink href='#'>{keyName}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Flex mb="10px">
                    <Spacer/>
                    <Button 
                        size="sm" 
                        rightIcon={<AddIcon/>}
                        onClick={() => {
                            navigate(`/${editKey}`)
                        }}
                        variant="outline"
                        colorScheme="blue"
                    >
                        Adicionar
                    </Button>
                </Flex>
                <DataGrid
                    rows={dados}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                            pageSize: 15,
                            },
                        },
                    }}
                    pageSizeOptions={[15]}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        // minHeight: "calc(100vh - 120px)",
                        backgroundColor: '#fff',
                        width: '100%'
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
  
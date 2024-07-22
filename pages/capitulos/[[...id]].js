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
} from '@chakra-ui/react';
import { useGlobal } from '@/context/GlobalContext';
import { ptBR } from '@/utils/datagrid_ptBr';
import { AddIcon, DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';
import api from '@/utils/api';
import { IconPhoto , } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { imageUrl } from '@/utils';


export default function Capitulos() {
    const keyName = "Capitulos"
    const key = "capitulos";
    const editKey = "capitulo";
    const { navigate } = useGlobal()
    const [dados, setDados] = useState([])
    const [ isLoading, setLoading] = useState(true)
    const { isOpen : isOpenDelete, onOpen : onOpenDelete, onClose: onCloseDelete } = useDisclosure()
    const [ idAction, setIdAction ] = useState(null)
    const cancelRef = useRef()
    const toast = useToast()
    const router = useRouter()
    const { id } = router.query

    const columns = [
        {
            field: 'imagem',
            headerName: 'Imagem',
            width: 100,
            editable: false,
            renderCell: (params) => {
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
            headerName: 'Nome',
            width: 300,
            editable: false,
        },
        {
            field: 'numero',
            headerName: 'Número',
            width: 250,
            editable: false,
        },
        {
            field: 'criado_em',
            headerName: 'Criado em',
            width: 250,
            editable: false,
            valueGetter: (criado_em) => dayjs(criado_em).format('DD/MM/YYYY hh:mm')
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


    const getDados = async (id) => {
        try{
            const response = await api.get(`${key}`,{
                params:{
                    obr_id: id
                }
            })
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

    useEffect(() => {
        if(id) {
            getObra(id)
            getDados(id)
        }
     },[id])

     const [obra, setObra] = useState({})
    const getObra = async (id) => {
        setLoading(true)
        try{
            const response = await api.get(`obras/${id}`)
            setObra({
              ...response.data,
              tags: response.data.tags?.map(tag => tag.id),
              status: response.data.status.id
            })
        }catch(error){

        } finally {
            setLoading(false)
        }
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
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>{keyName}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>{obra.nome}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Divider my="30px"/>
                <Flex mb="10px">
                    <Button
                    w="150px"
                    onClick={() => {
                        router.back()
                    }}
                    size="sm"
                    >
                    Voltar
                    </Button>
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
                    rowHeight={80}
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
  
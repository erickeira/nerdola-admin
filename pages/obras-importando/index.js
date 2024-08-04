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


export default function Obras() {
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

    const columnsAll = [
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

    ];

    const columns  = useBreakpointValue({
        base: [
            columnsAll[0],
            columnsAll[1]
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
                    limite: 500,
                    importando : true
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
                        <BreadcrumbLink href='#'>Obras importando</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
              
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
        </Flex>
    );
  }
  
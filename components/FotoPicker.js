import React, { FC, useState, useCallback, forwardRef, useEffect, memo } from 'react';
import {
    DndContext,
    closestCenter,
    MouseSensor,
    PointerSensor,
    TouchSensor,
    DragOverlay,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
    Box,
    Flex,
    AspectRatio,
    Image as ImageChakra ,
    Text,
    Tag,
    IconButton,
    useToast,
    List,   
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
    Button,
    ScaleFade,
    Grid,
    Checkbox,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    CircularProgress,
    useBreakpointValue,
    GridItem,
} from '@chakra-ui/react'
import { 
  IconPhoto, 
  IconTrash,
  IconUpload,
  IconAlertCircle
} from '@tabler/icons-react';
import {  resizeImage } from '@/utils'
import Dropzone, { useDropzone } from 'react-dropzone';
import { faker } from '@faker-js/faker';

const FotoPicker = ({ imagem, onChange, height, url }) => {
    const [image, setImage] = useState(imagem)
    const [ imageError, setImageError] = useState(false)
    const [ deleteHovered, setDeleteHovered] = useState(false)
    const [ hovered, setHovered] = useState(false)
    const showButton = useBreakpointValue({
        base: true,
        lg: hovered
    })
    
    const toast = useToast()
    useEffect(() => {
        if(imagem != image) {
            setImage(imagem)
            setImageError(false)
        }
    },[imagem])
    
    const onDrop = async (fotosDrop) => {
        const fotosUri = await Promise.all(
            fotosDrop.map(async (file) => {
                    if (file.size > 10 * 1024 * 1024) {
                        toast({
                          description: 'A imagem não deve exceder 10 MB',
                          status: 'error',
                          duration: 3000,
                          isClosable: true,
                          position: 'bottom-right',
                        });
                        return null;
                    }
                   
                    // const extension = file.name.split('.').pop().toLowerCase();
                    // if (extension !== 'jpg' && extension !== 'jpeg') {
                    //     toast({
                    //         description: 'A imagem deve estar no formatado JPG',
                    //         status: 'error',
                    //         duration: 3000,
                    //         isClosable: true,
                    //         position: 'bottom-right',
                    //     });
                    //     return null;
                    // }
                    
                  const base64String = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                  });
                  
                  const img = await new Promise((resolve) => {
                    const image = new Image();
                    image.onload = () => resolve(image);
                    image.src = base64String;
                  });
    
                //   if (img.width < 640 || img.height < 480) {
                //     toast({
                //       description: 'A imagem deve ter pelo menos 640x480 pixels',
                //       status: 'error',
                //       duration: 3000,
                //       isClosable: true,
                //       position: 'bottom-right',
                //     });
                //     return null; 
                //   }
    
                  const resizedImage = await resizeImage(base64String);
                  return resizedImage;
            })
         );

        let newImage = fotosUri[0]
        
        if(onChange && newImage) {
            setImage(newImage)
            onChange(newImage);
        }
    }
    
    function handleDelete(){
        setImage('')
        onChange('')  
    }
    
  
    const [ imageOpened, setImageOpened ] = useState({})
    const { acceptedFiles, getRootProps, getInputProps, open  } = useDropzone({ onDrop })


    return (
        <>
        <Flex gap="20px" flexDirection={{ base: 'column', lg: 'row'}}>
            <Box width={"300px"} height={height || "440px"} bgColor="#f4f4f4" overflow="hidden">
                {
                    image ? 
                    (
                        !imageError ? 
                        <ImageChakra 
                            src={image.endsWith('.jpg') && !image.startsWith('http') ? `${url}${image}` : image}
                            alt={""}
                            width="100%"
                            onError={() => setImageError(true)}
                            objectFit='contain' 
                        />  
                        :
                        <Flex color="#666" direction="column" align="center" justify="center" h="100%">
                            <IconAlertCircle/>
                            <Text>
                                Erro na imagem
                            </Text>
                        </Flex>
                    )
            
                    :
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
                        <IconPhoto color="#666"/>
                    </Flex>
                }
            </Box>
        
            {
                !image ?
                <Box {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Box cursor="pointer">
                        <Flex 
                            mb={3} 
                            mt={5} 
                            size="sm" 
                            variant='outline'
                            border= "1px solid #2b6cb0"
                            color="#2b6cb0"
                            w="auto"
                            p="8px 16px"
                            borderRadius="4px"
                            gap="8px"
                            align="center"
                            _hover={{
                                backgroundColor: '#ebf8ff'
                            }}
                            justify="center"
                        >
                            <IconUpload size={16}/>
                            Selecionar imagem
                        </Flex>
                        <Flex display={{ base: 'none', lg: 'flex'}} mb={3} p={8} align="center" justify="center" borderWidth={2} borderStyle="dotted">
                            <Text color="#666" fontSize="12px">Arraste a imagem até aqui para fazer upload</Text>
                        </Flex>
                    </Box>
                </Box>
                :
                <Box >
                     <Flex 
                        mb={3} 
                        mt={5} 
                        size="sm" 
                        variant='outline'
                        border= "1px solid #990000"
                        color="#990000"
                        w="auto"
                        p="8px 16px"
                        borderRadius="4px"
                        gap="8px"
                        align="center"
                        _hover={{
                            backgroundColor: '#ebf8ff'
                        }}
                        justify="center"
                        onClick={handleDelete}
                    >
                        <IconTrash color="#990000" size="15px"/>
                        Remover imagem
                    </Flex>
                </Box>
            }
        </Flex>
        </>
    );
};

export default FotoPicker;

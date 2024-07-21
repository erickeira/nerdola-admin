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

const FotoPicker = ({ imagem, onChange}) => {
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
        setImage(imagem)
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
                   
                    const extension = file.name.split('.').pop().toLowerCase();
                    if (extension !== 'jpg' && extension !== 'jpeg') {
                        toast({
                            description: 'A imagem deve estar no formatado JPG',
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                            position: 'bottom-right',
                        });
                        return null;
                    }
                    
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
    
                  if (img.width < 640 || img.height < 480) {
                    toast({
                      description: 'A imagem deve ter pelo menos 640x480 pixels',
                      status: 'error',
                      duration: 3000,
                      isClosable: true,
                      position: 'bottom-right',
                    });
                    return null; 
                  }
    
                  const resizedImage = await resizeImage(base64String);
                  return resizedImage;
            })
         );

        let newImage = fotosUri[0]
        
        if(onChange && newImage) {
            
            onChange(newImage);
        }
    }
    
    function handleDelete(){
        setImage('')
        onChange('')  
    }
    
    const { isOpen: isOpenFoto, onOpen: onOpenFoto, onClose: onCloseFoto } = useDisclosure()
    const [ imageOpened, setImageOpened ] = useState({})
    const { acceptedFiles, getRootProps, getInputProps, open  } = useDropzone({ onDrop })

    return (
        <>
        <Flex gap="20px">
            <Box width={"300px"} height={"400px"}>
                {
                    image ? 
                    <Flex
                        bgColor="#D9D9D9"
                        boxShadow={ isDragging  ? 'rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px' : 'rgb(63 63 68 / 5%) 0px 0px 0px 1px, rgb(34 33 81 / 15%) 0px 1px 3px 0px'}
                        w={"100%"}
                        flexDirection="column" 
                        justify="center"
                        alignItems={'center'}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Box
                            position="absolute"
                            right="3"
                            top="3"
                        >
                            <ScaleFade
                                in={showButton && !isDragging}
                            >
                                <IconButton
                                    size={"sm"}
                                    icon={<IconTrash color="#fff" size="15px"/>}
                                    borderRadius="100%"
                                    bgColor="#990000"
                                    _hover={{
                                        bgColor: "#C23131"
                                    }}                   
                                    onClick={handleDelete}
                                    onMouseEnter={() => setDeleteHovered(true)}
                                    onMouseLeave={() => setDeleteHovered(false)}
                                />
                            </ScaleFade>
                        </Box>
                        
                        {
                        !imageError ? 
                            <ImageChakra 
                                src={image}
                                alt={""}
                                onError={() => setImageError(true)}
                                objectFit='contain' 
                                onClick={!deleteHovered ? onOpenFoto : () => {}}
                            />  
                            :
                            <Flex color="#666" direction="column" align="center">
                                <IconAlertCircle/>
                                <Text>
                                    Erro na imagem
                                </Text>
                            </Flex>
                        }
                        
                    </Flex>
                    :
                    <Flex
                        flexDirection="column" 
                        gap={3} 
                        w={'100%'}
                        h={'100%'}
                        justify="center"
                        alignItems={'center'}
                        borderColor={'#fff'}
                        bgColor="#f4f4f4"
                        borderRadius="5px"
                    >
                        <IconPhoto color="#666"/>
                    </Flex>
                }
            </Box>
        
            {
                !image &&
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
            }
        </Flex>
        <Modal isOpen={isOpenFoto} onClose={onCloseFoto}>
            <ModalOverlay />
            <ModalContent mx="10px">
              <ModalBody 
                minH="100px" 
                w="100%"
                p="5px"
               
            >
                <Flex
                    align="center"
                    minH="300px"
                    h="100%"
                >
                   <ImageChakra 
                        src={image}
                        // alt={props.foto?.title}
                        objectFit='contain' 
                        zIndex={2}
                    />  
                    <CircularProgress
                        isIndeterminate
                        position="absolute"
                        top="45%"
                        left="45%"
                    />
                </Flex>
            
             
              </ModalBody>
            </ModalContent>
        </Modal>
        </>
    );
};

export default FotoPicker;

import { useGlobal } from '@/context/GlobalContext'
import { CloseIcon, DeleteIcon } from '@chakra-ui/icons'
import { 
    Box,
    Text,
    Flex,
    Link,
    Image as ImageChakra,
    Button,
    IconButton,
    FormHelperText,
    AspectRatio
} from '@chakra-ui/react'
import React, {useCallback, useEffect, useState} from 'react'
import { useDropzone } from 'react-dropzone'

export default function Dropzone({
    label,
    onChange,
    labelFontSize,
    value,
    isDisabled,
    isError,
    errorText,
    helperText,
    helperTextColor,
    dropRef,
    onClick,
    containerProps,
    width
}) {
    const { translated_messages, snackbar } = useGlobal()
    const [image, setImage] = useState('')
    const onDrop = async (fotosDrop) => {
        const fotosUri = await Promise.all(
            fotosDrop.map(async (file) => {
                //   if (file.size > 0.4 * 1024 * 1024) {
                //     // Exibir uma mensagem de erro se a imagem exceder 10 MB
                //     snackbar.error({
                //         title: 'A imagem não deve exceder 400 KB'
                //     })
                //     return null;
                //   }
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
    
                //   if (img.width > 800 || img.height > 400) {
                //     snackbar.error({
                //         title: 'A imagem deve ter no máximo 800x400 pixels'
                //     })
                //     return null; 
                //   }
                  return base64String;
            })
        )
        setImage(fotosUri[0])
        if(onChange) onChange(fotosUri[0])
    }
    const handleDelete = () => {
        setImage('')
        if(onChange) onChange('')
    }
    useEffect(() => {
        setImage(value)
    },[value])

    const {getRootProps, getInputProps} = useDropzone({ onDrop, disabled: isDisabled })
    

  return (
    
    <Box ref={dropRef} >
        <Text
            fontSize={labelFontSize || '14px'}
            fontWeight={'500'}
            lineHeight={'20px'}
            as="b"
            color="#515151"
        >
            {label}
        </Text>
        <AspectRatio
            width={width || "100%"}
        >
            <Flex
                w="100%"
                h="100%"
                direction="column"
                align="center"
                justify="center"
                bgColor="#FAFAFA"
                border="1px dotted #d1d1d1"
                borderColor={isError && "#E53E3E"}
                borderRadius="12px"
                cursor={ "pointer"}
                gap="4px"
                position="relative"
            >
                <input {...getInputProps()} />
                {
                    !!image ?
                    <Flex w="100%" h="68px" align="center" justify="center">
                        <ImageChakra
                            src={image}
                            h={"68px"}
                            objectFit="contain"
                            onClick={onClick}
                        />
                        {
                            !isDisabled &&
                            <Flex
                                position="absolute"
                                right="2px"
                                top="2px"
                            >
                                <IconButton
                                    borderRadius="full"
                                    icon={<DeleteIcon fontSize="10px"/>}
                                    p="0px !important"
                                    minW="25px !important"
                                    height="25px !important"
                                    colorScheme="red"
                                    onClick={handleDelete}
                                />
                            </Flex>
                        }
                        
                    </Flex>
                
                    :
                    isDisabled ?
                    <Text
                        fontSize={{
                            base: "12px",
                            lg: "12px"
                        }}   
                        color="#707A75"
                    >
                        Não inserido
                    </Text> 
                    :
                    <Flex 
                        align="center"
                        justify="center"
                        direction="column"
                        h="68px"
                        {...getRootProps()}
                    >
                    
                        <Text
                            fontSize={{
                                base: "10px",
                                lg: "10px"
                            }}   
                            color="#707A75"
                            textAlign="center"
                        >
                            Carregar imagem
                        </Text>
            
                    </Flex>
                }
            </Flex>
        </AspectRatio>
        {isError && 
        <Text
            fontSize={10}
            fontWeight={500}
            color={'#E53E3E'}
        >{errorText || ''}</Text>
        }
        { helperText && !isError &&
            <Text
                fontSize={10}
                fontWeight={500}
                color={helperTextColor || "#666"}
            >
            {helperText}
            </Text>
        }
    </Box>
    
  )
}
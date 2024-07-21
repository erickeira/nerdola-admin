import InputSelect from "@/components/inputs/InputSelect";
import { 
    Box, 
    Button, 
    Checkbox, 
    Divider, 
    Flex, 
    Image, 
    Link,
    Spacer,
    Text,
    SimpleGrid, 
    border,
    IconButton,
    InputRightElement,
    Tag,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import InputText from "@/components/inputs/InputText";
import Dropzone from"@/components/Dropzone";
import { IconTrash, IconEdit  } from "@tabler/icons-react";

const Variant = ({
    variant = {},
    onChange
}) => {
    
    const handleChange = (val) => {
        onChange({ ...variant, ...val })
    }

    return(
        <Flex 
            border="1px solid #D9D9D9"
            p="15px"
            borderRadius="8px"
            align="center"
            gap="15px"
            direction={{
                base: "column",
                md: "row"
            }}
        >
            <Box 
                width={{
                    base: "100%",
                    md: "100px"
                }}
            >
                <Dropzone 
                    isDisabled={!!variant?.vrnt_foto?.src}
                    value={variant?.vrnt_foto?.src || variant?.vrnt_foto?.uri}
                    onChange={(base64) => {
                        handleChange({ vrnt_foto : { uri: base64 }})
                    }}
                    width={{
                        base: "100%",
                        md: "100px"
                    }}
                />
            </Box>
            <Flex align="center" h="100%" justify="flex-start">
                <Text
                    fontWeight="500"
                    fontSize="16px"
                    lineHeight="0px"
                    py="10px"
                    h="30px"
                    display="contents"
                >
                    { variant?.vrnt_opcoes?.map((opc, index) => (opc.opc_value)).join(' / ') || "Padrão" }
                </Text>
            </Flex>
            <Spacer/>
            <InputText
                placeholder="Preço"
                h="40px"
                containerProps={{
                    mb: '0px',
                    width: {
                        base: "100%",
                        md: "200px"
                    }
                }}
            />
        </Flex>
    )
}

const OptionForm = ({
    option,
    onCancel,
    onChange
}) => {
    const [ formOption, setFormOption] = useState(option || {
        opc_nome : '',
        opc_valores : [ ]
    })
    const handleNewValue = () => {
        const opc_valores = [ ...formOption.opc_valores]
        opc_valores.push('')
        setFormOption({ opc_nome: formOption.opc_nome, opc_valores })
    }

    const handleDeleteValue = (index) => {
        const opc_valores =  formOption?.opc_valores.filter((val, i) => i != index)
        setFormOption({ opc_nome: formOption.opc_nome, opc_valores })
    }

    const handleChange = () => {
        formOption.opc_valores = formOption.opc_valores.filter(val => !!val)
        if(onChange) onChange(formOption)
        setFormOption({
            opc_nome : '',
            opc_valores : [ ]
        })
    }


    return(
        <Box>
            <Flex 
                gap={{
                    base: "36px",
                    md: "16px"
                }}
                direction={{
                    base: 'column',
                    md: 'row'
                }}
            >
                <Flex w="100%">
                    <InputText
                        value={formOption.opc_nome}
                        placeholder="Cor, Tamanho, Peso..."
                        onChange={(e) => {
                            setFormOption({ opc_nome: e.target.value, opc_valores: formOption.opc_valores })
                        }}
                        label="Nome da opção"
                        containerProps={{
                            mb: '0px',
                            h: '40px'
                        }}
                        height="40px"
                    />
                </Flex>
                <Box w="100%">
                    <Text
                        fontSize={'14px'}
                        fontWeight={'500'}
                        lineHeight={'20px'}
                        color={'#0C0C0C'}
                        mb="5px"
                        // as='b'
                    >Valores da opção</Text>
                    {
                        formOption?.opc_valores?.map((val, index) => (
                            <InputText
                                value={val}
                                onStopType={(string) => {
                                    const opc_valores = formOption?.opc_valores?.map((value, i) => {
                                        if(i != index) return value
                                        else return string
                                    })
                                    setFormOption({ ...formOption, opc_valores })
                                }}
                                containerProps={{
                                    mb: '5px',
                                    h: '40px'
                                }}
                                height="40px"
                                rightElement={
                                    <InputRightElement>
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            p="0px"
                                            height="30px"
                                            icon={<CloseIcon size="12px"/> }
                                            onClick={() => {
                                                handleDeleteValue(index)
                                            }}
                                        />
                                    </InputRightElement>
                                }
                                key={index}
                            />
                        ))
                    }
                    {
                        formOption?.opc_valores?.length < 5 &&
                        <Button
                            variant="ghost"
                            leftIcon={<AddIcon size="12px"/>}
                            textDecoration="underline"
                            border="0.52px solid #D0D5DD"
                            _hover={{
                                bgColor: '#fff'
                            }}
                            onClick={handleNewValue}
                            w="100%"
                            h="40px"
                            justifyContent="flex-start"
                            // mt="5px"
                            borderRadius="0px"
                            fontSize="14px"
                        >
                            Adicionar outro valor
                        </Button>
                    }
                    
                </Box>
            </Flex>

            <Flex gap="8px" mt="32px">
                <Button
                    colorScheme="blue"
                    onClick={handleChange}
                    isDisabled={
                        !formOption?.opc_nome 
                        || !formOption?.opc_valores?.length
                        // || !!formOption.values.find(val => !val.length)
                    }
                >
                    Salvar
                </Button>
                <Button
                    variant="red_outline"
                    border="0px"
                    _hover={{
                        border: '0px'
                    }}
                    boxShadow="0 0 0 0 "
                    onClick={onCancel}
                >
                    Cancelar
                </Button>
            </Flex>
        </Box>
    )
}


const getVariants = (options, existingVariants = []) => {
    let newVariants = [];

    const hasOptions = options && options?.length > 0;

    if (!hasOptions) {
        return [{
            vrnt_id: Math.random().toString(36).substr(2, 9),
            vrnt_preco: 0
        }];
    }
    
    for (const option of options) {
        const values = option?.opc_valores || []
        for (const opc_value of values) {
            if(newVariants.length && newVariants.length >= options[0]?.opc_valores.length){
                for (const variant of newVariants) {
                    if(variant?.vrnt_opcoes?.length < options.length){
                        const matchingVariant = existingVariants.find((existingVar) => {
                            const existingOptions = existingVar.vrnt_opcoes.map((opc) => opc.opc_nome).sort();
                            const variantOptions = variant.vrnt_opcoes.map((opc) => opc.opc_nome).sort();
                            
                            return existingOptions.length === variantOptions.length &&
                                   existingOptions.every((opt, index) => opt === variantOptions[index]);
                        }) || {};
                        if(!variant.vrnt_opcoes.find((opc) => opc.opc_nome == option.opc_nome )){
                            let newVariant = {
                                ...variant,
                                ...matchingVariant,
                                vrnt_opcoes: [ ...variant.vrnt_opcoes, ...[{ opc_nome: option.opc_nome , opc_value  }]]
                            }
                            newVariants.push(newVariant)
                        }
                        
                    }
                }
            }else{
                let newVariant = {
                    vrnt_id: Math.random().toString(36).substr(2, 9),
                    vrnt_preco: 0,
                    vrnt_opcoes: [{ opc_nome: option.opc_nome , opc_value  }]
                }
                newVariants.push(newVariant)
            }
        }
    }
    newVariants = newVariants.filter(opt => opt?.vrnt_opcoes?.length >= options?.length);
    newVariants.sort((a, b) => {
        const aFirstOption = a.vrnt_opcoes[0]?.opc_value || '';
        const bFirstOption = b.vrnt_opcoes[0]?.opc_value || '';
        return aFirstOption.localeCompare(bFirstOption);
    });
    return newVariants;
};

export default function Variants({
    produto = [],
    handleChange
}) {
    const [options , setOptions] = useState(produto?.prodt_opcoes || [])
    const [addingNewOption ,setAddingNewOption] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(null)


    const [variants, setVariants] = useState(getVariants(produto.prodt_opcoes,produto.prodt_variants ))

    const handleChangeOption = (newOption) => {
        let newOptions = [];
        if(selectedIndex == null){
            newOptions = [ ...(options || []), newOption]
        }else{
            newOptions = options?.map((opt, i) => {
                if(i != selectedIndex) return opt
                else return newOption
            }) || []
        }
        console.log('newOptions', newOptions)
        setOptions(newOptions)
        setAddingNewOption(false)
        setSelectedIndex(null)

        const newVariants = getVariants(newOptions, variants);
        setVariants(newVariants)
        if(handleChange) handleChange({ prodt_opcoes: newOptions, prodt_variants : newVariants })
    }

    useEffect(() => {
        setOptions(produto.prodt_opcoes)
        const newVariants = getVariants(produto.prodt_opcoes,produto.prodt_variants);
        setVariants(newVariants)
    },[produto.prodt_opcoes])


    const handleOption = (index = null) => {
        setAddingNewOption(true)
        setSelectedIndex(index)
    }

    const handleCancel = () => {
        setAddingNewOption(false)
    }
    
    const handleDeleteOption = (index) => {
        const newOptions = options.filter((o, i) => i != index)
        const newVariants = getVariants(newOptions, variants);
        setOptions(newOptions)
        setVariants(newVariants)
        if(handleChange) handleChange({ prodt_opcoes: newOptions, prodt_variants : newVariants })
    }

    const handleChangeVariant = (index, variant) => {
        let newVariants = variants.map((vrnt, i) => {
            if(i == index) return { ...vrnt, ...variant }
            else return vrnt
        })

        if(handleChange) handleChange({ prodt_variants : newVariants })
    }

    return (
      <Box
        bgColor="#fff"
        borderRadius="8px"
        m="0px"
      >
        <Text as="b">Opções:</Text>
        <Divider my="24px" />
        <Flex justify="space-between" align="center" mb="15px">
            <Link
                variant="ghost"
                textDecoration="underline"
                _hover={{
                    textDecoration: "underline"
                }}
                onClick={() => handleOption()}
                fontSize="14px"
                alignItems="center"
            >
                <AddIcon size="12px" mr="10px"/>
                Adicionar opções como tamanho ou cor
            </Link>
            {/* <Button
                variant="solid_white"
                _hover={{
                    bgColor: '#fff'
                }}
            >
                Alterar preço de todos
            </Button> */}
        </Flex>
        <Box mb="20px">
            {
                addingNewOption ? 
                <OptionForm
                    option={options?.find((o, i) => i == selectedIndex)}
                    onChange={handleChangeOption}
                    onCancel={handleCancel}
                />
                :
                <Flex 
                    direction="column"
                    gap="4px"
                >
                    {
                        options?.map((opc, index) => (
                            <Box mb="10px">
                                <Text
                                    fontWeight="500"
                                    fontSize="12px"
                                    color="#0C0C0C"
                                    mb="10px"
                                >
                                    {opc.opc_nome}
                                </Text>
                                <Flex
                                    border="0.52px solid #D0D5DD"
                                    boxShadow="0px 0.52px 1.04px 0px #1018280D"
                                    padding="5px"
                                    borderRadius="5px"
                                    justify="space-between"
                                    width="100%"
                                >
                                    <Flex
                                        gap="8px"
                                        flexWrap="wrap"
                                        width="100%"
                                    >
                                        {
                                            opc.opc_valores?.map(val => (
                                                <Tag
                                                    borderRadius="4px"
                                                    bgColor="#f6f6f6"
                                                    fontWeight="500"
                                                    fontSize="14px"
                                                    width="fit-content"
                                                >

                                                    {val}
                                                </Tag>
                                            ))
                                        }
                                    </Flex>
                                    <Flex gap="4px">
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            p="0px"
                                            height="30px"
                                            icon={<IconEdit size="15px"/>}
                                            onClick={() => {
                                                handleOption(index)
                                            }}
                                        />
                                        <IconButton
                                            size="sm"
                                            variant="ghost"
                                            p="0px"
                                            height="30px"
                                            icon={<IconTrash size="15px"/>}
                                            onClick={() => {
                                                handleDeleteOption(index)
                                            }}
                                        />
                                    </Flex>
                                </Flex>
                            </Box>
                        ))
                    }
                </Flex>
            }
        </Box>
        <Text as="b" >Variantes:</Text>
        <Divider my="24px" />
        <InputSelect
            label="Produto cobrado por:"
            placeholder="Ex: und, dia, hora.."
            h="40px"
            width="200px"
        />
        <Flex direction="column" gap="10px">
            {
                variants?.map((variant, index) => (
                    <Variant
                        variant={variant}
                        onChange={(variant) => {
                            handleChangeVariant(index, variant)
                        }}
                    />
                ))
            }
        </Flex>
        
      </Box>
    );
  }
  
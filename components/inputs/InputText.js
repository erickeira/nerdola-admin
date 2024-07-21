import { formatMoneyBase, formatNumberBase } from '@/utils';
import { SearchIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { 
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Image,
  InputLeftElement,
  Textarea 
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useMask } from '@react-input/mask';

const CustomInput = ({
  name,
  placeholder,
  placeholderFontSize,
  leftElement,
  rightElement,
  bgColor,
  inputValue,
  handleInputChange,
  isDisabled,
  others,
  type,
  show,
  area,
  mask,
  inputRef
}) => {
  const maskRef = mask ? useMask({ mask: mask || '*' , replacement: { _: /\d/ } }) : null;
  const CompInput = area ? Textarea : Input
  return(
    <CompInput
        name={name}
        inputRef={inputRef}
        ref={mask ? maskRef:  inputRef}
        type={
        type == 'password' ? (
            show ? 'text' : 'password'
        ) : type
        } 
        placeholder={placeholder} 
        _placeholder={{
        color: '#8C8C8C',
        fontSize: placeholderFontSize || '14px'
        }}
        _disabled={{
        _hover: {
            boxShadow: `0 0`,
        }
        }}
        _hover={{
          boxShadow: `0 0 0 1.5px #adadad`,
        }}
        _focusVisible={{
          boxShadow: `0 0 0 1.5px #adadad`
        }}
        fontSize="14px"
        padding="10px 14px"
        paddingLeft={leftElement && '45px'}
        color="#0C0C0C"
        borderRadius={0}
        bgColor={bgColor || "#FFF" }
        borderRightWidth={rightElement && 0}
        value={inputValue} 
        onChange={handleInputChange} 
        inputprops={{
        sx: {'-webkit-box-shadow': '0 0 0px 1000px white inset'},
        
        }}
        isDisabled={isDisabled}
        w={"100%"}
        border="1px solid #D9D9D9"
        {...others}
    />
  )
}

export default function InputText({
  label = ' ',
  labelFontSize,
  placeholder = '',
  containerProps,
  inputProps,
  isError,
  errorText,
  helperText,
  onChange,
  value,
  type = 'text',
  name = '',
  mask,
  onBlur,
  onKeyUp,
  onKeyPress,
  inputRef = undefined,
  isDisabled,
  labelColor,
  helperTextColor,
  leftElement,
  rightElement,
  onStopType,
  placeholderFontSize,
  bgColor,
  mb,
  onClick,
  area,
  ...others
}){
  const [inputValue, setInputValue] = useState('')
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(!show)

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if(onChange) onChange(e)
  }

  useEffect(() => {
    if(value != inputValue) setInputValue(value || '')
  },[value])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      handleStopType()
    }, 500);
    return () => clearTimeout(timeOut);
  }, [inputValue]);

  const handleStopType = (e = '') => {
    if (onStopType) {
      let auxInputValue = inputValue || e
      onStopType(auxInputValue || '');
    }
  } 

  return(
    <FormControl onClick={onClick} isInvalid={isError} mb={mb || '0px'} {...containerProps} >
      <FormLabel
        fontSize={labelFontSize || '14px'}
        fontWeight={'500'}
        lineHeight={'20px'}
        color={labelColor ||  '#0C0C0C'}
        as='b'
      >{label}</FormLabel>
      <InputGroup size='md'>
        { leftElement }
          <CustomInput
            mask={mask}
            name={name}
            placeholder={placeholder}
            placeholderFontSize={placeholderFontSize}
            leftElement={leftElement}
            rightElement={rightElement}
            bgColor={bgColor}
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            isDisabled={isDisabled}
            others={others}
            type={type}
            show={show}
            area={area}
            inputRef={inputRef}
          />
        {
          type == 'password' && inputValue &&
          <InputRightElement width='4.5rem'>
            <Button 
              onClick={handleShow}
              variant={"ghost"}
              borderRadius="100%"
              padding="0"
              width="35px"
              height="35px"
            >
              {
                show ?  
                <ViewIcon color="#666"/> 
                : 
                <ViewOffIcon color="#666"/>
              }
            </Button>
          </InputRightElement>
        }
        {
            rightElement &&
            <InputRightElement width='4.5rem'>
                {rightElement}
            </InputRightElement>
        }
      </InputGroup>
      {isError && 
       <FormErrorMessage
        fontSize={10}
        fontWeight={500}
        color={'red.500'}
      >{errorText || ''}</FormErrorMessage>
      }
      { helperText && !isError &&
        <FormHelperText
          fontSize={10}
          fontWeight={500}
          color={helperTextColor || "neutral.700"}
        >
          {helperText}
        </FormHelperText>
      }
    
    </FormControl>
  )
}
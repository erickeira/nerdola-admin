import colors from '@/themes/colors'
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
  PinInput,
  PinInputField,
  Flex,
  Text
} from '@chakra-ui/react'
import { useEffect, useState, useRef } from 'react'

export default function InputPin({
  label = ' ',
  placeholder = '0',
  containerProps,
  inputProps,
  isError,
  errorText,
  helperText,
  onChange,
  value,
  name = '',
  mask,
  onBlur,
  onKeyUp,
  onKeyPress,
  inputRef,
  isDisabled,
  labelColor,
  length = 6,
  separator,
  ...others
}){
  const [inputValue, setInputValue] = useState('')
  const handleInputChange = (e) => {
    setInputValue(e)
    if(onChange) onChange(e)
  }
  const inputsRefs = Array.from({ length : separator ? (length + 1) : length }, (v, k) => { return useRef()})

  useEffect(() => {
    if(value != inputValue) setInputValue(value || '')
  },[value])

  const handlePaste = (e) => {
    let text = e.clipboardData.getData('text');
    if(text) {
      text = text.replace('-', '')
      if(onChange) onChange(text)
      inputsRefs[inputsRefs.length - 1]?.current?.focus()
    }
  }

  return(
    <FormControl isInvalid={isError} mb={'24px'} {...containerProps}>
      <FormLabel
        fontSize={'14px'}
        fontWeight={'500'}
        lineHeight={'20px'}
        color={labelColor || (isDisabled ? '#9E99A1' : '#0C0C0C')}
        as='b'
      >{label}</FormLabel>
        <Flex gap="8px" mb="8px" align="center">
            <PinInput
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
            >
                {
                    inputsRefs.map((ref, k) => (
                            (k == length / 2) && separator ? 
                            <Text fontSize={"48px"} fontWeight="700" color="#fff">{separator || '-'}</Text>
                            :
                            <PinInputField 
                                bgColor= "#fff"
                                h= "64px"
                                w= '100%'
                                border= '1px solid #D0D5DD'
                                _placeholder={{
                                    color: '#D0D5DD',
                                    fontSize: '48px',
                                }}
                                _disabled={{
                                    _hover: {
                                        boxShadow: `0 0`,
                                    }
                                }}
                                _hover={{
                                    boxShadow: `0 0 0 1.5px ${colors.purple[300]}`,
                                }}
                                _focusVisible={{
                                    boxShadow: `0 0 0 1.5px ${colors.purple[500]};`
                                }}
                                fontSize="48px"
                                color="#0C0C0C"
                                ref={ref}
                                onPaste={handlePaste}
                            />
                        ))
                }


            </PinInput>
        </Flex>
            
      {!isError ? (
        <FormHelperText
          fontSize={10}
          fontWeight={500}
          color="neutral.700"
        >
          {helperText}
        </FormHelperText>
      ) : (
        <FormErrorMessage
          fontSize={10}
          fontWeight={500}
          color={'red.800'}
        >{errorText || ''}</FormErrorMessage>
      )}
    </FormControl>
  )
}
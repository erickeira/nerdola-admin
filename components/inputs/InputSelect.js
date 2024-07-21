import { 
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  // Select,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Image,
  Box
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Select from 'react-select'

export default function InputSelect({
  label = ' ',
  labelStyle,
  placeholder = '',
  containerProps,
  inputProps,
  isError,
  errorText,
  helperText,
  onChange,
  options,
  value,
  width,
  height,
  itemSx,
  sx,
  variant = 'primary',
  center,
  optionStyle,
  multiValueStyle,
  multiValueRemoveStyle,
  multiValueLabelStyle,
  isMulti,
  ...others
}){
  const [selectValue, setSelectValue] = useState([])
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(!show)

  const handleChange = (e) => {
    setSelectValue(e.value)
    if(onChange) onChange(e)
  }

  useEffect(() => {
    if(value != selectValue) setSelectValue(value || [])
  },[value])

  const customStyles = {
    primary : {
      control: (provided, state) => ({
        ...provided,
        border: isError ? '2px solid #E53E3E' : '1px solid #D9D9D9',
        borderColor: 'inherit',
        borderRadius: '0px',
        boxShadow: 'none',
        '&:hover': {
            boxShadow: '0 0 0 0.5px #adadad',
        },
        cursor: 'pointer',
        caretColor: 'transparent',
        height: '40px'
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        padding: '4px',
      }),
      menu: (provided) => ({
        ...provided,
        borderRadius: '5px',
        cursor: 'pointer',
      }),
      option: (provided, state) => ({
        ...provided,
        background: state.isSelected ? '#f6f6f6' : 'white',
        color: 'black',
        cursor: 'pointer',
        '&:hover': {
          background: '#f6f6f6',
          color: '#000',
        },
        display: center ? 'flex' : 'block',
        justifyContent: 'center',
        padding: "10px",
        ...optionStyle
      })
    },
  };

  return(
    <FormControl w={width || '100%'} isInvalid={isError} mb={'24px'} {...containerProps}>
      <FormLabel
        fontSize={'14px'}
        fontWeight={'500'}
        lineHeight={'20px'}
        color={'#0C0C0C'}
        as='b'
        {...labelStyle}
      >{label}</FormLabel>
      <Select 
        options={options} 
        placeholder={placeholder}
        styles={customStyles[variant]}
        value={
          isMulti ?
          ((options?.filter(opt => 
            selectValue?.includes(opt.value)
            ||  selectValue?.find(o => opt.value == o.value )
          )) || [{ value : '', label:''}])
          : ( options?.find(opt => opt.value == selectValue) || { value : '', label:''})
        }
        onChange={handleChange}
        isMulti={isMulti}
        hideSelectedOptions={false}
        // closeMenuOnSelect={false}
        noOptionsMessage={() => "Sem opções"}
      />  
      {!isError ? (
        <FormHelperText
          fontSize={10}
          fontWeight={500}
        >
          {helperText}
        </FormHelperText>
      ) : (
        <FormErrorMessage
          fontSize={10}
          fontWeight={500}
        >{errorText || ''}</FormErrorMessage>
      )}
    </FormControl>
  )
}
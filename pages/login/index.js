import CustomHead from "@/components/CustomHead";
import InputText from "@/components/inputs/InputText";
import {
    Flex,
    Box,
    Center,
    Image,
    Checkbox,
    Button,
    useToast,
    Text,
    Divider
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { useGlobal } from "@/context/GlobalContext";

export default function Login() {
    const { handleLogin, navigate } = useGlobal()
    const [ loginForm, setLoginForm ] = useState({
        login: '',
        senha: ''
    })
    
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    
    const handleFormChange = (dado) => {
      setLoginForm({ ...loginForm, ...dado });
    }
    
    const submitHandler = async (event) => {
      event.preventDefault();
      if(!loading){
        setLoading(true)
        const authenticated = await handleLogin(loginForm)
        if(authenticated) navigate('/obras')
        else{
            toast({
                title: `Falha na autenticação`,
                status: 'error',
                isClosable: true,
            })
        }
        setLoading(false)
      }
    }
    
    return (
      <>
        <CustomHead/>
        <Flex w="100%" h="100vh" justify="center" align="center" bgColor="#EBEBEB" px="20px">
            <Box w={400} boxShadow='sm' p="32px" bgColor="#fff" borderRadius="5px">
                <form onSubmit={submitHandler}>
                    <>
                        <Center>
                            <Text>
                                Nerdola
                            </Text>
                        </Center>
                        <Divider my="30px"/>
                        <InputText 
                            id="input-email" 
                            label="Login" 
                            variant="filled"
                            value={loginForm?.login}
                            onChange={(e) => handleFormChange({ login: e.target.value })}
                            mb={5}
                        />
                        <InputText 
                            id="input-senha" 
                            label="Senha" 
                            variant="filled"
                            value={loginForm.senha}
                            onChange={(e) => { handleFormChange({ senha: e.target.value })}}
                            type={'password'}
                            sx={{mb: 2}}
                            mb={5}
                        />
                        <Button
                            isLoading={loading}
                            isDisabled={loading}
                            w={'100%'} 
                            borderRadius={2} 
                            my={5}
                            colorScheme='gray'
                            type='submit'
                        >
                            Entrar
                        </Button>
                    </>
                </form>
            </Box>
        </Flex>
      </>
    );
  }
  
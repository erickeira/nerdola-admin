import { 
  Box, 
  Flex, 
  IconButton, 
  Image, 
  Spacer, 
  Text, 
  useBreakpointValue, 
  useToast ,
  Button,
  Divider,
  Progress
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { useGlobal } from '@/context/GlobalContext';
import { key_encrypt_login } from '@/utils';
import * as CryptoJS from "crypto-js";
import CustomHead from '@/components/CustomHead';
import SideBar from '@/components/Sidebar';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { IconMenu2 } from '@tabler/icons-react';
export default function DashboardLayout({ children }) {
  const { navigate, handleLogin, handleLogout } = useGlobal()
  const [menuClosed, setMenuClosed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  
  useEffect(() => {
    // checkAuth()
    setLoading(false)
  },[])

  const checkAuth = async () => {
    const cookies = parseCookies()
    if(cookies.encrypted) {
      // var bytes  = CryptoJS.AES.decrypt(cookies.encrypted, key_encrypt_login );
      // var decryptedForm = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      try{
        const authenticated = await handleLogin(decryptedForm)
        if(authenticated) setLoading(false)
        else{
          navigate('/login')
          toast({
              title: `Falha na autenticação`,
              status: 'error',
              isClosable: true,
          })
        }
      }catch(error){
        console.log(error)
        navigate('/login')
      }
    }else{
      navigate('/login')
    }
  }

  if(loading) return <Progress size='xs' isIndeterminate />
  return (
    <Box>
      <CustomHead/>
      <Flex minH="100vh">
        <Box></Box>
        <SideBar 
          menuClosed={menuClosed} 
          setMenuClosed={setMenuClosed} 
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
        <Box 
          w={{ 
            base: "100%",
            // lg: "calc(100vw - 30px)"
          }}
        >
          <Flex
            bgColor="#FAFBFB"
            h="60px"
            // w="100vw"
            justifyContent="space-between"
            align="center"
            px="20px"
          >
            <IconButton
              icon={<IconMenu2 size="20px"/>}
              onClick={() => {
                setMenuClosed(!menuClosed)
                setDrawerOpen(!drawerOpen)
              }}
            />
            <Spacer/>
            <Button
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Flex>
          <Divider mb=""  color={'#fff'}/>
          <Box p="20px">
            { children }
          </Box>
        </Box>
    </Flex>
    </Box>
    
)
}

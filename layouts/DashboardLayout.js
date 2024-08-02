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
  const { navigate, handleLogin, handleLogout, agente } = useGlobal()
  const [ menuClosed, setMenuClosed] = useState(false)
  const [ drawerOpen, setDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

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
            <Flex align="center" gap="15px">
              <Text fontWeight="600">
                {agente.nome}
              </Text>
              <Button
                onClick={handleLogout}
              >
                Sair
              </Button>
            </Flex>
  
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

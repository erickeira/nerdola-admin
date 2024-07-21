

import { useState, memo } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useRouter } from 'next/router';
import { 
    IconListLetters
} from '@tabler/icons-react';

import { 
  Image,
  Center,
  Divider,
  Box,
  Text,
} from '@chakra-ui/react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useGlobal } from "@/context/GlobalContext";

export default function SideBar({menuClosed,setMenuClosed, drawerOpen, setDrawerOpen}){
    const router = useRouter()
    const {navigate} = useGlobal()
    const handleClick = (rota) => {
      navigate(rota)
    }
    // const logo =  menuClosed ? "/svg/logo_pequena.svg" : "/svg/logo.svg"
    const isActive = (path) => router.pathname.startsWith(path);
    const IconArrow = menuClosed ? ChevronRightIcon : ChevronLeftIcon
     
    const closeDrawer = () => {
      setDrawerOpen(false)
    }
    
    return(
      <Box 
        borderRight="1px solid #d1d1d1"
      >
        <Sidebar 
            backgroundColor="#234E52" 
            style={styles.sidebar}
            collapsed={menuClosed}
            toggled={drawerOpen}
            onBackdropClick={closeDrawer}	
            breakPoint="lg"
          >
          <Center h="60px">
            <Center h="60px" p="30px">
              {  menuClosed ? 
                <Text color="#fff">
                  N
                </Text> :  
                <Text color="#fff">
                  Nerdola
                </Text>
              } 
            </Center>
          </Center>
          <Divider mb={5}  color={'#fff'}/>
          
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    color: '#000',
                    backgroundColor: active ? '#1D4044' : undefined,
                    "&:hover": {
                       backgroundColor: "#1D4044 !important"
                     },
                    margin: '5px 10px',
                    borderRadius: 5,
                    paddingLeft: 13
                  };
              },
            }}
            closeOnClick={true}
          >
            <MenuItem 
              active={isActive('/obras')} 
              onClick={() => {
                handleClick('/obras')
                closeDrawer()
              }} 
              style={styles.textItem} 
              icon={<IconListLetters size={20}/>}
            > 
              Obras
            </MenuItem>
          </Menu>
        </Sidebar>
      </Box>
    )
};

const styles = {
    sidebar: {
      borderRight: "1px solid #d1d1d1",
      height: '100%',
    //   position: "fixed",
      overflowY: '',
      zIndex: 5,
    },
    containerLogo:{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 15
    },
    textItem: {
      fontSize: 15,
      fontWeight: '400',
      color: '#fff'
    },
}
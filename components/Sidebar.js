

import { useState, memo } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useRouter } from 'next/router';
import { 
  IconBook,
    IconCheck,
    IconListLetters,
    IconTags,
    IconUsers,
    IconInbox,
    IconWorldWww
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
    const { navigate } = useGlobal()
    const handleClick = (rota) => {
      navigate(rota)
    }
    const logo =  menuClosed ? "/logo_pequena.png" : "/logo.png"
    const isActive = (path) => router.pathname == path;
    const IconArrow = menuClosed ? ChevronRightIcon : ChevronLeftIcon
     
    const closeDrawer = () => {
      setDrawerOpen(false)
    }
    
    return(
      <Box borderRight="1px solid #d1d1d1">
        <Sidebar 
            backgroundColor="#191919" 
            style={styles.sidebar}
            collapsed={menuClosed}
            toggled={drawerOpen}
            onBackdropClick={closeDrawer}	
            breakPoint="lg"
          >
          
          <Center h="60px" py="35px">
              <Image
                src={logo}
                h="50px"
              />
          </Center>
          <Divider mb={5}  color={'#fff'}/>
          
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    color: '#000',
                    backgroundColor: active ? '#232323' : undefined,
                    "&:hover": {
                       backgroundColor: "#232323 !important"
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
              icon={<IconBook size={20}/>}
            > 
              Obras
            </MenuItem>
            <MenuItem 
              active={isActive('/obras-status')} 
              onClick={() => {
                handleClick('/obras-status')
                closeDrawer()
              }} 
              style={styles.textItem} 
              icon={<IconCheck size={20}/>}
            > 
              Obra Status
            </MenuItem>
            <MenuItem 
              active={isActive('/tags')} 
              onClick={() => {
                handleClick('/tags')
                closeDrawer()
              }} 
              style={styles.textItem} 
              icon={<IconTags size={20}/>}
            > 
              Tags
            </MenuItem>
            <MenuItem 
              active={isActive('/usuarios')} 
              onClick={() => {
                handleClick('/usuarios')
                closeDrawer()
              }} 
              style={styles.textItem} 
              icon={<IconUsers size={20}/>}
            > 
              Usuarios
            </MenuItem>
            <MenuItem 
              active={isActive('/tags')} 
              onClick={() => {
                handleClick('/tags')
                closeDrawer()
              }} 
              style={styles.textItem} 
              icon={<IconTags size={20}/>}
            > 
              Tags
            </MenuItem>
            <MenuItem 
              active={isActive('/pedidos')} 
              onClick={() => {
                handleClick('/pedidos')
                closeDrawer()
              }} 
              style={styles.textItem} 
              icon={<IconInbox size={20}/>}
            > 
              Pedidos
            </MenuItem>
            <MenuItem 
              active={isActive('/sites')} 
              onClick={() => {
                handleClick('/sites')
                closeDrawer()
              }} 
              style={styles.textItem} 
              icon={<IconWorldWww size={20}/>}
            > 
              Sites
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
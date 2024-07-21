import React,{ useState, createContext, useEffect, useRef, useContext} from "react";
import { useRouter } from 'next/router'
import axios from "axios";
import { mensagemErroPadrao, apiUrl, key_encrypt_login } from '@/utils'
import { 
  useToast,
  useBreakpointValue,
  useBoolean,
  Box,
  Spinner,
  Text,
  Flex,
  Image,
  Fade,
  IconButton,
  Progress
} from '@chakra-ui/react'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Layout from "@/layouts";
import * as CryptoJS from "crypto-js";

export const GlobalContext = createContext({})

export function GlobalProvider({children}){
    const cookies  = parseCookies()
    const [ loading, setLoading ] = useState(true)
    const [ loadingRoute, setLoadingRoute ] = useState(false)
    const [ user, setUser] = useState({})
    const router = useRouter()
    const toast = useToast()

    useEffect(() => {
      setLoadingRoute(false)
    },[router.pathname, router.asPath, loading])
    
    useEffect(() => {
      setLoadingRoute(false)
      setLoading(false)
    },[])

        
    const navigate = async (route = '/', query= null) => {
      setLoadingRoute(true)
      try{
        if(query){
          router.push({
            pathname: route,
            query
          })
        }else{
          router.push(route)
        }
      
      }catch(e){
        console.log(e)
        
      }
    }

    const handleLogout = async () => {
      destroyCookie(null, 'encrypted')
      await router.push('/login')
      return true;
    }

    const handleLogin = async (form) => {
      try{
        const formText = JSON.stringify(form);
        const encriptedLoginForm = CryptoJS.AES?.encrypt(formText, key_encrypt_login ).toString();
        setCookie(undefined, 'encrypted', encriptedLoginForm ,{
          maxAge: (60 * 60 * 24) * 1,//1 dia
          secure: true,
          sameSite: 'Strict'
        })
        setUser({ name: "Erick" })
        return { name: "Erick" , isAdmin: true };
      }catch(error){
        handleLogout()
        return false
      }
    }
    
    return(
        <GlobalContext.Provider 
          value={{
            handleLogout,
            handleLogin,
            loading,
            navigate,
          }}
        >
          { 
            loadingRoute && 
            <Progress 
              size='xs' 
              w="100%"
              h="5px"
              position="absolute" 
              isIndeterminate 
              colorScheme={'purple'}
              zIndex={3}
            />   
          }
            
          <Layout>
            { loading ? <Progress colorScheme="blue"/> : children }
          </Layout>
        </GlobalContext.Provider>
    )
}

export const useGlobal = () => useContext(GlobalContext);
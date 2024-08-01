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
import api from "@/utils/api";

export const GlobalContext = createContext({})

export function GlobalProvider({children}){
    const cookies  = parseCookies()
    const [ loading, setLoading ] = useState(true)
    const [ loadingRoute, setLoadingRoute ] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
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

    const [agente,  setAgente] = useState({})
    const handleGetAgente = async () => {
      try{
        // const response  = await api.get('agentes/me')
        // console.log(response.data)
        // setAgente(response.data)
        return true;
      }catch(error){
        return false
      }
    }

    const handleLogin = async (form) => {
      try{
        const response  = await api.post('agentes/login', { ...form})
        setCookie(undefined, 'token', response.data.token ,{
          maxAge: (60 * 60 * 24) * 1,//1 dia
          secure: true,
          sameSite: 'Strict'
        })
        handleGetAgente()
        return true;
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
            agente
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

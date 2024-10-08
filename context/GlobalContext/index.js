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
    const [ isLoadingCheckAuth, setLoadingCheckAuth] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const toast = useToast()
    const [agente,  setAgente] = useState({})


    const isAdmin = agente.permissoes?.some(perm => perm.id == 1)

    const permissoes = {
      permObras: agente.permissoes?.some(perm => perm.id == 2) || isAdmin,
      permSites: agente.permissoes?.some(perm => perm.id == 3) || isAdmin,
      permTags: agente.permissoes?.some(perm => perm.id == 4) || isAdmin,
      permUsuarios: agente.permissoes?.some(perm => perm.id == 5) || isAdmin,
      permPedidos: agente.permissoes?.some(perm => perm.id == 6) || isAdmin,
      permAgentes: agente.permissoes?.some(perm => perm.id == 7) || isAdmin,
    }

    const handleCheckAuth = async () => {
      setLoadingCheckAuth(true)
      try{
          const response = await api.get('agentes/me')
          // navigation.navigate('tabs')
          setAgente(response.data)
          setIsAuthenticated(true)
      }catch(error){
      } finally {
          setLoadingCheckAuth(false)
      }
    }  

    useEffect(() => {
        handleCheckAuth()
    },[])

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
      // await router.push('/login')
      return true;
    }

    const handleLogin = async (form) => {
      try{
        const response  = await api.post('agentes/login', { ...form})
        setCookie(undefined, 'token', response.data.token ,{
          maxAge: (60 * 60 * 24) * 1,//1 dia
          secure: true,
          sameSite: 'Strict'
        })
        handleCheckAuth()
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
            agente,
            permissoes
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

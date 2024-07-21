import { useState, memo } from 'react'
import { GlobalProvider } from '@/context/GlobalContext'
import '@/styles/globals.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ThemeProvider, THEME_ID, createTheme } from '@mui/material/styles';

const materialTheme = createTheme({
    
});

const theme = extendTheme({})

export default function App({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <ThemeProvider theme={{ ...theme, [THEME_ID]: materialTheme }}>
                <GlobalProvider>
                    <Component {...pageProps} />
                </GlobalProvider>
            </ThemeProvider>
        </ChakraProvider>
   )
}

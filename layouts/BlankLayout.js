import { Box, Flex, Image } from "@chakra-ui/react";
export default function BlankLayout({
    children
}){
    return (
        <Flex>
            { children }
        </Flex>
    )
}
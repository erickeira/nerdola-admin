
import CustomHead from "@/components/CustomHead";
import { Flex, Image } from "@chakra-ui/react";
export default function AuthLayout({
    children
}){
    return (
        <Flex>
            { children }
        </Flex>
    )
}
import { Button, Flex,Image, Link, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import { Link as RouterLink } from 'react-router-dom'
import {AiFillHome} from "react-icons/ai"
import { RiLogoutBoxRLine } from "react-icons/ri";
import {RxAvatar}  from "react-icons/rx"
import useLogout from '../hooks/useLogout'
import authScreenAtom from '../atoms/authAtom'
import { BsFillChatLeftTextFill } from "react-icons/bs";

const Header = () => {
   const {colorMode,toggleColorMode} = useColorMode()
   const user = useRecoilValue(userAtom)
   const {loading,Logout}=useLogout()

   const setAuthScreen = useSetRecoilState(authScreenAtom)
  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12" >
      {user && (
        <>
        
        <Link as={RouterLink} to="/" >
        <AiFillHome size={24} />
        </Link>
        <Link as={RouterLink} to="/chat"  >
        <BsFillChatLeftTextFill  size={24} />
       </Link>
        </>
      )}
         {!user && (
        <Link as={RouterLink} to="/auth" onClick={()=>setAuthScreen("login")} >
        Login
        </Link>
      )}
      
     <Image
     cursor={"pointer"}
     alt='logo'
     w={6}
     src={colorMode === "dark"?"/light-logo.svg" :"/dark-logo.svg"}
     onClick={toggleColorMode}
     />
     {user && (
      <Flex alignItems={"center"} gap={"4"} >
        <Link as={RouterLink} to={`/${user.username}`} >
        <RxAvatar size={24} />
        </Link>
        <Button 
    postion={"fixed"}
   isLoading={loading}
   onClick={Logout}
    marginLeft={"100%"}
    size={"xl"}>
     <RiLogoutBoxRLine size={"20"}/>
    </Button>
        </Flex>
      )}
      {!user && (
        <Link as={RouterLink} to='/auth' onClick={()=>setAuthScreen('signup')} >
        SignUp
        </Link>
      )}
    </Flex>


  )
}

export default Header

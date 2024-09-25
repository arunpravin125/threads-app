'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import userAtom from '../atoms/userAtom'
import toast from "react-hot-toast"

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const setUser = useSetRecoilState(userAtom)
  const [loading,setLoading]=useState(false)

  const handleLogin = async()=>{
    if(!username || !password){
      toast.error("Invalid username or password")
    }
    try {
      setLoading(true)
      const res = await fetch("/api/users/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({username,password})
      })
      const data = await res.json()
       console.log("userLogin:",data)

      if(data.error){
        throw new Error(data.error)
   
      }
      localStorage.setItem("user-threads",JSON.stringify(data))
      setUser(data)
      toast.success('Login Successfully')
    } catch (error) {
      console.log("error in login",error.message)
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
  }


  return (
    <Flex
    
      minH={'100vh'}
      align={'center'}
      justify={'center'}
     >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
           Login
          </Heading>
         
        </Stack>
        <Box 
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          w={{
            base:"full",
            sm:"400px",
            
        }
        }
          p={8}>
          <Stack spacing={4}>
            <HStack>
            
              <Box w={"full"}>
                <FormControl  isRequired >
                  <FormLabel>User Name</FormLabel>
                  <Input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" />
                </FormControl>
              </Box>
            </HStack>
            
            <FormControl  isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input  value={password} onChange={(e)=>setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button isLoading={loading} disabled={loading}
              onClick={handleLogin}
                loadingText="Loggin in"
                size="lg"
                bg={useColorModeValue("gray.600","gray.700")}
                color={'white'}
                _hover={{
                  bg: 'gray.700',
                }}>
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
             Don't have an Account? <Link color={'blue.400'}
             onClick={()=>setAuthScreen("signup")}>Signup</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
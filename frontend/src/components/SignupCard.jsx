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
import {  useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'

import userAtom from '../atoms/userAtom'
import toast from 'react-hot-toast'

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const [loading,setLoading]=useState(false)
  const setUser = useSetRecoilState(userAtom)
  const [inputs,setInputs]=useState({
    name:"",
    username:"",
    email:"",
    password:""
  })

  const handleSignup = async()=>{
    
    try {
      setLoading(true)
      const res = await fetch("/api/users/signup",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(inputs)
      })
      const data = await res.json()

      if(data.error){
       throw new Error(data.error)
       
      }

      console.log("user Signup:",data)
      localStorage.setItem("user-threads",JSON.stringify(data))
      setUser(data)
      toast.success('Signup Successfully')
    } catch (error) {
      console.log("error in signup:",error)
      toast.error(data.error)

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
            Sign up
          </Heading>
         
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl  isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input value={inputs.name} onChange={(e)=>setInputs({...inputs,name:e.target.value})} type="text" />
                </FormControl>
              </Box>
              <Box>
                <FormControl  isRequired >
                  <FormLabel>User Name</FormLabel>
                  <Input  value={inputs.username} onChange={(e)=>setInputs({...inputs,username:e.target.value})}
                  type="text" />
                </FormControl>
              </Box>
            </HStack>
            <FormControl  isRequired>
              <FormLabel>Email address</FormLabel>
              <Input  value={inputs.email} onChange={(e)=>setInputs({...inputs,email:e.target.value})}
               type="email" />
            </FormControl>
            <FormControl  isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input  value={inputs.password} onChange={(e)=>setInputs({...inputs,password:e.target.value})}  type={showPassword ? 'text' : 'password'} />
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
              <Button onClick={handleSignup}
              
                isLoading={loading}
                disabled={loading}
                size="lg"
                bg={useColorModeValue("gray.600","gray.700")}
                color={'white'}
                _hover={{
                  bg: 'gray.700',
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'} onClick={()=>setAuthScreen("login")} >
                Already a user? <Link color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}
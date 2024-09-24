import { Avatar, Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/conversationAtom'
import userAtom from '../atoms/userAtom'
import {BsCheck2All} from "react-icons/bs"
const Message = ({ownMessage,message}) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const currentUser = useRecoilValue(userAtom)
  return (
    <>
    {ownMessage?(

   
    <Flex
    gap={2} alignSelf={"flex-end"}
    >
      {message.text && (
        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"} >
        <Text color={"white"} >{message.text}</Text>
        <Box  alignSelf={"flex-end"} ml={1} color={message.seen?"blue.400":""} fontWeight={"bold"} >
          <BsCheck2All size={16}  />
        </Box>
      </Flex>

      )}
      {
        message.img && (
          <Flex mt={5} w={"200px"} >
            <Image src={'https://images.unsplash.com/photo-1727101968282-139138e99593?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8eEh4WVRNSExnT2N8fGVufDB8fHx8fA%3D%3D'} 
            alt='Messsage image' borderRadius={4}  />

          </Flex>
        )
      }
      
      <Avatar src={currentUser.profilePic} w="7" h={7} />
    </Flex>
     ):(
        <Flex
        gap={2} alignSelf={"flex-start"}
        >
            <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
          {message.text && (<Text maxW={"350px"} color={"black"} bg={"gray.400"} p={1} borderRadius={"md"} >
           {message.text}
          </Text>)}
          {
        message.img && (
          <Flex mt={5} w={"200px"} >
            <Image src={'https://images.unsplash.com/photo-1727101968282-139138e99593?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8eEh4WVRNSExnT2N8fGVufDB8fHx8fA%3D%3D'} 
            alt='Messsage image' borderRadius={4}  />

          </Flex>
        )
      }
          
        </Flex>
     )}
    </>
  )
}

export default Message

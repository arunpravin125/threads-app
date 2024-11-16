import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/conversationAtom'
import userAtom from '../atoms/userAtom'
import {BsCheck2All} from "react-icons/bs"
const Message = ({ownMessage,message}) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const currentUser = useRecoilValue(userAtom)
  const [isImgLoading,setIsImgLoading]=useState(false)
  
  return (
    <>
    {ownMessage?(

   
    <Flex
    gap={2} alignSelf={"flex-end"}
    >
      {message.text && (
        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"} >
        <Text color={"white"} >{message.text}</Text>
        <Box  alignSelf={"flex-end"} ml={1} color={message.seen?"blue.500":""} fontWeight={"bold"} >
          <BsCheck2All size={16}  />
        </Box>
      </Flex>

      )}
      {
        message.img && !isImgLoading && (
          <Flex mt={5} w={"200px"} >
            <Image src={message.img} hidden onLoad={()=>setIsImgLoading(true)}
            alt='Messsage image' borderRadius={4}  />
        <Skeleton  w={"200pz=x"} h={"200px"} />
          </Flex>
        )
      }
      {message.img && isImgLoading && (
          <Flex mt={5} w={"200px"} >
            <Image src={message.img}  
            alt='Messsage image' borderRadius={4}  />
             <Box  alignSelf={"flex-end"} ml={1} color={message.seen?"blue.500":""} fontWeight={"bold"} >
          <BsCheck2All size={16}  />
        </Box>
       
          </Flex>
        )}
      
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
        message.img && !isImgLoading && (
          <Flex mt={5} w={"200px"} >
            <Image src={message.img} hidden onLoad={()=>setIsImgLoading(true)}
            alt='Messsage image' borderRadius={4}  />
        <Skeleton  w={"200pz=x"} h={"200px"} />
          </Flex>
        )
      }
      {message.img && isImgLoading && (
          <Flex mt={5} w={"200px"} >
            <Image src={message.img}  
            alt='Messsage image' borderRadius={4}  />
          
       
          </Flex>
        )}
          
        </Flex>
     )}
    </>
  )
}

export default Message

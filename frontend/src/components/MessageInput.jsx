import { Flex, Image, Input, InputGroup, InputRightElement,
   Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import {IoSendSharp} from "react-icons/io5"
import {  useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationAtom, selectedConversationAtom} from '../atoms/conversationAtom'
import toast from 'react-hot-toast'
import { BsFillImageFill } from 'react-icons/bs'
import usePrevImage from "../hooks/usePrevImage";
import {
  Button,
  CloseButton,




 
 
 
  ModalFooter,
 
  
  
} from "@chakra-ui/react";


const MessageInput = ({setMessages}) => {

  const [messageText,setMessageText]=useState("")
  const [loading,setLoading]=useState(false)
  const selectedConversation = useRecoilValue(selectedConversationAtom)
  const setConversation = useSetRecoilState(conversationAtom)
  const ImageRef = useRef(null);
  const { handleImageChange, imageUrl, setImageUrl } = usePrevImage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSendMessage = async(e)=>{
    e.preventDefault()
    if(!messageText)return;
    setLoading(true)
   try {
    const res = await fetch("/api/messages/",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        recipientId:selectedConversation.userId,
        message:messageText})
    })
    const data = await res.json()
    

    if(data.error){
      throw new Error(data.error)
    }

    console.log("sendMessage:",data)
   
    setMessages((messages)=>[...messages,data])
    setConversation((prevConversation)=>{
      const updatedConversation = prevConversation.map(conversation =>{
        if(conversation._id == selectedConversation._id){
          return{
            ...conversation,
            lastMessage:{
              text:messageText,
              sender:data.sender
            }
          }
        }
        return conversation
      })
      return updatedConversation;
    })
    setMessageText("")
   } catch (error) {
    console.log("error in sendMessage:",error.message)
    toast.error(error.message)
   }finally{
    setLoading(false)
   }

  }


  return (
    <Flex gap={2} alignItems={"center"}>

   
    <form onSubmit={handleSendMessage} style={{flex:95}} >
        <InputGroup>
        <Input w={"full"}
         value={messageText} 
         onChange={(e)=>setMessageText(e.target.value)} 
          placeholder='Type a Message'  >
        
        </Input>
        <InputRightElement _disabled={loading} onClick={handleSendMessage}  >
        {loading? <Spinner 
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xs"
      />:<IoSendSharp   color="green.500"/>}
        </InputRightElement>
        </InputGroup>
      
    </form>
    <Flex  flex={5} cursor={"pointer"} >
      <BsFillImageFill  size={20} onClick={()=>ImageRef.current.click()} />
        <Input type={"file"} hidden ref={ImageRef}  />
      </Flex>
      {/* <Modal isOpen={imageUrl} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
           <Flex mt={5} w={"full"} >
           <Image src='https://images.unsplash.com/photo-1727101968282-139138e99593?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDJ8eEh4WVRNSExnT2N8fGVufDB8fHx8fA%3D%3D'
            />
           </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
      
    </Flex>
    
  )
}

export default MessageInput

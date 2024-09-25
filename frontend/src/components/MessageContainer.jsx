import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationAtom, selectedConversationAtom } from "../atoms/conversationAtom";
import toast from "react-hot-toast";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
// import messageSound from "../assets/sounds/message.mp3"

const MessageContainer = () => {
  const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom)
  const [loadingMessages,setLoadingMessages]=useState(true)
  const [messages,setMessages]=useState([])
  const currentUser = useRecoilValue(userAtom)
  const messageRef = useRef(null)
  const setConversation = useSetRecoilState(conversationAtom)
   
const {socket} =useSocket()
  useEffect(()=>{
    socket.on("newMessage",(message)=>{
   
      if(selectedConversation._id === message.conversationId){
        setMessages((prevMess)=>[...prevMess,message])
      }
      
      // if(!document.hasFocus()){
      //   const sound = new Audio(messageSound)
      //   sound.play()
      // }

      setConversation((prev)=>{
        const updatedConversations = prev.map(conversation=>{
          if(conversation._id == message.conversationId){
            return {
              ...conversation,
              lastMessage:{
                text:message.text,
                sender:message.sender
              }
            }
          }
          return conversation
        })
        return updatedConversations
      })
  
    })


    return ()=>socket.off("newMessage")
  },[socket,selectedConversation,setConversation])

  useEffect(()=>{
    const lastMessageIsFromTheUser =messages.length && messages[messages.length-1].sender !== currentUser._id
    if(lastMessageIsFromTheUser){

socket.emit("markMessagesAsSeen",{
  conversationId:selectedConversation._id,
  userId:selectedConversation.userId
})
    }
    socket.on("messagesSeen",({conversationId})=>{
      if(selectedConversation._id == conversationId){
        setMessages(prev =>{
          const updatedMessages = prev.map(message=>{
            if(!message.seen){
              return {
                ...message,seen:true
              }
            }
            return message
          })
          return updatedMessages
        })
      }
    })
  },[socket,currentUser._id,messages,selectedConversation])

useEffect(()=>{
  messageRef.current?.scrollIntoView({behavior : "smooth"})
})


  useEffect(()=>{
    const getMessages = async()=>{

      try {
        if(selectedConversation.mock)return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`)
        const data = await res.json()

        console.log("getMessage:",data)
        if(data.error){
          throw new Error(data.error)
        }
        setMessages(data)
      } catch (error) {
        console.log("error in getMessgas",error.message)
        toast.error(error.message)
      }finally{
        setLoadingMessages(false)
      }
    }
    getMessages()
  },[selectedConversation.userId,setSelectedConversation,selectedConversation.mock])
  
  return (
    <Flex
      p={2}
      bg={useColorModeValue("gray.100", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      flex={70}
    >
      {/* message header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"}></Avatar>
        <Text display={"flex"} alignItems={"center"}>
       {selectedConversation.username}<Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      <Flex flexDir={"column"} height={"400px"} p={2} overflowY={"auto"} gap={4} my={4}>
        {loadingMessages &&
          [...Array(5)].map((_, i) => {
            return (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                alignSelf={i % 2 == 0 ? "flex-start" : "flex-end"}
                borderRadius={"md"}
              >
                {i % 2 == 0 && <SkeletonCircle size={7} />}
                <Flex gap={2} flexDirection={"column"}>
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            );
          })}
        { !loadingMessages && 
        messages.map((message)=>(
          <Flex   key={message._id}
          direction="column"
          ref = {messages.length-1 === messages.indexOf(message) ? messageRef : null }>
 <Message message={message} ownMessage={currentUser._id === message.sender} />
            </Flex>
         
        )) }
       
      </Flex>
      <MessageInput   setMessages={setMessages}  />
    </Flex>
  );
};

export default MessageContainer;

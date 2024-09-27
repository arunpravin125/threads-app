import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { toast } from "react-hot-toast";
import {
  conversationAtom,
  selectedConversationAtom,
} from "../atoms/conversationAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
const ChatPage = () => {
  const currentUser = useRecoilValue(userAtom);
  const [conversations, setConversations] = useRecoilState(conversationAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchingUser, setSearchingUser] = useState(false);

  const {socket,onlineUsers}=useSocket()
console.log("conversations:",conversations)
  useEffect(()=>{
    socket?.on("messagesSeen",({conversationId})=>{
      setConversations(prev=>{
        const updatedConversations = prev.map(conversation =>{
          if(conversation._id === conversationId){
            return {
              ...conversation,lastMessage:{
                ...conversation.lastMessage,
                seen:true
              }
            }
           
          }
          return conversation
        })
        return updatedConversations
      })
    })
  },[socket,setConversations])

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await fetch("/api/messages/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }
        console.log("getConversations:", data);
        setConversations(data);
      } catch (error) {
        console.log("error in getMessage:", error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getConversation();
  }, [setConversations]);

  const handleConversation = async (e) => {
    e.preventDefault();
    setSearchingUser(true);

    try {
      const res = await fetch(`/api/users/profile/${search}`);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      // user try to message self
      if (data._id == currentUser._id) {
        toast.error("You cannot message by yourself");
        return;
      }
      console.log("searchingUser:", data);
      // if user already in searched User conversation
      if (
        conversations.find(
          (conversation) => conversation.participants[0]._id === data._id
        )
      ) {
        setSelectedConversation({
          _id: conversations.find(
            (conversation) => conversation.participants[0]._id === data._id
          )._id,
          userId: data._id,
          userProfilePic: data.profilePic,
          username: data.username,
        });
        return;
      }
      const mockConversation = {
        mock:true,
        lastMessage:{
          text:"",
          sender:""
  
        },
        _id:Date.now(),
        participants:[
          {
            _id:data._id,
            username:data.username,
            profiePic:data.profilePic
          }
        ]
       
      }
      setConversations((prevConver)=>[...prevConver,mockConversation])
    } catch (error) {
      console.log("errorSearchingUser:", error.message);
      toast.error(error.message);
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        lg: "750px",
        md: "80%",
        base: "100%",
      }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
        gap={4}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            your Conversation
          </Text>
          <form>
            <Flex alignItems={"center"} gap={2}>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a user"
              />
              <Button
                onClick={handleConversation}
                size={"sm"}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loading &&
            [0, 1, 2, 3, 4, 5].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                align={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loading &&
            conversations.map((conversation) => {
              return (
                <Conversation
                  key={conversation._id}
                  conversation={conversation}
                  isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                />
              );
            })}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            justifyContent={"center"}
            height={"400px"}
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a message to conversation</Text>
            <Flex flex={70}>messageContainer</Flex>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;

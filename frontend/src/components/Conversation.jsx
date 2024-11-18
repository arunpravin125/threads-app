import {
  Avatar,
  Flex,
  Image,
  Stack,
  AvatarBadge,
  Text,
  useColorModeValue,
  WrapItem,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/conversationAtom";

const Conversation = ({ conversation,isOnline }) => {
  const currentUser = useRecoilValue(userAtom);

  const user = conversation?.participants[0];
  const lastMessage = conversation?.lastMessage;
  const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom)
 
  console.log("selectedConversation:",selectedConversation?selectedConversation:"no selected Conversation")
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          username: user.username,
          userProfilePic: user.profilePic,
          mock:conversation.mock
        })
      }
      bg={selectedConversation?._id == conversation?._id ? useColorModeValue("gray.600",'gray.dark'):""}
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user.profilePic}
        >
        {isOnline?  <AvatarBadge boxSize={"1em"} bg="green.500"></AvatarBadge>:""}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {currentUser._id == lastMessage.sender ? (
            
              <Box color={lastMessage.seen?"blue.400":""} >
                <BsCheck2All size={16} />
              </Box>
            
          ) : (
            ""
          )}
       
          {lastMessage.text.length > 18
            ? lastMessage.text.substring(0, 18) + "..."
            : lastMessage.text || <BsFillImageFill size={16} />}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;

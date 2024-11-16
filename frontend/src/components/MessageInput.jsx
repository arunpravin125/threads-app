import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationAtom,
  selectedConversationAtom,
} from "../atoms/conversationAtom";
import toast from "react-hot-toast";
import { BsFillImageFill } from "react-icons/bs";
import usePrevImage from "../hooks/usePrevImage";
import { useSocket } from "../context/SocketContext";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversation = useSetRecoilState(conversationAtom);
  const {socket,typing,setTyping,selectedUserId,setSelectedUserId} =useSocket()
  const { handleImageChange,imageUrl,setImageUrl} = usePrevImage();
  const { onClose } = useDisclosure();
  const [isSending, setIsSending] = useState(false);
  const ImageRef = useRef(null)

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imageUrl) return;
    if (isSending) return;
    setLoading(true);
    setIsSending(true);
    try {
      const res = await fetch("/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedConversation.userId,
          message: messageText,
          img: imageUrl,
        }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("sendMessage:", data);

      setMessages((messages) => [...messages, data]);
      setConversation((prevConversation) => {
        const updatedConversation = prevConversation.map((conversation) => {
          if (conversation._id == selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
      setMessageText("");
      setImageUrl("");
      setTyping(null)
    } catch (error) {
      console.log("error in sendMessage:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
      setIsSending(false);
    }
  };

useEffect(()=>{
   socket?.emit("typing",{
    typing:messageText?.length>0?messageText?.length:0,
    userId:selectedConversation?.userId
   })
   socket?.on("currentTyping",({typing})=>{
      console.log("currentType",typing)
      setTyping(typing)
      // setSelectedUserId(userId)
   })
  
},[socket,setMessageText?.length,messageText,setTyping])

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a Message"
          ></Input>
          <InputRightElement _disabled={loading} onClick={handleSendMessage}>
            {loading ? (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xs"
              />
            ) : (
              <IoSendSharp color="green.500" />
            )}
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => ImageRef.current.click()} />
        <Input
          type={"file"}
          hidden
          ref={ImageRef}
          onChange={handleImageChange}
        />
      </Flex>
      <Modal
        isOpen={imageUrl}
        onClose={() => {
          onClose();
          setImageUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imageUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp
                  size={24}
                  cursor={"pointer"}
                  onClick={handleSendMessage}
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;

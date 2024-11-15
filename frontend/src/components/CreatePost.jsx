import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import usePrevImage from "../hooks/usePrevImage";
import { BsFillImageFill } from "react-icons/bs";
import { useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import toast from "react-hot-toast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

const MAX_CHAR = 500;

const CreatePost = () => {
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const ImageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { handleImageChange, imageUrl, setImageUrl } = usePrevImage();
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);

  const {socket,onlineUsers} =useSocket()
  const [createdLivePost,setCreatedLivePost] = useState()

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imageUrl,
        }),
      });
      const data = await res.json();
      socket.emit("livePost",{livePost:data})
      if (username == user.username) {
        setPosts(data);
        // setPosts([data, ...posts]);
      }

      if (data.error) {
        throw new Error(data.error);
      }
      console.log("createdPost:",data);
     
      setPostText('')
      setImageUrl(null);
      toast.success("Post created successfully");
   
      
      onClose();
    } catch (error) {
      console.log("error in createPost:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    socket?.on("postLive",({livePost})=>{
     console.log("socketPostLive",livePost)
     if(livePost?.postedBy !== user?._id){
      setPosts((prev)=>[livePost,...prev]);
     }
    })
    // return ()=>socket?.off("postLive")
},[setPosts,socket])

  
  return (
    <>
      <Button
        onClick={onOpen}
        postion={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
      >
        <AddIcon size={{ base: "sm", sm: "md" }} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                value={postText}
                onChange={handleTextChange}
                placeholder="Post content goes here.."
              ></Textarea>
              <Text
                fontSize="xs"
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <Input
                type={"file"}
                hidden
                ref={ImageRef}
                onChange={handleImageChange}
              ></Input>
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => ImageRef.current.click()}
              ></BsFillImageFill>
            </FormControl>
            {imageUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imageUrl} alt="selected img" />
                <CloseButton
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                  onClick={() => {
                    setImageUrl("");
                  }}
                />
              </Flex>
            )}
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
      </Modal>
    </>
  );
};

export default CreatePost;

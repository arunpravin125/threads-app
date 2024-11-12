import React, { useEffect} from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import Actions from "../components/Actions";
import toast from "react-hot-toast";
import useGetUserProfilepic from "../hooks/useGetUserProfilepic";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Comments from "../components/Comments";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {

const [posts,setPosts]=useRecoilState(postsAtom)
const {user,loading} =useGetUserProfilepic()
const currentUser = useRecoilValue(userAtom)
const {pid}=useParams()

const navigate = useNavigate()
console.log("posts:",posts)
const currentPost = posts[0]

console.log("currentPost[0]:",posts[0])

useEffect(()=>{
const getPost = async()=>{
  setPosts([])
try {
  const res = await fetch(`/api/posts/${pid}`)
  const data = await res.json()

  if(data.error){
    throw new Error(data.error)
  }
  console.log("getPost:",data)
  setPosts([data])
} catch (error) {
  console.log('error in getPost',error.message)
  toast.error(error.message)
}
}
getPost()
},[pid,setPosts])

const handleDeletePost = async()=>{
  
  try {

    if(!window.confirm("Are you sure you want to delete this post?"))return;

    const res = await fetch(`/api/posts/${currentPost._id}`,{
      method:"DELETE"
    })
    const data = await res.json()

    if(data.error){
      throw new Error(data.error)
    }
    console.log(data)
    toast.success("Post deleted")
    navigate(`/${user.username}`)
  } catch (error) {
    console.log("error in deletePosy",error.message)
    toast.error(error.message)
  }

}

if(!user && loading){
  return (
    <Flex justifyContent={"center"} >
      <Spinner size={'xl'} />
    </Flex>
  )
}
   if(!currentPost){
    return null
   }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user?.profilePic}
            size={"md"}
            name="Mark Zucerberg"
          ></Avatar>
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
             {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4}></Image>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          
          <Text fontSize={"xs"} width={36} textAlign={'right'} color={"gray.light"}>
                {formatDistanceToNow(new Date(currentPost.createdAt))} ago
              </Text>
              {currentUser?._id == user._id &&  <AiOutlineDelete onClick={handleDeletePost} size={20}/> }
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box
        borderRadius={6}
        borderColor={"gray.light"}
        overflow={"hidden"}
        border={"1px solid gray"}
      >
        <Image src={currentPost.img} w={"full"}></Image>
      </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2x1"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like and post</Text>
        </Flex>
        <Button>get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost && currentPost.replies.map(reply=>{
        return <Comments
        lastReply={reply._id == currentPost.replies[currentPost.replies.length-1]._id}
        key={reply._id}
        reply={reply}
        
      />
      })}
      {/* <Comments
        createdAt="2d"
        likes={100}
        username="johndoe"
        userAvatar="https://bit.ly/tioluwani-kolawole"
        comment="Looks really good!"
      /> */}
    
    </>
  );
};

export default PostPage;

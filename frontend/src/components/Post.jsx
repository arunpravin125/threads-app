import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow} from "date-fns"
import Actions from "./Actions";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import  postsAtom from "../atoms/postsAtom";

const Post = ({ post,  postedBy }) => {
 

  
  const [user, setUser] = useState(null);
  const currentUser = useRecoilValue(userAtom)
  const [posts,setPosts]=useRecoilState(postsAtom)


  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
     

        if (data.error) {
          throw new Error(data.error);
        }
        setUser(data);
      
      } catch (error) {
        console.log("error in fetch getuser:", error.message);
        toast.error(error.message);
        setUser(null);
      }
    };
    getUser();
  }, [postedBy]);

  const handleDeletePost = async(e)=>{
    e.preventDefault()
    try {

      if(!window.confirm("Are you sure you want to delete this post?"))return;

      const res = await fetch(`/api/posts/${post._id}`,{
        method:"DELETE"
      })
      const data = await res.json()

      if(data.error){
        throw new Error(data.error)
      }
      console.log("deletePost",data)
      // setPosts((prev)=>prev.filter((p)=>p._id !== post._id))
      setPosts(posts.filter((po)=>(po._id !== post._id)))
      toast.success("Post deleted")
     
    } catch (error) {
      console.log("error in deletePosy",error.message)
      toast.error(error.message)
    }

  }
  if (!user) {
    return null;
  }
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
            size="md"
            name={user.name}
            src={user?.profilePic}
          ></Avatar>
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>

          <Box position={"relative"} w="full">
            {post.replies.length == 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="aeun"
                src={post.replies[0].userProfilePic}
                postion={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              ></Avatar>
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John do"
                src={post.replies[1].userProfilePic}
                postion={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              ></Avatar>
            )}
            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John do"
                src={post.replies[2].userProfilePic}
                postion={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              ></Avatar>
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w="full" alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1}></Image>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={'right'} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              
             {currentUser?._id == user._id &&  <AiOutlineDelete onClick={handleDeletePost} size={20}/> }
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              borderColor={"gray.light"}
              overflow={"hidden"}
              border={"1px solid gray"}
            >
              <Image src={post.img} w={"full"}></Image>
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions  post={post} />
          </Flex>
          {/* <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>
              {post.replies.length} repiles
            </Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
              {post.likes.length} likes
            </Text>
          </Flex> */}
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;

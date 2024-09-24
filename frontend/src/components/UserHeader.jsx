import {
  Avatar,
  Box,
  Button,
  Flex,
 
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,

  VStack,
} from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa6";
import React, { useState } from "react";
import { CgMoreO } from "react-icons/cg";
import toast from "react-hot-toast"
import { useRecoilValue } from "recoil";


import userAtom from "../atoms/userAtom";
import { Link as RoutesLink } from "react-router-dom";



const UserHeader = ({user}) => {
  const currentUser = useRecoilValue(userAtom) // this is login in user
  const [following,setFollowing]=useState(user.followers.includes(currentUser?._id))
  const [updating,setUpdating]=useState()
  console.log('following:',following)

    const copyURL = ()=>{
        const currentURL = window.location.href
        navigator.clipboard.writeText(currentURL).then(()=>{
            console.log("URL copied to clipboard")
            
            toast(
              "URL copied to the clipboard",
              {
                duration: 2000,
              }
            );
        })
    }

    const handleFollowAndUnfollow = async()=>{
      if(!currentUser){
        toast.error("Please login to follow")
        return;
      }
      if(updating) return;
      setUpdating(true)
      try {
        const res = await fetch(`/api/users/follow/${user._id}`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
        })
        const data = await res.json()

        console.log(data)
        if(data.error){
          throw new Erro(data.error)
        }
        if(following){
          toast.success(`Unfollowed ${user.name} successfully`)
          user.followers.pop() // only update in client side
        }else{
          toast.success(`followed ${user.name} successfully`)
          user.followers.push(currentUser?._id) // only update in client side
        }
        setFollowing(!following)
      } catch (error) {
        console.log("error in followUnFollow",error.message)
        toast.error(error.message)
      } finally{
        setUpdating(false)
      }
    }
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontWeight={"bold"} fontSize={"2xl"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"xs"}>{user.username}</Text>
            <Text
              fontSize={{
                base:"xs",
                md:"sm",
                lg:"md"
              }}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box w={"end"} >
          {user.profilePic && (
            <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base:"md",
            md:"xl"}}
          ></Avatar>
          )}
          {!user.profilePic && (
            <Avatar
            name={user.name}
            src="https://bit.ly/broken-link"
            size={{
              base:"md",
            md:"xl"}}
          ></Avatar>
          )}
        </Box>
        <Box></Box>
      </Flex>
      <Text>{user.bio}.</Text>
      {currentUser?._id == user._id && (
        <Link as={RoutesLink} to="/update">
        <Button>Update Profile</Button></Link>
       
      )}
      {currentUser?._id !== user._id && 
  
  
        <Button isLoading={updating} onClick={handleFollowAndUnfollow} >{following?"Unfollow":"follow"}</Button>
       
    }
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length}{""}followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <FaInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem onClick={copyURL} bg={"gray.dark"}>copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>


      <Flex w={"full"} >
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"} >
            <Text fontWeight={"bold"} >Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb="3" cursor={"pointer"} >
            <Text fontWeight={"bold"} >Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;

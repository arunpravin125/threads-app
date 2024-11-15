import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { useSocket } from "../context/SocketContext";
import { FaUsersGear } from "react-icons/fa6";
const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const { loading, Logout } = useLogout();
  const {socket,onlineUsers,notifications,setNotifications,notificationLength,setNotificationLength} =useSocket()
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  
 
  useEffect(()=>{
   
    socket?.on("live",({notification})=>{
      console.log("liveNotification",notification)
      setNotifications((prevNo)=>[notification,...prevNo])
      
    })
     return ()=> socket?.off("live")
    },[setNotifications,socket,setNotificationLength])
    
     
    
  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <>
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
          <Link as={RouterLink} to="/chat">
            <BsFillChatLeftTextFill size={24} />
          </Link>
          <Link as={RouterLink} to="/settings">
          <MdOutlineSettings size={24} />
          </Link>
          <Link as={RouterLink} to="/notification">
          <div className="flex relative hover:text-gray-500 " >
            <div>
            <IoNotificationsOutline  size={24} />
            </div>
            <div className="absolute left-5 bottom-2 text-orange-300" >{notificationLength?.length>0?notificationLength?.length:null}</div>
          </div>
         
         
          </Link>
          <Link as={RouterLink} to="/suggested">
          <FaUsersGear  size={24} />
          </Link>
        </>
      )}
      {!user && (
        <Link as={RouterLink} to="/auth" onClick={() => setAuthScreen("login")}>
          Login
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={"4"}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Button
            postion={"fixed"}
            isLoading={loading}
            onClick={Logout}
            marginLeft={"40%"}
            size={"xl"}
          >
            <RiLogoutBoxRLine size={"20"} />
          </Button>
        </Flex>
      )}
      {!user && (
        <Link
          as={RouterLink}
          to="/auth"
          onClick={() => setAuthScreen("signup")}
        >
          SignUp
        </Link>
      )}
    </Flex>
  );
};

export default Header;

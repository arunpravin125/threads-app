import {  Box, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'


import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'
import SuggestUsers from '../components/SuggestUsers'
import toast from 'react-hot-toast'

const HomePage = () => {
  const [posts,setPosts]=useRecoilState(postsAtom)
 
const [loading,setLoading]=useState(true)
  useEffect(()=>{
    const getFeedPosts = async()=>{
      setLoading(true)
      
      try {
        const res = await fetch("/api/posts/feed")
        const data = await res.json()

        console.log("getPostData:",data) 
        if(data.error){
          throw new Error(data.error)
        }
        setPosts(data)
      } catch (error) {
        console.log("error in feedPage:",error.message)
        toast.error(error.message)
      }finally{
        setLoading(false)
      }
    }
    getFeedPosts()

  },[setPosts])
  return (
    <Flex gap={5} alignItems={"flex-start"}>
   <Box flex={70}>
   {loading && (
      <Flex justify={"center"} >
        <Spinner size="xl"  ></Spinner>
      </Flex>
    )}
    {!loading && posts.length == 0 && (
      <h1  >follow some user to see some feed</h1>
    ) }

    {posts.map((post)=>{
      return <Post key={post._id} post={post} postedBy={post.postedBy} />
    })}

   </Box>
   <Box display={
    {base:"none",
      md:"block"
    }
   } flex={30}>
    {/* SUGGESTED USER COMPONENT */}
  <SuggestUsers/>
   </Box>
    
    </Flex>
  )
}

export default HomePage

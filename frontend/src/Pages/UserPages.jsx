import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
// import UserPost from '../components/UserPost'
import toast from "react-hot-toast"
import { useParams } from 'react-router-dom'
import { Flex } from '@chakra-ui/react'
import { Spinner } from '@chakra-ui/react'
import Post from '../components/Post'
import useGetUserProfilepic from '../hooks/useGetUserProfilepic'
import { useRecoilState, useSetRecoilState } from 'recoil'
import  postsAtom  from '../atoms/postsAtom'

const UserPages = () => {
  const {user,loading}=useGetUserProfilepic()
  const {username} = useParams()
  
 
 
 
  const [posts,setPosts]=useRecoilState(postsAtom)

  

  const [fetchingPost,setFechingPost]=useState(true)
  useEffect(()=>{
    
    const getPosts = async()=>{
      if(!user)return;
      setFechingPost(true)
      try {
        const res = await fetch(`/api/posts/user/${username}`)

        const data = await res.json()

        console.log("getPosts:",data)
        if(data.error){
          throw new Error(data.error)
        }
        setPosts(data)
      } catch (error) {
        console.log("error in getPosts:",error.message)
        toast.error(error.message)
      }finally{
        setFechingPost(false)
      }
    }
    getPosts()
  },[username,setPosts,user])

console.log("posts recoil state - ",posts)

  if(!user &&loading){
    return(
      <Flex justifyContent={"center"} >
 <Spinner  size="xl"  />
      </Flex>
     
    )
  }
  if(!user && !loading){
     return<h1>User not found</h1>;
  }
  
  return (
    <>
    <UserHeader  user={user}/>

    {!fetchingPost && posts.length===0 && <h1 >User have No posts.</h1>}
    {fetchingPost && (
      <Flex justifyContent={"center"} my={12} >
           <Spinner size={"xl"} ></Spinner>
      </Flex>
    )}
    {posts.map((post)=>{
      return <Post key={post._id} post={post}   postedBy={post.postedBy} />
    })}
    </>
  )
}

export default UserPages

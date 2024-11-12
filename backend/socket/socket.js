import {Server} from "socket.io";
import http from "http"
import express from "express";
import Message from "../Models/messageModel.js";
import Conversation from "../Models/conversationModel.js";

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

export const getRecipiantSocketId = (recipientId)=>{
   return userSocketMap[recipientId]
}

const userSocketMap = {} //userId :socketId

io.on('connection',(socket)=>{
 
const userId = socket.handshake.query.userId;

if(userId !== "undefined"){
    userSocketMap[userId]=socket.id
}
socket.on("Like",async({postId,authId})=>{
  
    io.emit("newLike",{postId,authId})
})
// newComment:data,
// postId:post._id
socket.on('comment',({newComment,postId})=>{
  
    io.emit("new-comment",{newComment,postId})
})
socket.on("markMessagesAsSeen",async({conversationId,userId})=>{
    try {
        await Message.updateMany({conversationId:conversationId,seen:false},{$set:{seen:true}})
        await Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}})
        io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId})
        
    } catch (error) {
        console.log('error in mark:',error.message)
    }
})


io.emit("getOnlineUsers",Object.keys(userSocketMap)) // [1,2,3,4,5]
        socket.on('disconnect',()=>{
           
            console.log("User disconnected",socket.id)
            delete userSocketMap[userId]
            io.emit("getOnlineUsers",Object.keys(userSocketMap)) // io.emit means all users
        })
})

export {io,server,app}
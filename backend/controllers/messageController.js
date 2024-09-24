import Conversation from "../Models/conversationModel.js"
import Message from "../Models/messageModel.js"
import { getRecipiantSocketId, io } from "../socket/socket.js"

export const sendMessage = async(req,res)=>{
    try {
        const {recipientId,message} = req.body
        const senderId = req.user._id

        let conversation  = await Conversation.findOne({
            participants:{$all :[senderId,recipientId]}
        })

        if(!conversation){
            conversation = new Conversation({
                participants:[senderId,recipientId],
                lastMessage:{
                    text:message,
                    sender:senderId
                }
            })
         await conversation.save()
        }
         const newMessage = new Message({
            conversationId:conversation._id,
            sender:senderId,
            text:message
         })

        await Promise.all([newMessage.save(),
            conversation.updateOne({
                lastMessage:{
                    text:message,
                    sender:senderId
                }
            })
         ])
        

         const recipientSocketId = getRecipiantSocketId(recipientId) // using recipients id and socketId
        if(recipientSocketId){
            io.to(recipientSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        res.status(500).json({error:error.message})
        console.log(error.message)
    }
}



export const getMessages = async(req,res)=>{

    const {otherUserId} = req.params
    const userId = req.user._id;
    try {
        const conversation = await Conversation.findOne({
            participants:{$all:[userId,otherUserId]}
        })

        if(!conversation){
            return res.status(404).json({error:"no conversation found"})
        }

        const messages = await Message.find({
            conversationId:conversation._id
        }).sort({createdAt:1})

        res.status(200).json(messages)
        
    } catch (error) {
        res.status(500).json({error:error.message})
        console.log(error.message)
    }
}

export const getConversation = async(req,res)=>{
    const userId = req.user._id
    try {
        let conversation = await Conversation.find({
            participants: userId
          }).populate({
           path:"participants",
            select:"username profilePic"
          });
      
          // remove the current user from participants

         conversation.forEach(conversation=>{
            conversation.participants = conversation.participants.filter(
                participants=>participants._id.toString() !== userId.toString()
            )
    })

      

res.status(200).json(conversation)

    } catch (error) {
        res.status(500).json({error:error})
        console.log(error.message)
    }
}
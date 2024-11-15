import Notification from "../Models/notificaionModel.js"
import Post from "../Models/postModel.js"
import User from "../Models/userModel.js"
import {v2 as cloudinary} from "cloudinary"
import { getRecipiantSocketId, io } from "../socket/socket.js"

export const getPosts = async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({error:"Post not found"})
        }

        res.status(200).json(post)

    } catch (error) {
        console.log("error in getPost:",error.message)
    res.status(500).json({error:error.message})
        
    }
}

export const createPost = async(req,res)=>{
try {
    
    const {postedBy,text}=req.body
    let {img}=req.body

    if(!postedBy || !text){
        return res.status(400).json({error:"postedBy and text fileds are required"})
    }

    const user = await User.findById(postedBy)

    if(!user){
        return res.status(404).json({error:"User not found"})
    }

    if(user._id.toString() !== req.user._id.toString()){
        return res.status(401).json({error:"Unauthoried to create post"})

    }

    const maxLength = 500
    if(text.length > maxLength){
        return res.status(400).json({error:`text must be less than ${maxLength}  characters`})
    }

    if(img){
        const uploadedResponse = await cloudinary.uploader.upload(img)
        img = uploadedResponse.secure_url
    }


    const newPost = new Post({postedBy,text,img})

    await newPost.save()
    res.status(200).json(newPost)

} catch (error) {
    console.log("error in createPost:",error.message)
    res.status(500).json({error:error.message})
    
}
}

export const deletePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"Unauthorized to delete post"})
        }

        if(post.img ){
            const imgId = post.img.split('/').pop().split(".")[0]
            await cloudinary.uploader.destroy(imgId)
        }
        await Post.findOneAndDelete({_id:req.params.id})
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        console.log("error in deletePost:",error.message)
        res.status(500).json({error:error.message})
    }
}

export const likeUnlikePost = async(req,res)=>{
    try {
        const {id:postId}=req.params // postId post ooda Id
        const userId = req.user._id // userlogin

        const post = await Post.findById(postId)
        if(!post){
            return res.status(404).json({error:"No post found"})
        }

        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost){
            // unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            // await post.findByIdAndUpdate(postId,{$pull:{likes:userId}})
            const posts = await Post.findById(postId)
            res.status(200).json(posts.likes)
            // await post.save()
        }else{
           // like post
           post.likes.push(userId)
         const notification =new Notification({
            from:userId,
            to:post.postedBy,
            type:"like",
            postImg:post.img,
            likedText:post.text
         })
           await post.save()
           await notification.save()
           console.log("notification",notification)
        //    const PostedBYnotification = await Notification.find({to:{$in:post.postedBy}}).populate({path:"from", select:"username profilePic"}).sort({createdAt:-1})
       
        // //    const filteredNotification = PostedBYnotification.filter((notifi)=>notifi.from.toString() !== notifi.to.toString())
         

           const posts = await Post.findById(postId)
         
        //    Promise.all([post.save(),notification.save()])
           res.status(200).json(posts.likes)
           const recipientSocketId = getRecipiantSocketId(post.postedBy) // using recipients id and socketId
           if(recipientSocketId){
            //    console.log("recipientSocketId",recipientSocketId)
            //    console.log("recipientSocketId",PostedBYnotification)
               io.to(recipientSocketId).emit("live",{notification})
           }
        }
    } catch (error) {
        console.log("error in likeUnlikePost:",error.message)
        res.status(500).json({error:error.message})
    }
}

export const replyToPost = async(req,res)=>{
    try {
        const {text}=req.body  // comment
        const postId=req.params.id  // that post id
        const userId = req.user._id // userLogin id check
        const userProfilePic = req.user.profilePic  // userProfile check
        const username = req.user.username // userLogin user name

        if(!text){
            return res.status(400).json({error:"text fields is required"})
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({error:"Post not found"})
        }

        const reply = {userId,text,userProfilePic,username}
        const notification = new Notification({
            type:"reply",
            from:userId,
            to:post.postedBy,
            postImg:post.img,
            likedText:post.text
        })
        // from:userId,
        // to:post.postedBy,
        // type:"like",
        // postImg:post.img,
        // likedText:post.text
        
        post.replies.push(reply)
        await post.save()
        await notification.save()
        const recipientSocketId = getRecipiantSocketId(post.postedBy) // using recipients id and socketId
        if(recipientSocketId){
            // console.log("recipientSocketId",recipientSocketId)
            io.to(recipientSocketId).emit("live",notification)
        }
        const postReply = await Post.findById(postId)
        res.status(200).json(postReply.replies)

        
    } catch (error) {
        console.log("error in reply to post :" ,error.message)
        res.status(400).json({error:error.message})
    }
}

export const getFeedPost = async(req,res)=>{
    try {
        const userId = req.user._id
        const user =await User.findById(userId)

        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        const following = user.following;
             // .sort({createdAt: -1}) means latest post at top
        const feedPost = await Post.find({postedBy:{$in:following}}).sort({createdAt :-1})

        res.status(200).json(feedPost)
        
    } catch (error) {
        console.log("error in getFeetPosts :" ,error.message)
        res.status(400).json({error:error.message})
        
    }
}

export const getUserPosts = async(req,res)=>{
    const {username}=req.params
    console.log(username)
    try {

        const user = await User.findOne({username})

        if(!user){
           return res.status(404).json({error:"User not found"})
        }
       //   created: -1 => means decending order 
        const posts = await Post.find({postedBy:user._id}).sort({created:-1})

        if(!posts){
            return res.status(400).json({error:`No Post created By ${user.username}`})
        }
        res.status(200).json(posts)
    } catch (error) {
        console.log("error in getUserPosts : ",error.message)
        res.status(500).json({error:error.message})
    }
}
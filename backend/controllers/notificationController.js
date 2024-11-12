import Notification from "../Models/notificaionModel.js"
// import User from "../Models/userModel.js"

export const getNotification = async(req,res)=>{
      const currentUser = req.user._id
      console.log("currentIUser",currentUser)
    try {
        
        const notification = await Notification.find({to:{$in:currentUser}}).populate({path:"from", select:"username profilePic"}).sort({createdAt:1})
       
        const filteredNotification = notification.filter((notifi)=>notifi.from.toString() !== notifi.to.toString())
       
        res.status(200).json(filteredNotification)
    } catch (error) {
        console.log("error in getNotification",error)
        res.status(400).json({error:error.message})
    }
}

export const deleteNotification = async(req,res)=>{
    const id = req.params
    try {
        await Notification.findOneAndDelete({_id:id})
       
       res.status(200).json({message:"Notification deleted"})
    } catch (error) {
        console.log("error in deleteNotification",error)
        res.status(400).json({error:error.message})
    }
}
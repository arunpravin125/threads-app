import mongoose from "mongoose";

export const connectedDB = async()=>{
    try {
        const connection =await mongoose.connect(process.env.MONGO_URL,{
        
        })
        console.log("Mongo-DB connected:)")
    } catch (error) {
        console.log("error in mongoose:",error.message)
    }
}
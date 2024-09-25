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

// PORT=4900

// MONGO_URL=mongodb+srv://arunpravin125:5v3wTvVaVNSJJuqs@cluster0.4uti9.mongodb.net/thread?retryWrites=true&w=majority&appName=Cluster0

// JWT_SECRET=JWT_SECRET

// CLOUDINARY_CLOUD_NAME=dyw9fi9px
// CLOUDINARY_API_KEY=735415847378124
// CLOUDINARY_API_SECRET=ovAvvieyiKs4K2AWngPFABXfwz8
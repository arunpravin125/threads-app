import mongoose from "mongoose";

export const connectedDB = async()=>{
    try {
       const connect = mongoose.connect("mongodb+srv://arunpravin125:5v3wTvVaVNSJJuqs@cluster0.4uti9.mongodb.net/thread?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Mongo-DB connected:)")
    } catch (error) {
        console.log("error in mongoose:",error.message)
    }
}
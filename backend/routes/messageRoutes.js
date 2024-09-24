import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { getConversation, getMessages, sendMessage } from "../controllers/messageController.js"


export const messageRoutes = express.Router()

messageRoutes.post("/",protectRoute,sendMessage)
messageRoutes.get("/:otherUserId",protectRoute,getMessages)
messageRoutes.post("/users",protectRoute,getConversation)
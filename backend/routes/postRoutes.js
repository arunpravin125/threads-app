import express from "express"
import { createPost, deletePost, getFeedPost, getPosts, getUserPosts, likeUnlikePost, replyToPost } from "../controllers/postController.js"
import { protectRoute } from "../middleware/protectRoute.js"

export const postRoutes = express.Router()

postRoutes.get("/feed",protectRoute,getFeedPost)
postRoutes.get("/:id",getPosts)
postRoutes.get("/user/:username",getUserPosts)
postRoutes.post("/create",protectRoute,createPost)
postRoutes.delete("/:id",protectRoute,deletePost)
postRoutes.put("/like/:id",protectRoute,likeUnlikePost)
postRoutes.put("/reply/:id",protectRoute,replyToPost)



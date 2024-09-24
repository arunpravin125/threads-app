import express from "express"
import { followUnFollowUser, getUserProfile, loginUser, logoutUser, signupUser, updateUser } from "../controllers/userController.js"
import { protectRoute } from "../middleware/protectRoute.js"

export const userRoutes = express.Router()

userRoutes.get("/profile/:query",getUserProfile)
userRoutes.post('/signup',signupUser)
userRoutes.post('/login',loginUser)
userRoutes.post("/logout",logoutUser)
userRoutes.post("/follow/:id",protectRoute,followUnFollowUser)
userRoutes.put("/update/:id",protectRoute,updateUser)

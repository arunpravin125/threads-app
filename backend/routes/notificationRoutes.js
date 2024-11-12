import express from "express"
import { deleteNotification, getNotification } from "../controllers/notificationController.js"

import { protectRoute } from "../middleware/protectRoute.js"
export const notificationRoutes = express.Router()

notificationRoutes.post("/getNotification",protectRoute,getNotification)
notificationRoutes.post("/deleteNotification/:id",protectRoute,deleteNotification)
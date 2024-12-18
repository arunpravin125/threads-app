import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import { connectedDB } from "./DB/database.js";
import cookieParser from "cookie-parser";
import { userRoutes } from "./routes/userRoutes.js";
import { postRoutes } from "./routes/postRoutes.js";
import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";
import { messageRoutes } from "./routes/messageRoutes.js";

import { app, server } from "./socket/socket.js";
import path from "path";
import { notificationRoutes } from "./routes/notificationRoutes.js";

// const app = express()



app.use(express.json({ limit: "50mb" })); // to parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // to parse from data in the req.body
app.use(cors());
app.use(cookieParser());
// Increase the request size limit
app.use(bodyParser.json({ limit: "10mb" })); // for JSON data
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const usePort = process.env.PORT || 4901;

const __dirname = path.resolve();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use("/api/messages", messageRoutes);
app.use("/api/notification",notificationRoutes);


// http://localhost:4900 =>backend run,add frontend

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // react app

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(usePort, () => {
  connectedDB();
  console.log(`server started ${usePort} `);
});
// http://localhost:4900 =>backend run
// http://localhost:3000 =>frontend run

// http://localhost:4900 =>backend run,add frontend

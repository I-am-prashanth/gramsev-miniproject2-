import express from "express";
import connectdb from "./connect.js";
import authUser from "./routes/Contractot.route.js"
import authWorker from "./routes/Worker.route.js"
import CommonControl from "./routes/Common.Route.js"
import MessageRoute from "./routes/Message.route.js"
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const app=express();


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_API_KEY,
});



app.use(express.json({limit:"5mb"})); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser());
app.use("/api/contractor",authUser)
app.use("/api/worker",authWorker)
app.use("/api/",CommonControl)
app.use("/api/message",MessageRoute)

app.get("/",(req,res)=>{
    res.send("prashnath kumar pathigari")
})






app.listen(process.env.PORT||5000,()=>{
    connectdb();
    console.log("server is running at 5000 port")
})
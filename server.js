import express from "express";
import { configDotenv } from "dotenv";
import connectdb from "./connectdb.js";
import authcontractor from "./routes/authcontractot.js"
import cookieParser from "cookie-parser";
import authworker from "./routes/authworker.js"


configDotenv()
const port=process.env.PORT || 3000

const app=express();
app.use(express.json());
app.use(cookieParser());




app.use("/api/contractor",authcontractor);
app.use("/api/worker",authworker);
app.get("/",(req,res)=>{
    res.send("prashnath")
})






app.listen(port,()=>{
    connectdb()
    console.log("app is listen at 3000 port")
})
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const url=process.env.MONGO_DB


const connectdb=async()=>{
    console.log("url:",url)
    try{
    const conn=await mongoose.connect(url)
    console.log("sucessfully connected to database")
    }catch(error){
        console.log("error cooured while connecting:",error)
    }
}

export default connectdb;
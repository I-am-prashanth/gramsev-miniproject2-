import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const url=process.env.MONGODB_URL;


const connectdb=async()=>{
    try{
    const conn=await mongoose.connect(url);
    console.log("sucessfully connected to database",conn.connection.host)
    }catch(error){
        console.log("error cooured while connecting:",error)
    }
}

export default connectdb;
import mongoose from "mongoose";

const PostSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'Contractor',
        required:true
    },
    pincode:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
        
    },
    bio:{
        type:String,
        required:true,
    },
    noOfWorkers:{
        type:String,
        required:true,
    },
    wages:{
        type:Number,
        required:true,
    },
    img:{
        type:String
    },
    interested:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Worker"
        }
    ]
},{timestamps:true});


const Post=mongoose.model("Post",PostSchema);
export default Post
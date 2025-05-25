import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    to:{
        type: mongoose.Schema.Types.ObjectId,
            ref: "Contractor",
            required:true
    },
    title:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    no_of_workers:{
        type:Number,
        required:true,
        default:1,
    },
    wages:{
        type:String,
        required:true
    },
    img:{
            type:String,

            
    },
    pincode:{
        type:String,
        required:true
    },
    State:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
},{timestamps:true})

const Post=mongoose.model("Posts",postSchema)

export default Post;
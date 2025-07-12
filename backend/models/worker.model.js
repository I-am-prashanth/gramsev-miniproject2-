import mongoose from "mongoose";

const WorkerSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    gmail:{
        type:String,
        // required:true,
        unique:true
    },
    img:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    pincode:{
        type:String,
        required:true,
        // unique:true
    },
    address:{
        type:String
    },
    interested:[
         {
            type:mongoose.Schema.ObjectId,
            ref:"Post"
        }
    ]
    
    // skills:{
    //     type:String,
    //     required:true,
    //     unique:true
    // },
},{timestamps:true});
const Workers=mongoose.model("Workers",WorkerSchema)
export default Workers
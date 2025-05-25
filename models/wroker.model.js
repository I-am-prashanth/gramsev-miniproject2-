import mongoose from "mongoose";

const workerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        unique:true,
        required:true,
    },
    gmail:{
            type:String,
            unique:true
        },
    password:{
            type:String,
            required:true,
            minLength:6 
        },
    
    notification:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"notification",
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

const Worker=mongoose.model("Workers",workerSchema)

export default Worker
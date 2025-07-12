import mongoose from "mongoose";

const ContractorSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    gmail:{
        type:String,
        // required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
    },
    pincode:{
        type:String,
    },
    State:{
        type:String,
    },
    
    password:{
        required:true,
        type:String,
        minlength:6
    },
    posts:[{
        type:mongoose.Schema.ObjectId,
        ref:"Post"
    }]
},{timestamps:true});

const Contractor=mongoose.model("Contractor",ContractorSchema);
export default Contractor
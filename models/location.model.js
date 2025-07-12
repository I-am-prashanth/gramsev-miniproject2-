import mongoose from "mongoose";

const locationSchema=mongoose.Schema({
    
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
},{timestamps:true})


const Location=mongoose.model("Locations",locationSchema);
export default Location
import mongoose from "mongoose";

const cotratorSchema=mongoose.Schema({
    
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
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:6 
    },
    img:{
        type:String,
    },
    posts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Post",
    default: []
}
,
    notification:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"notification",
    },

},{timestamps:true})


const Contractor=mongoose.model("Contractors",cotratorSchema);
export default Contractor
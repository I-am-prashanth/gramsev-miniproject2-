import mongoose from "mongoose";

const NotificationSchema=mongoose.Schema({
    to:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"fromModel",
        required:true,
    },
    
    from:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"fromModel",
        required:true
    },
    fromModel: {
    type: String,
    required: true,
    enum: ['Contractor', 'Worker'] // allowed model names
  },
    matter:{
        type:String,

    },
    notify:{
        type:"String",
        required:true,
        enum:['interest_on_work','message']
    },
     read:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


const notification=mongoose.model("notification",NotificationSchema);

export default notification
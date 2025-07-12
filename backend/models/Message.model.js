import mongoose from "mongoose";

const messageSchema=mongoose.Schema({
  senderId: {
  type: mongoose.Schema.ObjectId,
  required: true,
  refPath: 'senderModel' // This field will determine which model to use
},
senderModel: {
  type: String,
  required: true,
  enum: ['Worker', 'Contractor'] // Only these two values are allowed
},

receiverId: {
  type: mongoose.Schema.ObjectId,
  required: true,
  refPath: 'receiverType' // This field will determine which model to use
},
receiverType: {
  type: String,
  required: true,
  enum: ['Worker', 'Contractor'] // Only these two values are allowed
},
text:{
    type:String
}
,
img:{
    type:String 
}


},{timestamps:true})

const message=new mongoose.model("message",messageSchema);

export default message
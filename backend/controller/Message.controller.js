import message from "../models/Message.model.js";
import { v2 as cloudinary } from "cloudinary";
import {ObjectId} from 'mongodb'
import Contractor from "../models/contractor.model.js";
import Worker from "../models/worker.model.js";
import mongoose from 'mongoose';

export const addmessage=async()=>{

}

export const getUser=async(req,res)=>{
    try{
        console.log("entered")
       const msg = await message.find({
  $or: [
    { senderId: req.user._id }, // No need for ObjectId conversion if id is already ObjectId
    { receiverId:req.user._id }
  ]
})
.select("receiverId senderId") // Fixed the select fields
.populate({
  path: 'receiverId',
  select: 'username pincode'
})
.populate({
  path: 'senderId', 
  select: 'username' // Add if you need sender info too
});

       const userIds = new Set();
const uniqueUsers = [];
msg.forEach(message => {
  // Add sender if not already added
  if (!userIds.has(message.senderId.toString())) {
    uniqueUsers.push({
      _id: message.senderId,
      model: message.senderModel,
      type: 'sender'
    });
    userIds.add(message.senderId.toString());
  }

  // Add receiver if not already added (and if populated)
  if (message.receiverId && !userIds.has(message.receiverId._id.toString())) {
    uniqueUsers.push({
      _id: message.receiverId._id,
      username: message.receiverId.username,
      pincode: message.receiverId.pincode,
      model: message.receiverType,
      type: 'receiver'
    });
    userIds.add(message.receiverId._id.toString());
  }
});

const filteredUsers = uniqueUsers.filter(user => !user._id.equals(new mongoose.Types.ObjectId(req.user._id)));
       console.log(filteredUsers)
        if(!filteredUsers) res.status(200).json([])
        res.status(200).json(filteredUsers)

    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message})
    }
}


export const getmessages=async(req,res)=>{
    try{
        const {id}=req.params;
        const messages=await message.find({
            $or:[{senderId:id,receiverId:req.user._id},
                {senderId:req.user._id,receiverId:id}
            ]
        })
        res.status(200).json(messages);

    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message})
    }
}


export const sendmessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, img } = req.body;

        // 1. Validate input
        if (!text && !img) {
            return res.status(400).json({ 
                success: false,
                error: "Message content required" 
            });
        }

        // 2. Verify recipient exists
        const [worker, contractor] = await Promise.all([
            Worker.findById(id),
            Contractor.findById(id)
        ]);

        if (!worker && !contractor) {
            return res.status(404).json({
                success: false,
                error: "Recipient not found"
            });
        }

        // 3. Determine receiver type
        const receiverType = worker ? "Worker" : "Contractor";

        // 4. Handle image upload
        let imageUrl = "";
        if (img) {
            try {
                const uploadResult = await cloudinary.uploader.upload(img, {
                    folder: 'message_attachments',
                    allowed_formats: ['jpg', 'png', 'gif']
                });
                imageUrl = uploadResult.secure_url;
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({
                    success: false,
                    error: "Image upload failed"
                });
            }
        }

        // 5. Create and save message
        const newMessage = new message({
            senderId: req.user._id,
            receiverId: id,
            text: text || "",
            img: imageUrl,
            receiverType,
            senderModel: req.user.type,
            createdAt: new Date()
        });

        const savedMessage = await newMessage.save();
        if (!savedMessage) {
            throw new Error("Failed to save message");
        }

        // 6. Success response
        return res.status(201).json({
            success: true,
            data: savedMessage
        });

    } catch (error) {
        console.error('Message send error:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};


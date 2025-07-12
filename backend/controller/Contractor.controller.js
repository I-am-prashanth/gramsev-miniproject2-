import express from "express";
import Contractor from "../models/contractor.model.js";
import Post from "../models/Post.model.js";
import { v2 as cloudinary } from "cloudinary";

const app=express();

app.use(express.json())






export const addpost=async(req,res)=>{
    try{
        const {user}=req;   
        
        if(!user) return res.status(404).json({message:"user not found"})
        const {pincode,address,bio,noOfWorkers,wages,img,}=req.body;
        let photo=img;
        if(!pincode || !noOfWorkers || !wages) res.status(400).json({message:"all flied are mandetatory"})
        if(img){
            const uploading=await cloudinary.uploader.upload(img);
            photo=uploading.secure_url;
        }
        
            const newpost=new Post({
            user:user._id,
            pincode:pincode,
            address:address || "",
            bio:bio || "",
            noOfWorkers:noOfWorkers,
            wages:wages,
            img:photo || "",
        })
        if(newpost){
            await newpost.save();
            // await Post.updateOne({_id:postid},{$pull:{likes:id}})
            await Contractor.updateOne({_id:user._id},{$push:{posts:newpost._id}})
            return res.status(201).json({message:"sucesfully added a post",newpost})
        }
        return res.status(500).json({message:"unable to save the post"})

    }catch(error){
        console.log("error occured while adding post:",error)
        res.status(500).json({message:error.message});
    }
}


export const getallpost=async(req,res)=>{
    try{
        const {posts}=req.user;
        if(!posts || posts.length===0) res.status(201).json(["no posts"]);
        const allposts=await Post.find({_id:{$in:posts}});
        res.status(200).json(allposts)
        
        

    }catch(error){
        console.log("error occured while fetching posts:",error);
        res.status(500).json({message:error.message})
    }
}

export const deletpost=async(req,res)=>{
   
  try {
    const { id } = req.params;
    
    // 1. Verify the post exists and belongs to the user
    const post = await Post.findOne({ 
      _id: id,
      user: req.user._id  // Ensure the post belongs to the requesting user
    });

    if (!post) {
      return res.status(404).json({ 
        success: false,
        message: 'Post not found or unauthorized' 
      });
    }

    // 2. Delete the post
    await Post.findByIdAndDelete(id);

    // 3. Remove post reference from contractor's posts array
    await Contractor.findByIdAndUpdate(
      req.user._id,
      { $pull: { posts: id } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post'
    });
  }
};


export const updatepost=async(req,res)=>{
    try{
        const {pincode,address,bio,noOfWorkers,wages,img}=req.body;
        let postimg=null
        const {id}=req.params;
        
        const post=await Post.findById(id);
        if(!post) res.status(404).json({message:"unable to find post"});

        if(post.img){
            await cloudinary.uploader.destroy(post.img.split('/').pop().split('.')[0]);
            
        }
        let imgurl=null
        if(img){
        postimg=await cloudinary.uploader.upload(img)
         imgurl=postimg.secure_url;
        }
        const newpost=await Post.findByIdAndUpdate(id,{
            pincode:pincode || post.pincode,
            address:address || post.address,
            bio:bio || post.bio,
            noOfWorkers:noOfWorkers || post.noOfWorkers,
            wages:wages || wages,
            img:imgurl || img,
            
        }, { new: true })
        res.status(201).json(newpost)


    }catch(error){
        console.log("error while updating post:",error)
        res.status(500).json({message:error.message})
    }
}





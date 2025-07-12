import Post from "../models/Post.model.js";
import Worker from "../models/worker.model.js"
// import bcrypt from "bcryptjs";
// import generate from "../utils/generate.js";

export const interstedPost=async(req,res)=>{
    try{
        let ret=""
        const {id}=req.params;
        const intertUserArray=await Post.findById(id).select("interested")
        // const post = await Post.findById(id).select("interested");
        console.log(intertUserArray)
        if (!interstedPost) {
    return res.status(404).json({ message: "Post not found" });
}

        if (intertUserArray.interested.includes(req.user._id)){
            await Worker.updateOne({_id:req.user._id},{$pull:{interested:id}})
        await Post.updateOne({_id:id},{$pull:{interested: req.user._id}})
        // intertUserArray.add(id)
        ret="interested in post has been removed"
        }

        else{
        await Worker.updateOne({_id:req.user._id},{$push:{interested:id}})
        await Post.updateOne({_id:id},{$push:{interested: req.user._id}})
        ret="Sucessfully added as interested"
        // intertUserArray.remove(id)
        }
        res.send({message:ret})
        

    }catch(error){
        console.log("errord occured while checking post:",error)
        res.status(500).json({message:error.message})
    }
}

export const AllinterestedPosts=async(req,res)=>{
    try{
        const {interested}=req.user;
        const posts=await Post.find({_id: {$in:interested}}).populate('user','username')
        // const posts= await Post.find({ _id: { $in: interested } }).populate('user', 'username');
        res.send(posts)

    }catch(error){
        console.log("error occured while fetching the posts:",error)
        res.status(500).json({message:error.message})
    }
}



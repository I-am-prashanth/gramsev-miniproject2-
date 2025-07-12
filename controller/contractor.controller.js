import generate from "../libs/utils/generatetoken.js";
import Contractor from "../models/contrator.model.js";
import Post from "../models/post.model.js";
import bcrypt from "bcryptjs"


export const signup=async(req,res)=>{
    
    try{
        const {name,gmail,password,phone_number,address,pincode,State}=req.body;
        
    const emailregex=/^\S+@\S+\.\S+$/
        if(!emailregex.test(gmail)){
            return res.status(400).json({error:"inavlid email fromat"})
        }
    const findmail=await Contractor.findOne({gmail});
    if(findmail){
        return res.status(404).json({message:"user whith this already exists"})
    }

    const findnumber=await Contractor.findOne({phone_number})

    if(findnumber)
        return res.status(404).json({message:"phone number already exist, try anotherone"})

        const salt=await bcrypt.genSalt(10);
        const hashpassword=await bcrypt.hash(password,salt);


    //      let validLocation = undefined;
    // if (location && mongoose.Types.ObjectId.isValid(location)) {
    //   validLocation = location;
    // }

    if(!name || !pincode || !State || !address){
            console.log("provide all information:");
            res.status(404).json({message:"please provide all correct information"})
        }

        const newContractor=new Contractor({
            name:name,
            location:location,
            phone_number:phone_number,
            password:hashpassword,
            // location:validLocation,
            gmail:gmail,
            pincode:pincode,
            State:State,
            address:address
        })

        if(newContractor){
            generate(newContractor._id,res);
            await newContractor.save();
            res.send(newContractor)
        }
        else{
            res.status(400).json({error:"user not created"})
        }
    }catch(error){
        console.log("error occured while saving contractor:",error.message);
    }
}

export const addpost=async(req,res)=>{
    const {title,location,bio,no_of_workers,wages,img,pincode,State,address}=req.body;
    try{
        const id=req.user._id;
        console.log("id:",id);
    //     let validLocation = undefined;
    // if (location && mongoose.Types.ObjectId.isValid(location)) {
    //   validLocation = location;
    // }

    if(! bio ||! title || ! no_of_workers || ! wages || !pincode || ! State || ! address){
        return res.status(500).json({message:"provide all the data for the post"})
    }
    


    const validimg=img||"";

    console.log("Creating Post with: ", {
  to: id,
  title,
  bio,
  no_of_workers,
  wages,
  img: validimg,
//   location: validLocation
address:address,
pincode:pincode,
State:State
});


    const addpost=new Post({
        to:id,
        title:title,
        bio:bio,
        no_of_workers:no_of_workers,
        wages:wages,
        img:validimg,
        // location:validLocation
        address:address,
        pincode:pincode,
        State:State
    })

    if(addpost){ await addpost.save();
        await Contractor.findByIdAndUpdate(id, {$push:{posts:addpost._id}})
    }

    res.status(200).json({message:req.user})



    }catch(error){
        console.log("error occured while add a post:",error.message)
        res.status(404).json({message:"unnable to add a post"})
    }
}


export const login=async(req,res)=>{
    try{

        const {phone_number,password}=req.body;

        const user=await Contractor.findOne({phone_number});

        if(!user){
            console.log("user not fount with this phone number")
            res.status(500).json({message:"user not found"})
        }

        const checkpassword=await bcrypt.compare(password,user?.password || "");
        if(!checkpassword){
            console.log("incorect password check it !")
            res.status(500).json({message:"invalid password"});
        }
        generate(user._id,res);
        res.status(200).json(user)

    }catch(error){
        console.log("error occured while login:",error.message);
        res.status(500).json({message:"error cooured while login check login password"})
    }
}



export const getconstructor=async(req,res)=>{
    try{
        const user=await Contractor.findOne(req.user._id).lean();
        if(!user) res.status(500).json({message:"user not found in database/ token expaired"})
        delete user.password;
            res.send(user)

    }catch(error){
        console.log("error occured while getting data",error.message);
        res.status(500).json({message:"unable to get/fetch the data or token expaired"})
    }
}


export const getallpost=async(req,res)=>{
    const post=req.user.posts;

    try{
        console.log(post);
        let ans=await Promise.all(
        post.map(async element => {
            console.log(element)
            const ans=await Post.findOne(element)
            return ans
        }))
        console.log(ans);
        res.send(ans)
        

    }catch(error){
        console.log("error occured while fetting all posts");
        res.status(500).json({message:"unabale to fetch post ",error:error.message})
    }
}


export const logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({messsage:"sucessfully loggrd out"})
    } catch (error) {
        res.status(500).json({message:"unable to logout"})
    }
}


export const updateprofile=async(req,res)=>{
    const {name,gmail,phone_number,img,password,pincode,address,State}=req.body;
    const salt=await bcrypt.genSalt(10);
    let newpassword=req.user.password;
    if(password) newpassword=await bcrypt.hash(password,salt);

    const emailregex=/^\S+@\S+\.\S+$/
        if(gmail && !emailregex.test(gmail)){
            return res.status(400).json({error:"inavlid email fromat"})
        }

    try{
        const newprofile={
            name:name || req.user.name,
            // location:location || req.user.location,
            gmail:gmail || req.user.gmail,
            password:newpassword,
            phone_number:phone_number || req.user.phone_number,
            State:State,
            address:address,
            pincode:pincode
        }
        await Contractor.findByIdAndUpdate(req.user._id,newprofile);
        res.status(200).json({message:"sucessfully updated",body:newprofile})
    }catch(error){
        console.log("error occured while updating the profile",error.message);
        res.status(500).json({message:error.message})
    }
}


export const updatepost=async(req,res)=>{
    const {title,bio,no_of_workers,wages,img,pincode,address,State}=req.body;
    const {id}=req.params;
    try{
    console.log(id);
    const post=await Post.findById(id)
    const newpost={
        title:title || post.title,
        bio:bio || post.bio,
        no_of_workers:no_of_workers || post.no_of_workers,
        wages:wages || post.wages,
        img:img || post.img,
        State:State,
        address:address,
        pincode:pincode
    }

    
    console.log(post)
    if(newpost){
        await Post.findByIdAndUpdate(post._id,newpost);
        return res.send(newpost)
    }
    res.status(500).json({message:"error occured while updatinf the post"})
    }catch(error){
        console.log("error occured while updatinf the post:",error.message);
        res.status(500).json({message:"error occured"})
    }
    
}


export const deletepost=async(req,res)=>{
   
    const {id}=req.params;
    try{


        await Post.findByIdAndDelete(id);
        res.status(200).json({message:"sucessfully deleted"})
    }catch(error){
        console.log("error occured while deleting post:",error.message);
        res.status(500).json({message:"eror occured while deleting the post //internal error"})
    }

}


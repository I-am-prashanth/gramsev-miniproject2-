import Contractor from "../models/contractor.model.js";
import Worker from "../models/worker.model.js";
import bcrypt from "bcryptjs";
import generate from "../utils/generate.js";
import Post from "../models/Post.model.js";
import { Model } from "mongoose";

export const getme=async(req,res)=>{
    //simply send req,user (protect user middleware as output used for seeing our own profile)
    try{
        const {user}=req;
        res.status(200).json({user});

    }catch(error){
        console.log(error.message)
        res.status(500).json({message:"error occured:"+error.message})
    }
}

export const logout=async(req,res)=>{
    try{
        //simply jwt get expired i.e., automaticall get deleted
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"sucessfully logged out!!!"})
    }catch(error){
        console.log("unable to logout:",error)
        res.status(500).json({message:error.message})
    }
}

export const signup=async(req,res)=>{
    try{
        let Model="Worker"
        //taking common required parameters (both contractor and user) as request
        const {username,gmail,phoneNumber,address,pincode,password,type}=req.body;
        
        
        
        //type decides weather we have signup as worker or contractor 
       if(type)
        Model = type === 'Worker' ? Worker : Contractor;
    else
    Model = Model === 'Worker' ? Worker : Contractor;
        
        const emailregex=/^\S+@\S+\.\S+$/
        
        if(!emailregex.test(gmail)){//ckecking gmail format
            return res.status(400).json({error:"inavlid email fromat"})
        }
        const findmail=await Model.findOne({gmail});//checking any user with same mail exist or not
    if(findmail){
        return res.status(404).json({message:"user whith this already exists"})
    }

    const finduser=await Model.findOne({username})//checking any user with same username exist or not
    if(finduser)return res.status(404).json({message:"user whit this username already exist"})

        const findnum=await Model.findOne({phoneNumber})//checking any user with same phonenumber exist or not
    if(findnum)return  res.status(400).json({message:"user whit this phone number already exist"})
        const salt=await bcrypt.genSalt(10);
        
        const setpass=await bcrypt.hash(password,salt)//hasing the user password
        const newCon=new Model({//creating the data
            username:username,
            gmail:gmail,
            phoneNumber:phoneNumber,
            pincode:pincode || " ",
            address:address || " ",
            password:setpass
        })
        if(newCon){
            
            generate(newCon._id,res)//generating a jwt web token when sucessfully signed up
            await newCon.save();
            res.send(newCon);
        }
        else{
            res.status(500).json({message:"cant able to create user"})
        }
        

    }catch(error){
        console.log("error occured whole sign up",error)
        res.status(500).json({message:error.message})
    }
}

export const login=async(req,res)=>{
    try{
        
        const {password,type}=req.body;
        const username=req.body.username || undefined//taking username from user
        const Model = type === 'Worker' ? Worker : Contractor;
        let user=null
        if(!username){//username is mandedatory (either username or phonenumber or gmail)
            res.status(404).json({message:"invalid intities || usernot exist"})
        }
        else{
            //finding the user exist with give data(username)
            user=await Model.findOne({username:username})//checking with username
           if(!user) user=await Model.findOne({phoneNumber:username})//checking with phonenumber
            
           if(!user) user=await Model.findOne({gmail:username})//checking with mail
            
        }
    if(!user) res.status(404).json({message:"unable to find user with giver credentails"})
    
    //before login it checking the given password
        const checkpass=await bcrypt.compare(password,user.password);

        if(!checkpass) res.status(500).json({message:"invalid password"})
        generate(user._id,res)
   
   
        res.status(201).json(user)

    }catch(error){
        console.log(error);
        res.status(500).json({message:"error occured while login:"+error.message})
    }
}

export const updateprofile=async(req,res)=>{
    try{
        let newpass=req.user.password;
        const{username,gmail,phoneNumber,address,pincode,State,newpassword,password,type}=req.body;
        const Model=type==="Worker"?Worker:Contractor;

        if(newpassword){
            //if new pasword is given it should match with oldone
            const comparepass=await bcrypt.compare(password ,req.user.password);
            if(!comparepass) res.status(404).json({message:"current password doesnt not match with old password"})
            const salt=await bcrypt.genSalt(10);
            
                newpass=await bcrypt.hash(newpassword,salt);
        }
        
        //checking new username already exist or not
        if(username && String(username) !== String(req.user.username)  ){
            const finduser=await Model.findOne({username:username})
            if(finduser) res.status(500).json({message:"user already exist with this username"})
        }
    //checking new gamil already exist or not
    if(gmail && String(gmail) !== String(req.user.gmail)  ){
            const finduser=await Model.findOne({gmail:gmail})
            if(finduser) res.status(500).json({message:"user already exist with this mail"})
        }
    //checking new phonenumber already exist or not
    if(phoneNumber &&   String(phoneNumber) !== String(req.user.phoneNumber)){
            const finduser=await Model.findOne({phoneNumber:phoneNumber})
            if(finduser) res.status(500).json({message:"user already exist with this phone number"})
        }
        let newprofile=null
        if(type!=="Worker"){
            newprofile=await Model.findByIdAndUpdate(req.user._id,{
            username:username || req.user.username,
            gmail:gmail || req.user.gmail,
            phoneNumber:phoneNumber || req.user.phoneNumber || " ",
            address:address || req.user.address,
            pincode:pincode|| req.user.pincode,
            State:State || req.user.State,
            password:newpass
        },{new:true})
        
    }
    else{
        newprofile=await Model.findByIdAndUpdate(req.user._id,{
            username:username || req.user.username,
            gmail:gmail || req.user.gmail,
            phoneNumber:phoneNumber || req.user.phoneNumber || " ",
            address:address || req.user.address,
            pincode:pincode|| req.user.pincode,
            password:newpass
            },{new:true})

    }
    res.status(201).json(newprofile);


    }catch(error){
        console.log("error occured while updating profile:",error)
        res.status(500).json({message:error.message})
    }
}

export const getNearSuggestions=async(req,res)=>{
    try{
        const pincode=req.user.pincode;
        let posts=null
        if(pincode==" ")
            posts=await Post.aggregate([{$sample: { size: 5}} ]).exec()
        else
         posts=await Post.find({pincode:pincode})
        if(!posts) return res.status(200).json([])
    res.status(200).json(posts)

    }catch(error){
        console.log("got error while fetching  posts",error)
        res.status(500).json({message:error.message})
    }
}

export const allsugesstions=async(req,res)=>{
    try{
        const {State}=req.user;
       let posts=null
        if(State==" ")
            posts=await Post.aggregate([{$sample: { size: 5}} ]).exec()
        else
         posts=await Post.find({State:State})
        if(!posts) return res.status(200).json([])
    res.status(200).json(posts)

    }catch(error){
        console.log("got error while fetching  posts",error)
        res.status(500).json({message:error.message})
    }
}

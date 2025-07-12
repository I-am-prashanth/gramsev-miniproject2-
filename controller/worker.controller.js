import Worker from "../models/wroker.model.js";
import bcrypt from "bcryptjs"
import generate from "../libs/utils/generatetoken.js";
import Post from "../models/post.model.js";

export const signup=async(req,res)=>{
    console.log("this is not correct")
    try{
        const {name,gmail,password,phone_number,pincode,State,address}=req.body;
        const emailregex=/^\S+@\S+\.\S+$/
            if(!emailregex.test(gmail)){
                return res.status(400).json({error:"inavlid email fromat"})
            }
        const findmail=await Worker.findOne({gmail});
        if(findmail){
            return res.status(404).json({message:"user whith this email already exists howlw"})
        }
        const findnumber=await Worker.findOne({phone_number})
        // if(phone_number.length()!=10)
        if(findnumber)
            return res.status(404).json({message:"phone number already exist, try anotherone"})
            const salt=await bcrypt.genSalt(10);
            const hashpassword=await bcrypt.hash(password,salt);

        //     let validLocation = undefined;
        // if (location && mongoose.Types.ObjectId.isValid(location)) {
        //     validLocation = location;
        // }
        
        if(!name || !pincode || !State || !address){
            console.log("provide all information:");
            res.status(404).json({message:"please provide all correct information"})
        }
            const newWorker=new Worker({
                name:name,
                // location:location,
                phone_number:phone_number,
                password:hashpassword,
                location:validLocation,
                gmail:gmail,
                pincode:pincode,
                State:State,
                address:address
            })
    
            if(newWorker){
                generate(newWorker._id,res);
                await newWorker.save();
                res.send(newWorker)
            }
            else{
                res.status(400).json({error:"user not created"})
            }

    }catch(error){
        console.log("error occured while login",error);
        res.status(500).json({message:"error while signup"})
    }
}

export const login=async(req,res)=>{
    const{phone_number,password}=req.body;
    try{

        const user=await Worker.findOne({phone_number});
        if(!user){
            return res.status(404).json({message:"user not found whith is creditial"})
        }

        const checkpassword=await bcrypt.compare(password,user?.password || "");

        if(!checkpassword){
            console.log("incorrect password check it !!.")
            return res.status(404).json({message:"user not found whith this chedentials"})
        }
        generate(user._id,res);
        return res.status(200).json(user)
        
    }catch(error){
        console.log("error occured while login:",error.message);
        res.status(500).json({message:"error occured while login to worker"});
    }
}

export const getworker=async(req,res)=>{
    try{
        const id=req.user._id;
        if(!id){
            console.log("error occured",error.message);
            return res.status(404).json({message:"token not fond"})
        }
        console.log(id)
        const user=await Worker.findById(id);
        if(!user){
            return res.status(404).json({message:"user not found "})
        }
        res.send(user)
    }catch(error){
        console.log("error oxxured while fetching data of workers",error.message)
        return res.status(500).json({message:"internal error"})
    }
}

export const logout=async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({messsage:"sucessfully loggrd out"})
    }catch(error){
        console.log("unable to logout:",error.message);
        return res.status(500).json({message:"unable to logout"})
    }
}


export const updateprofile=async(req,res)=>{
    const {name,phone_number,gmail,password,State,pincode}=req.body;
     try{
        if(gmail){
         const emailregex=/^\S+@\S+\.\S+$/
            if(!emailregex.test(gmail)){
                return res.status(400).json({error:"inavlid email fromat"})
            }
            if(gmail!==req.user.gmail){
            const findmail=await Worker.findOne({gmail});
            if(findmail){
            return res.status(404).json({message:"user whith this email already exists howlw"})
            }
         }}

         if(phone_number!==req.user.gmail){
        const findnumber=await Worker.findOne({phone_number})
        if(findnumber)
            return res.status(404).json({message:"phone number already exist, try anotherone"})
        }

            const hashpassword=password
            if(password){
            const salt=await bcrypt.genSalt(10);
             hashpassword=await bcrypt.hash(password,salt);
            }

        //     let validLocation = undefined;
        // if (location && mongoose.Types.ObjectId.isValid(location)) {
        //     validLocation = location;
        // }
        
        const newprofile={
            name:name || req.user.name,
            phone_number:phone_number || req.user.phone_number,
            gmail:gmail || req.user.gmail,
            password:hashpassword || req.user.password,
            State:State,
            address:address,
            pincode:pincode
        }
        
        await Worker.findByIdAndUpdate(req.user._id,newprofile);
        
        res.status(200).json({messsage:"sucessfully updated"})
    }catch(error){
        console.log("error occured while updating:",error.message);
        return res.status(500).json({message:"internal error while updating"})
    }
}


export const suggestion=async(req,res)=>{ 
    try{
        // const pincode=req.user.pincode;
        console.log("searching for suggestions")
        const pincode=req.user.pincode;
        // const pincode="502001";
        console.log(pincode)
        const suggestedpost=await Post.find({pincode:pincode});
        console.log(suggestedpost);

        res.send(suggestedpost);
    }catch(error){
        console.log("exxror while getting suggestion:",error.message);
        return res.status(500).json({message:"internal server error"});
    }
}


export const suggestionoverall=async(req,res)=>{
    try{
        console.log("State:",req.user.State)
        const posts = await Post.aggregate([
  { $match: { State: req.user.State } },
  { $sample: { size: 10 } }
]);
        console.log(posts);
        res.send(posts)
    }catch(error){
        console.log("error occured while fetinf suggestions:",error.message);
        return res.status(500).json({message:"internal derver error"})
    }
}



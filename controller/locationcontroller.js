import mongoose from "mongoose";
import Location from "../models/location.model.js"

const addlocation=async (req,res)=>{
    try{
    const {pincode,address,city,state}=req.body;
    if(!pincode || !address || !city || !state){
        res.status(404).json("give complete details");
    }
    const newlocation=new Location({
        city:city,
        pincode:pincode,
        address:address,
        city:city,
        state:state
    })
    if(newlocation){
        await newlocation.save()
        res.status(200).json({message:"location has been saved"})
    }}catch(error){
        console.log("error occured while saving location:",error.message)
    }
}
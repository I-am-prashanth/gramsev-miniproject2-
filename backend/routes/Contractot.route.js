import express from "express";
import { addpost, deletpost, getallpost, updatepost } from "../controller/Contractor.controller.js";
import Protectuser from "../middleware/PrtotectContractot.js";

const Router=express.Router();


Router.post("/addpost",Protectuser,addpost);
Router.get("/allpost",Protectuser,getallpost)
Router.post("/updatepost/:id",Protectuser,updatepost)
Router.delete("/deletepost/:id",Protectuser,deletpost)

export default Router;
import express from "express";
// import { signup } from "../controller/Worker.controller.js";
 import Protectuser from "../middleware/PrtotectContractot.js";
import { AllinterestedPosts, interstedPost } from "../controller/Worker.controller.js";


const Router=express.Router();

Router.post("/interest/:id",Protectuser,interstedPost)
Router.get("/interestPosts/",Protectuser,AllinterestedPosts)

export default Router;
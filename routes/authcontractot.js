import express from "express";
import { addpost, deletepost, getallpost, getconstructor, login, logout, signup, updatepost, updateprofile } from "../controller/contractor.controller.js";
import Protectuser from "../middleware/Protectuser.js";

const router=express.Router()

router.post("/signup",signup);
router.post("/addpost",Protectuser,addpost);
router.post("/login",login)
router.get("/get",Protectuser,getconstructor);
router.get("/allpost",Protectuser,getallpost)
router.post("/logout",logout)
router.post("/updateprofile",Protectuser,updateprofile)
router.post("/updatepost/:id",Protectuser,updatepost)
router.post("/deletepost/:id",Protectuser,deletepost)
// router.post("/deleteaccount",Protectuser,deleteaccount)

export default router


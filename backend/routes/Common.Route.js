import express from "express";
import { allsugesstions, getme, getNearSuggestions, login, logout, signup, updateprofile } from "../controller/common.controls.js";
 import Protectuser from "../middleware/PrtotectContractot.js";


const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/me",Protectuser ,getme)
router.post("/updateprofile",Protectuser ,updateprofile)
router.post("/nearsuggestions",Protectuser ,getNearSuggestions)
router.post("/allSuggestions",Protectuser ,allsugesstions)

export default router
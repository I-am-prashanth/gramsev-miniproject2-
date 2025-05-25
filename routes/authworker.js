import express from "express";
import { getworker, login, logout, signup, suggestion, suggestionoverall, updateprofile } from "../controller/worker.controller.js";
// import Protectuser from "../middleware/Protectuser.js";
import Protectworker from "../middleware/Protectedworker.js";

const router=express.Router();

router.post("/wsignup",signup);

router.post("/login",login);

router.get("/get",Protectworker,getworker);

router.post("/logout",logout)

router.post("/updateprofile",Protectworker,updateprofile)

router.get("/suggestionnear",Protectworker,suggestion)

router.get("/suggestionoverall",Protectworker,suggestionoverall)

// router.post("/deleteaccount",Protectuser,deleteaccount)

export default router
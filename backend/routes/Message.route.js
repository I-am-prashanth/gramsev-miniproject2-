import express from "express";
import Protectuser from "../middleware/PrtotectContractot.js";
import { getmessages, getUser, sendmessage } from "../controller/Message.controller.js";


const route=express.Router();

// route.post("/addmessage",)

// route.get("/allmessage",);

route.get("/users",Protectuser,getUser);

route.get("/getmsg/:id",Protectuser,getmessages);

route.post("/sendMsg/:id",Protectuser,sendmessage)


export default route;
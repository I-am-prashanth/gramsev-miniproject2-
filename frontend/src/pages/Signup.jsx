import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {useMutation, useQuery} from "@tanstack/react-query"

function Signup() {
  const [username,setusername]=useState("");
  const [gmail,setmail]=useState("");
  const [phoneNumber,setPhone]=useState("");
  const [password,setpassword]=useState("");
   const [pincode,setpincoe]=useState("");
  const [type,settype]=useState("Worker");
const address=""



const {mutate,isPending,Iserror}=useMutation({
    mutationFn:async({username,gmail,phoneNumber,address,pincode,password,type})=>{
      try{
        console.log(username,gmail,phoneNumber)
        const res=await fetch('/api/signup',{
          method:'POST',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({username,gmail,phoneNumber,address,pincode,password,type})
        })
        console.log("fetch completed")
        console.log(res)
        // const data=await res.json();
        // if(data.error) throw new Error(data.error);
      console.log("done");
      return null;

      }catch(error){
        console.log(error)
      }
    }
  })

const hanndelsignup=(e)=>{
  
    e.preventDefault();
  mutate({username,gmail,phoneNumber,password,pincode,type});
  // mutate({username,gmail,phoneNumber,address,pincode,password,type})
  
}



  return (
    <>

<div style={{margin:"0px 0px 0px 0vw"}} >
       <h1 className="text-6xl font-bold" style={{margin:"10px 0px 0px 35vw"}} >Sign up Today</h1>
    
</div>


    <div className='mx-130 mt-10'>
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      {/* <span className='text-amber-700 ml-70 text-1xl '>*</span> */}
      <label className="floating-label mt-1 ">
      <span>Enter usename</span>
      <input type="text" placeholder="Username" value={username} onChange={(e)=>{
         // e.preventDefault
      setusername(e.target.value)}} className="input input-md" />
      </label>


      <label className="floating-label my-2">
        <span>Enter Email</span>
        <input type="text" placeholder="Yourgmail@gmail.com" value={gmail} onChange={(e)=>{
        e.preventDefault;
        setmail(e.target.value)
        }} className="input input-md" />
      </label>


      <label className="floating-label my-1">
        <span>Enter phoneNumber</span>
        <input type="text" placeholder="PhoneNumber-XXXXXXXXXX" value={phoneNumber} onChange={(e)=>{
          e.preventDefault;
          setPhone(e.target.value)
          }} className="input input-md" />
      </label>


      <label className="floating-label my-2">
        <span>Enter Password</span>
        <input type="text" placeholder="Password " value={password} onChange={(e)=>{
        e.preventDefault;
        setpassword(e.target.value)
        }} className="input input-md" />
      </label>



      <label className="floating-label my-1">
        <span>Enter Pincode</span>
        <input type="text" placeholder="PINCODE-XXXXX" value={pincode} onChange={(e)=>{
          e.preventDefault;
          setpincoe(e.target.value)
          }} className="input input-md" />
      </label>


      <div className=''>Select Type of Acc</div>
        <div className="my-2">
  <label className="label cursor-pointer flex items-center gap-2">
    <input
      type="radio"
      name="radio-4"
      className="radio radio-primary my-2"
      defaultChecked
      onClick={()=>{settype("Worker")}}
    />
    <span className="label-text">Worker</span>
  </label>

  <label className="label cursor-pointer flex items-center gap-2">
    <input
      type="radio"
      name="radio-4"
      className="radio radio-primary"
      onClick={()=>{settype("Contractor")}}
    />
    <span className="label-text">Contractor</span>
  </label>
</div>


    <button className="btn btn-neutral mt-2" onClick={hanndelsignup}>Signup</button>


    <p className="text-2xl ">Already have a account?</p>
    <Link to="/login"><button className="btn btn-neutral mt-4" style={{width:"350px"}}>Login</button></Link>

    </fieldset>
</div>

    </>
  )
}

export default Signup

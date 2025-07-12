import { useState } from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { useQuery } from '@tanstack/react-query'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import { Navigate, Route,Routes } from 'react-router-dom'
import Notification from './pages/Notification'
import Profile from './pages/Profile'
// import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProfile from './pages/EditProfile'
import Chatpage from './components/chat/Chatpage'


function App() {
  const [count, setCount] = useState(0)
  const {data:authUser,isLoading}=useQuery({
    queryKey:['authUser'],
    queryFn:async()=>{
      try{
        const data=await fetch('/api/me',{
          method:'GET',
          headers: {
          "Content-Type": "application/json"
        },})
        if(data.sucess==401){
          return null;
        }
         if(!data.ok){
          throw new Error(data.error || "something went wrong")
        }
        
        const res= await data.json();
        if(res.error) return null
        if(!data.ok){
          throw new Error(data.error || "something went wrong")
        }
        // console.log(res)
        return res 

      }catch(error){
        console.log(error);
        return null;

      }
    },
    retry:false
  })
  if(isLoading){
    return(<div className='h-screen flex justify-center items-center'>
      <span className="loading loading-dots loading-xl"></span>

    </div>)
  }

  return (
    <>
    {authUser && <Sidebar />}
    <ToastContainer position="bottom-right" autoClose={3000} />

    <Routes>
      <Route path="/login" element={!authUser?<Login />:<Navigate to="/" />} /> 
      <Route path="/signup" element={!authUser?<Signup />:<Navigate to="/" />} />

      <Route path="/" element={!authUser?<Login />: <Home/>} />
      <Route path="/profile" element={!authUser?<Login />: <Profile/>} />
      <Route path="/notifications" element={!authUser?<Login />: <Notification/>} />
        </Routes>
  
      {authUser && <Chatpage />}

      {/* <toast /> */}
    </>
   
  )
}

export default App

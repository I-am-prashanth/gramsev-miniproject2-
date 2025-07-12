import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiCompass, 
  FiBell, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiMessageSquare
} from 'react-icons/fi';
import { useMutation, useQueries ,useQueryClient} from '@tanstack/react-query';




function Sidebar() {
  const userqueries=useQueryClient();
  const{mutate,isPending}=useMutation({
    mutationFn:async()=>{
      try{
        console.log("logging out")
        const logout=await fetch('/api/logout',{
           method:"POST",
           headers:{
                        "Content-Type":"application/json"
                    }
        })
        console.log(logout)
        const res=await logout.json();
        console.log("res",res)
      }catch(error){
        console.log(error)
      }
    },
    onSuccess:()=>{
        
         userqueries.invalidateQueries({queryKey:["authUser"]})
    }
  })

  const handelLogout=(e)=>{
    e.preventDefault();
    mutate()
  }


  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 shadow-xl overflow-y-auto transition-all duration-300 hover:shadow-2xl">
      {/* Logo/Branding */}
      <div className="flex items-center mb-10 pl-2">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          WorkConnect
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="space-y-1">
        <Link 
          to="/" 
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-1 group"
        >
          <FiHome className="text-xl text-blue-400 group-hover:text-white transition-colors" />
          <span className="font-medium">Dashboard</span>
        </Link>
        
        <Link 
          to="/explore" 
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-1 group"
        >
          <FiCompass className="text-xl text-green-400 group-hover:text-white transition-colors" />
          <span className="font-medium">Discover</span>
        </Link>
        
        <Link 
          to="/notifications" 
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-1 group"
        >
          <div className="relative">
            <FiBell className="text-xl text-yellow-400 group-hover:text-white transition-colors" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
          </div>
          <span className="font-medium">Alerts</span>
        </Link>
        
        <Link 
          to="/messages" 
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-1 group"
        >
          <FiMessageSquare className="text-xl text-purple-400 group-hover:text-white transition-colors" />
          <span className="font-medium">Messages</span>
        </Link>
        
        <Link 
          to="/profile" 
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-1 group"
        >
          <FiUser className="text-xl text-pink-400 group-hover:text-white transition-colors" />
          <span className="font-medium">My Profile</span>
        </Link>
      </nav>

      {/* Settings Section */}
      <div className="mt-10 pt-6 border-t border-gray-700">
        <Link 
          to="/settings" 
          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gray-700 hover:translate-x-1 group"
        >
          <FiSettings className="text-xl text-gray-400 group-hover:text-white transition-colors" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
      
      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button 
          
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-all hover:bg-red-600/20 hover:text-red-400 group"
        >
          <FiLogOut className="text-xl text-red-400 transition-colors" />
          <span className="font-medium" onClick={handelLogout}>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
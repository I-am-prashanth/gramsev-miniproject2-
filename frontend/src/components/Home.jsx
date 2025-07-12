import React, { useState, useEffect } from 'react';
import Post from './Post';

function Homepage() {
  const [posts,serposts]=useState("")
  const [activeTab, setActiveTab] = useState("suggested")
  const sugg="/api/nearsuggestions"
  const fetchposts=async()=>{
    const fetchurl = activeTab === 'suggested' ? "/api/nearsuggestions" : "/api/allSuggestions";
    
    try{
      // console.log(fetchurl)
    const res=await fetch(fetchurl,{
      method:'POST',
       headers: {
          "Content-Type": "application/json"
        },
    })
    // console.log("api:",fetchurl)
    // console.log(res)
    const allposts=await res.json();
    serposts(allposts)
  }catch(error){
    console.log(error);
    throw error
  }

  }

  const handleLikePost=()=>{
    console.log("liked")
  }

  useEffect(() => {

    fetchposts();
  

  }, [activeTab]);

  return (
    <div className="flex ml-[11%]  min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content container with proper centering */}
      <div className="w-165 max-w-5xl ml-30 py-6 "> {/* Removed manual margins */}
        {/* Tab navigation */}
        <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pt-2 pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-100">
            <button
              onClick={() => setActiveTab('suggested')}
              className={`relative py-3 px-1 font-medium text-sm transition-all duration-200 ${
                activeTab === 'suggested'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Near Your Area
              {activeTab === 'suggested' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('following')}
              className={`relative py-3 px-1 font-medium text-sm transition-all duration-200 ${
                activeTab === 'following'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Over All
              {activeTab === 'following' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Posts content */}
        {posts.length > 0 ? (
              posts.map(post => (
                <Post key={post._id} 
                  post={post} 
                  onLike={handleLikePost}  />
               
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No posts yet. Create your first post!</p>
              </div>
            )}
        {/* <div className="space-y-6">
          <Post />
        </div> */}
      </div>
    </div>
  );
}

export default Homepage;
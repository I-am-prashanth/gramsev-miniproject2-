import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiEdit2, FiUser, FiMail, FiPhone, FiMapPin, FiUsers, FiHeart, FiImage, FiX } from 'react-icons/fi';
import Addpost from '../components/Addpost';
import Post from '../components/Post';




// Main Profile Component
const Profile = (props) => {
  
  
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [type,settype]=useState('Worker')
  const queryClient = useQueryClient();
  const [api,setapi]=useState('"/api/contractor/allpost"')

  const {data:Posts = [],isPending}=useQuery({
    queryKey:['Posts',api],
    queryFn:async()=>{
      try{
        const res=await fetch(api,{
          method:'GET',
          headers:{
            "Content-Type":"application/json"
          },        
          })
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const pp=await res.json()
          return pp
      }catch(error){
        console.log(error.message)
        throw error
      }
    },
    retry:false
  })

  
  const fetchUserData = async () => {
      try {
        await queryClient.invalidateQueries(['authUser']);
        const userData = queryClient.getQueryData(['authUser']);
        setAuthUser(userData.user);
        
  //  let api="/api/contractor/allpost"
        let user=userData.user;
        if(user._id===userData.user._id)
        if(user && 'posts' in user){
          setapi('/api/contractor/allpost')
          settype("Contractor")
        
        }
        else{
          setapi("api/worker/interestPosts")
          settype("Worker")
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {

    fetchUserData();

  }, [queryClient]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAuthUser(prev => ({ ...prev, profilePhoto: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

 

  const handleLikePost = (postId, liked) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: liked ? post.likes + 1 : post.likes - 1 }
        : post
    ));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 rounded-full bg-gray-300"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-300 rounded"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center py-12">
        <h2 className="text-xl font-medium text-gray-700">User not found</h2>
      </div>
    );
  }
  if(isPending){
    <div>
      loading...
    </div>
  }

  if(Post?.length>0){

  
  return (
    
      <div className="max-w-2xl mx-[18%] p-4">
       
      {/* Cover Photo */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden mb-6">
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <button 
            className="absolute bottom-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-all"
            onClick={() => fileInputRef.current.click()}
          >
            <FiEdit2 size={18} />
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img 
              src={authUser.profilePhoto || 'https://img.daisyui.com/images/profile/demo/idiotsandwich@192.webp'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          {isHovered && (
            <button 
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all"
              onClick={() => fileInputRef.current.click()}
            >
              <FiEdit2 size={16} />
            </button>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-100">{authUser.username}</h1>
          <p className="text-gray-100">@{authUser.username}</p>
          <p className="mt-2 text-gray-300">{authUser.bio || "No bio yet"}</p>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <FiMail className="text-gray-500 mr-3" />
          <div>
            <p className="text-xs text-gray-900">Email</p>
            <p className="font-medium text-gray-900">{authUser.gmail || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <FiPhone className="text-gray-500 mr-3" />
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{authUser.phoneNumber || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <FiMapPin className="text-gray-500 mr-3" />
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="font-medium text-gray-900">{authUser.address || 'Not provided'}</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <FiUser className="text-gray-500 mr-3" />
          <div>
            <p className="text-xs text-gray-500">Member since</p>
            <p className="font-medium text-gray-900">
              {new Date(authUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'posts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'likes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('likes')}
          >
            Likes
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
              activeTab === 'saved'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {/* <AddPost onPostAdded={handleAddPost} />
             */}
             {type==="Contractor" && <Addpost api={api} />}
             
             {/* {console.log(type)} */}
             {/* {console.log(posts)} */}
            {Posts.length > 0 ? (
              Posts.map(post => (
                <Post key={post._id} 
                  post={post} 
                  api={api}
                  onLike={handleLikePost}
                  type={type}
                    />
               
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No posts yet. Create your first post!</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'likes' && (
          <div className="text-center py-12 text-gray-500">
            <FiHeart size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Posts you've liked will appear here</p>
          </div>
        )}
        {activeTab === 'saved' && (
          <div className="text-center py-12 text-gray-500">
            <p>Saved posts will appear here</p>
          </div>
        )}
      </div>
    </div>)
  }
};

export default Profile;
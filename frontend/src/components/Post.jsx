import React, { useEffect, useState } from 'react'
import PostSkelton from './PostSkelton'
import { FiHeart, FiUser ,FiMessageSquare,FiUsers ,FiDollarSign ,FiMapPin ,FiHash , FiShare2, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import EditPost from './EditPost';
import { useQueryClient } from '@tanstack/react-query';

function Post(props) {
  const [post,setposts]=useState([])
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isEditing,setedit]=useState(false);
  const queryClient = useQueryClient();
 

  const handleUpdate=async()=>{
    console.log("pp")
    setedit(true)
  }
    useEffect(()=>{     
         try{         
            setposts(props.post)
         }catch(error){
            console.log(error)
         }
    },[])


const handeldel=async()=>{
  try{
    const res=await fetch(`/api/contractor/deletepost/${props.post._id}`,{
      method:'DELETE',
                headers:{
                        "Content-Type":"application/json"
                    },
    })
    queryClient.setQueryData(['Posts', props.api], (oldPosts) => 
      oldPosts.filter(p => p._id !== props.post._id)
    );
    console.log(response)
    // await queryClient.invalidateQueries(['Posts']);
    await queryClient.invalidateQueries(['Posts',props.api]);
    

  }catch(error){
    console.log(error)
    throw error
  }
}
   


     const handleLike = async() => {
    setIsLiked(!isLiked);
    try{
    const res=await fetch(`api/worker/interest/${props.post._id}`,{
        method:'POST',headers: {
          "Content-Type": "application/json"
        },
      }

    )
    const response=await res.json();
    console.log(response)


    // onLike(post.id, !isLiked);
  }
catch(error){
  console.log(error);
  throw error

}}

return (
  
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-5">
    <div className="p-4">
      {/* User header */}
      {/* {console.log("type",props.type)} */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
          <FiUser className="text-gray-600 text-sm" />
        </div>
        <div>
         <div className="flex justify-between items-center mb-2">
  <p className="font-medium text-gray-800 text-sm">
    {props.post.user?.username || "Anonymous"}
  </p>
 <button className="
  flex items-center gap-1.5 
  px-3 py-1.5 
  bg-blue-50 hover:bg-blue-100 
  border border-blue-200 
  rounded-lg 
  transition-all 
  hover:shadow-sm 
  active:scale-95
  group
  ml-4
" onClick={handleUpdate}>
  {/* Pencil/edit icon SVG */}
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
  
  <span className="text-sm font-medium text-blue-500 group-hover:text-blue-600 transition-colors">
    Update
  </span>
</button>
  
<button className="
  flex items-center gap-1.5 
  px-3 py-1.5 
  bg-red-50 hover:bg-red-100 
  border border-red-200 
  rounded-lg 
  transition-all 
  hover:shadow-sm 
  active:scale-95
  group ml-3
" onClick={handeldel}>
  {/* Properly structured SVG with path */}
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
  
  <span className="text-sm font-medium text-red-500 group-hover:text-red-600 transition-colors">
    Delete
  </span>
</button>
</div>
{isEditing && <EditPost
 onClose={()=>setedit(false)}
 post={post}
 api={props.api} />}

<p className="text-xs text-gray-400">
  {new Date(post.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}
</p>
        </div>
      </div>

      {/* Post content */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm leading-snug">{post.bio}</p>
      </div>

      {/* Post details */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="flex items-center space-x-1 text-gray-600">
          <FiUsers className="text-gray-400" />
          <span>{post.noOfWorkers} workers</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <FiDollarSign className="text-gray-400" />
          <span>₹{post.wages}/day</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600 col-span-2">
          <FiMapPin className="text-gray-400" />
          <span className="truncate">{post.address}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <FiHash className="text-gray-400" />
          <span>{post.pincode}</span>
        </div>
      </div>

      {/* Image */}
      {post.img && (
        <div className="mb-3 rounded-md  h-auto border border-gray-100">
          <img 
            src={post.img} 
            alt="Post" 
            className="w-full h-auto rounded-md object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          className={`flex items-center space-x-1 text-sm ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={handleLike}
        >
          <FiHeart className={isLiked ? 'fill-current' : ''} />
          <span>{props.post.interested?.length + (isLiked ? 1 : 0)}</span>
        </button>
        <button
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center space-x-1"
          onClick={() => setShowComments(!showComments)}
        >
          <FiMessageSquare />
          <span>{showComments ? 'Hide comments' : 'Show comments'}</span>
        </button>
      </div>
    </div>
  </div>
);
}

export default Post

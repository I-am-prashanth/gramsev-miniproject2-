import React, { useState, useRef } from 'react';
import { FiEdit2, FiUser, FiMail, FiPhone, FiMapPin, FiUsers, FiHeart, FiImage, FiX } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

function Addpost({ onPostSuccess }) {
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [pincode, setPincode] = useState('');
  const [wages, setWages] = useState('');
  const [address, setAddress] = useState('');
  const [noOfWorkers, setNoOfWorkers] = useState('');
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: addPost, isPending } = useMutation({
    mutationFn: async ({ bio, wages, pincode, noOfWorkers, address, image }) => {
      const res = await fetch('/api/contractor/addpost', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ bio, wages, pincode, noOfWorkers, address, img: image })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      return await res.json();
    },
    onMutate: async (newPost) => {
      await queryClient.cancelQueries(['Posts']);
      
      const previousPosts = queryClient.getQueryData(['Posts']);
      
      queryClient.setQueryData(['Posts'], (old = []) => [
        ...old,
        {
          ...newPost,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          user: { 
            username: "You", // Temporary user data
            profilePhoto: localStorage.getItem('profilePhoto') 
          }
        }
      ]);

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['Posts'], context.previousPosts);
      toast.error(err.message);
    },
    onSuccess: (data) => {
      // Replace optimistic post with server data
      queryClient.setQueryData(['Posts'], (old) => 
        old.map(post => 
          post._id === data._id ? data : post
        )
      );
      toast.success('Post created successfully!');
      if (onPostSuccess) onPostSuccess();
      resetForm();
    },
    onSettled: () => {
      queryClient.invalidateQueries(['Posts']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bio.trim() && !image) {
      toast.warning('Please add content or image');
      return;
    }

    addPost({ bio, wages, pincode, noOfWorkers, address, image });
  };

  const resetForm = () => {
    setBio('');
    setImage(null);
    setPincode('');
    setWages('');
    setAddress('');
    setNoOfWorkers('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 border-zinc-800">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <FiUser className="text-gray-500" />
            </div>
          </div>
          
          <div className="flex-1">
            <textarea
              className="w-full my-2 border-none focus:ring-0 resize-none text-gray-900 placeholder-gray-500"
              rows="2"
              placeholder="Description about job"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />
            
            <div className="flex-1 my-1">
              <input 
                type="number" 
                placeholder='Wages' 
                className='text-black mr-2 w-30 border p-1 rounded'
                value={wages}
                onChange={(e) => setWages(e.target.value)}
                required
              />
              <input 
                type="number" 
                placeholder='No of workers' 
                className='text-black mx-3 w-30 border p-1 rounded'
                value={noOfWorkers}
                onChange={(e) => setNoOfWorkers(e.target.value)}
                required
              />
              <input 
                type="text" 
                placeholder='Pincode' 
                className='text-black ml-6 w-30 border p-1 rounded'
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
            
            <textarea
              className="w-full my-2 border-zinc-800 focus:ring-0 resize-none text-gray-900 placeholder-gray-500 border p-1 rounded"
              rows="2"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            
            {image && (
              <div className="relative mt-2">
                <img 
                  src={image} 
                  alt="Post preview" 
                  className="rounded-lg w-full max-h-64 object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-gray-800/80 text-white p-1 rounded-full hover:bg-gray-700/80"
                  onClick={() => setImage(null)}
                >
                  <FiX size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FiImage size={20} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </button>
              </div>
              <button
                type="submit"
                disabled={isPending || (!bio.trim() && !image)}
                className={`px-4 py-2 rounded-full text-white font-medium ${
                  (!bio.trim() && !image) || isPending
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isPending ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Addpost;
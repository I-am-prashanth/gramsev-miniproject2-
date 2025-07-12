import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditPost({ onClose, post, api }) {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({
    bio: post.bio,
    wages: post.wages,
    address: post.address,
    pincode: post.pincode,
    noOfWorkers: post.noOfWorkers,
    img: post.img
  });

  // Initialize form with post data
  useEffect(() => {
    setEditData({
      bio: post.bio,
      wages: post.wages,
      address: post.address,
      pincode: post.pincode,
      noOfWorkers: post.noOfWorkers,
      img: post.img
    });
  }, [post]);

  const { mutate: editPost, isPending: isUpdating } = useMutation({
  mutationFn: async (editData) => {
    const res = await fetch(`/api/contractor/updatepost/${post._id}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(editData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update post');
    }
    return await res.json();
  },
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['Posts', api]);
    
    const previousPosts = queryClient.getQueryData(['Posts', api]) || [];
    
    // Optimistic update
     
    queryClient.setQueryData(['Posts', api], previousPosts.map(p => 
      p._id === post._id ? { ...p, ...newData } : p
    ));

    return { previousPosts };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['Posts', api], context.previousPosts);
    toast.error(err.message);
  },
  onSuccess: (updatedPost) => {
    // Update with exact server response
    queryClient.setQueryData(['Posts', api], (oldPosts = []) => 
      oldPosts.map(p => 
        p._id === updatedPost._id ? updatedPost : p
      )
    );
    toast.success('Post updated successfully!');
  },
  onSettled: () => {
    // Final sync with server
    queryClient.invalidateQueries(['Posts', api]);
    onClose();
  }
});

  const handleSubmit = (e) => {
    e.preventDefault();
    editPost(editData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditData(prev => ({ ...prev, img: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-950/20 backdrop-blur-sm  opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-700 backdrop-blur-sm rounded-lg p-6 w-full max-w-md mr-70">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="3"
              value={editData.bio}
              onChange={(e) => setEditData({...editData, bio: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Wages (₹/day)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={editData.wages}
                onChange={(e) => setEditData({...editData, wages: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Workers Needed</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={editData.noOfWorkers}
                onChange={(e) => setEditData({...editData, noOfWorkers: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editData.address}
              onChange={(e) => setEditData({...editData, address: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={editData.pincode}
              onChange={(e) => setEditData({...editData, pincode: e.target.value})}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Update Image</label>
            <div className="flex items-center space-x-4">
              {editData.img && (
                <img 
                  src={editData.img} 
                  alt="Current" 
                  className="h-16 w-16 object-cover rounded"
                />
              )}
              <label className="flex flex-col items-center px-4 py-2 bg-gray-50 rounded-lg border border-dashed cursor-pointer">
                <span className="text-sm text-gray-500">
                  {editData.img ? 'Change image' : 'Upload image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
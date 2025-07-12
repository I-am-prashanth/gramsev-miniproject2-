import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    address: '',
    phoneNumber: '',
    profilePhoto: null,
    previewPhoto: ''
  });

  // Initialize form with user data
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, previewPhoto: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();
    // updateProfile(formData);
    console.log("clicked");
  };

  return (
    <div className="fixed inset-0 bg-blue-950/30 backdrop-blur-sm mr-70  opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md h-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative group mb-2">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
                <img 
                  src={formData.previewPhoto || '/default-profile.png'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all"
                onClick={() => fileInputRef.current.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">Click to change photo</p>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            //   disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            //   disabled={isPending}
            >
                SAVING
              {/* {isPending ? 'Saving...' : 'Save Changes'} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
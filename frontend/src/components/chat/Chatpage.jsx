import React, { useState } from 'react';
import Chat from './Chat';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

const Chatpage = () => {
  const [view, setView] = useState('list'); // 'list' or 'chat'
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [users,setusers] = useState([
    { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1', online: true },
    { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2', online: false },
    { id: 3, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3', online: true },
  ]);

  const {mutate:getUsers,isPending}=useMutation({
    mutationFn:async()=>{
        try{
            const res=await fetch(`/api/message/users`,{
                method:'GET',
                headers: {
          "Content-Type": "application/json"
            },
            })
            if(!res.ok){
                return null
            }
            const chat=await res.json();
            console.log(chat)
            setusers(chat);
            return chat
        
        
        
        }catch(error){
            console.log(error)
            throw error
        }
    }
  })

  useEffect(()=>{
    getUsers()
  },[])

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setView('chat');
    
    if (!messages[user.id]) {
      setMessages(prev => ({
        ...prev,
        [user.id]: [
          { text: `Hello! This is the start of your conversation with ${user.name}`, sender: 'system' }
        ]
      }));
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
    }));
    
    setMessage('');
  };

  return (
    <div className="fixed bottom-0 right-0 w-[30%] h-screen flex flex-col">
      {view === 'list' ? (
        <div className="bg-white rounded-t-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col h-full">
          <div className="bg-blue-500 text-white p-3">
            <h3 className="font-medium">Chats</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {users.map(user => (
              <div 
                key={user.username}
                onClick={() => handleUserClick(user)}
                className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500">
                    {user.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        selectedUser ? (
          <Chat 
            user={selectedUser}
            messages={messages[selectedUser._id] || []}
            onBack={() => setView('list')}
            
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <p>No user selected</p>
          </div>
        )
      )}
    </div>
  );

};

export default Chatpage;
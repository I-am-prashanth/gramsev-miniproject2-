import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiUser, FiChevronDown, FiSmile, FiPaperclip } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const Chat = (props) => {
  // const [isOpen, setIsOpen] = useState(true);
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot', time: '10:00 AM' },
    { id: 2, text: 'I have a question about my account', sender: 'user', time: '10:02 AM' },
    { id: 3, text: 'Sure! What would you like to know? I can help with account settings, billing, or general questions.', sender: 'bot', time: '10:02 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const authUser = queryClient.getQueryData(['authUser']);
  
  useEffect(() => {
    console.log(props.user)
    getchat();

  }, []);


  const {mutate:getchat,isPending}=useMutation({
    mutationFn: async () => { 
      
      try{
      const msg=await fetch(`/api/message/getmsg/${props.user._id}`,{
        method:'GET',
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      })
      const response=await msg.json();
      if(!msg.ok) {
      // const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update post');
    }
    console.log(response)
    setMessages(response)
    return response


      }catch(error){
        throw error
      }
    }
  })

  const {mutate:sendmessage,isPending:msgsending}=useMutation({
    mutationFn:async({newMessage})=>{
      try{
        const sendingmsg=await fetch(`/api/message/sendMsg/${props.user._id}`,{
          method:'POST',
          headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body:JSON.stringify({"text":newMessage})

        })
        if(!sendingmsg.ok) {
      // const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to update post');
      }
      const res=await sendingmsg.json();
      console.log(res)


      }catch(error){
        console.log(error);
        throw error
      }
    }

  })

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    sendmessage({newMessage});
    
    // Add user message
    const userMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, userMsg]);
    setNewMessage('');
    
    // Simulate bot response after 1 second
    // setTimeout(() => {
    //   const responses = [
    //     "Thanks for your message! Our team will get back to you shortly.",
    //     "I've noted your question. Is there anything else I can help with?",
    //     "That's a great question! Let me check that for you...",
    //     "I can help with that. Could you provide more details?",
    //     "We appreciate your patience. Our support team is reviewing your request."
    //   ];
    //   const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
    //   const botMsg = { 
    //     id: Date.now() + 1, 
    //     text: randomResponse, 
    //     sender: 'bot',
    //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //   };
    //   setMessages(prev => [...prev, botMsg]);
    // }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  return (
     /* Individual chat view */
        <div className="bg-gary-400 rounded-t-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col h-full">
          {/* Chat header */}
          <div className="bg-blue-500 text-red p-3 flex items-center shrink-0">
            <button 
              // onClick={() => {props.onClose()}}
             
              className="mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              > 
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex items-center">
              <img 
                // src={selectedUser.avatar || " "}
                src=" "
                // alt={selectedUser?.name || "anaonomus"}
                alt="unkonow"
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div>
                {/* <p className="font-medium">{selectedUser?.name || "unkonw"}</p> */}
                <p>unkown</p>
                {/* <p className="text-xs opacity-80">
                  {users.find(u => u.id === selectedUser.id)?.online ? 'Online' : 'Offline'}
                </p> */}
              </div>
            </div>
          </div>
         
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-500">
            {messages?.map((msg, id) => (
              <div 
                key={id} 
                className={`mb-3 ${msg.receiverId === authUser.user._id ? 'text-left' : 'text-right'}`}
              >
                <div 
                  className={`inline-block px-4 py-2 rounded-lg max-w-xs ${
                    msg.sender === 'me' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.timestamp && (
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Message input - Fixed at bottom */}
          <div className="p-3 border-t border-gray-700 bg-gray-600 shrink-0">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 border text-gray-900 border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-500  rounded-2xl text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
  );
};

export default Chat;
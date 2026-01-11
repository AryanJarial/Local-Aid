import { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get("/api/chat", config);
        setChats(data);
      } catch (error) {
        console.error("Failed to load chats");
      }
    };
    if (user) fetchChats();
  }, [user]);

  useEffect(() => {
    const startChat = async () => {
      if (location.state && location.state.userId) {
        if (hasFetchedRef.current) return; 
        hasFetchedRef.current = true;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post('/api/chat', { userId: location.state.userId }, config);
            
            setChats((prev) => {
                 if (!prev.find(c => c._id === data._id)) return [data, ...prev];
                 return prev;
            });
            setSelectedChat(data);
            window.history.replaceState({}, document.title);
        } catch (error) {
            console.error("Error creating chat:", error);
            hasFetchedRef.current = false;
        }
      }
    };
    if (user) startChat();
  }, [location.state, user]); 

  const getSenderInfo = (loggedUser, members) => {
    return members.find(m => m._id !== loggedUser._id) || members[0];
  };

  if (!user) return <p className="text-center mt-10">Please login to chat.</p>;

  return (
    <div className="container mx-auto mt-4 px-4 h-[calc(100vh-100px)]">
      <div className="flex h-full gap-4">
        
        <div className={`w-full md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                <h2 className="text-xl font-bold text-gray-800">My Chats</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                    <p className="p-4 text-gray-500 text-sm">No conversations yet.</p>
                ) : (
                    chats
                    .filter((chat, index, self) => 
                        index === self.findIndex((c) => (
                            getSenderInfo(user, c.members)._id === getSenderInfo(user, chat.members)._id
                        ))
                    )
                    .map((chat) => {
                        const otherUser = getSenderInfo(user, chat.members);
                        return (
                            <div 
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${selectedChat?._id === chat._id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
                            >
                                <img 
                                    src={otherUser?.profilePicture} 
                                    alt="User" 
                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">{otherUser?.name}</h4>
                                    {chat.latestMessage ? (
                                        <p className="text-xs text-gray-500 truncate">
                                            {chat.latestMessage.sender === user._id ? "You: " : ""}
                                            {chat.latestMessage.text || "Sent an image"}
                                        </p>
                                    ) : <p className="text-xs text-gray-400 italic">No messages yet</p>}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        <div className={`w-full md:w-2/3 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
            <ChatBox user={user} selectedChat={selectedChat} />
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPost, setTargetPost] = useState(null); // The post being completed
  const [chatContacts, setChatContacts] = useState([]); // People to choose from
  const [selectedHelper, setSelectedHelper] = useState("");

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        };
        const { data } = await axios.get('/api/posts/me', config);
        setMyPosts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/chat', config);
      
      // Extract the *other* person from each chat conversation
      const contacts = data.map(chat => {
        return chat.members.find(m => m._id !== user._id) || chat.members[0];
      });
      
      // Remove duplicates (unique users)
      const uniqueContacts = [...new Map(contacts.map(item => [item['_id'], item])).values()];
      
      setChatContacts(uniqueContacts);
    } catch (error) {
      console.error("Failed to load contacts", error);
    }
  };

  // 3. Handle Opening the Modal
  const openFulfillModal = (post) => {
    setTargetPost(post);
    setIsModalOpen(true);
    fetchContacts(); // Load the list of people
  };

  // 4. Handle Submitting the Completion
  const submitFulfillment = async () => {
    if (!selectedHelper) return alert("Please select who helped you!");

    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Call the API from Step 6.2
        const { data } = await axios.put(
            `/api/posts/${targetPost._id}/fulfill`, 
            { helperId: selectedHelper }, 
            config
        );

        // Update Local State (UI)
        const updatedPosts = myPosts.map((p) => 
            p._id === targetPost._id ? { ...p, status: 'fulfilled', fulfilledBy: selectedHelper } : p
        );
        setMyPosts(updatedPosts);
        
        // Close Modal
        setIsModalOpen(false);
        setTargetPost(null);
        setSelectedHelper("");
        alert("Post marked as completed! 10 Karma points awarded.");

    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/upload/profile', formData, config);
      
      const updatedUser = { ...user, profilePicture: data.imageUrl };
      updateUser(updatedUser); 
      
      setUploading(false);
      alert('Profile Picture Updated!');
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Image upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`/api/posts/${id}`, config);
        
        setMyPosts(myPosts.filter((post) => post._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Please login to view profile.</p>;
  }

  return (
    <div className="container mx-auto pt-32 px-4 pb-10 min-h-screen bg-gray-50">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar & Upload */}
            <div className="relative group">
                <img 
                    src={user.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-90 transition-opacity"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{uploading ? '...' : 'Change Photo'}</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*"/>
                </label>
            </div>

            <div className="text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-gray-800">{user.name}</h1>
                <p className="text-gray-500 font-medium">{user.email}</p>
                <div className="flex gap-2 justify-center md:justify-start mt-3">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wide">
                        {user.role}
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wide flex items-center gap-1">
                        ⭐ {user.karmaPoints} Karma
                    </span>
                </div>
            </div>
        </div>

        <button onClick={logout} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-6 py-3 rounded-xl transition-all border border-red-200 hover:shadow-md">
            Logout
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-blue-500">My Activity</h2>
      
      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>
      ) : myPosts.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">You haven't posted anything yet.</p>
            <Link to="/create-post" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all shadow-md hover:shadow-lg">
                Create First Post
            </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {myPosts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {post.status === 'fulfilled' ? (
                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-extrabold uppercase tracking-wide">✓ Completed</span>
                        ) : (
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-extrabold uppercase tracking-wide">Open</span>
                        )}

                        <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide ${
                            post.type === 'request' ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
                        }`}>
                            {post.type}
                        </span>
                        <span className="text-gray-400 text-xs font-medium">
                             {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
                </div>
                
                <div className="flex gap-3 self-end md:self-center">
                    {post.status === 'open' && (
                        <button 
                            onClick={() => openFulfillModal(post)}
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
                        >
                            Mark Complete
                        </button>
                    )}

                    <button 
                        onClick={() => handleDelete(post._id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Post"
                    >
                        🗑️
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">Who helped you?</h3>
                  <p className="text-sm text-gray-500 mb-6">Select the neighbor who helped with <strong>"{targetPost?.title}"</strong>. They'll get <span className="text-yellow-600 font-bold">+10 Karma</span>!</p>

                  <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-xl mb-6 custom-scrollbar bg-gray-50">
                      {chatContacts.length === 0 ? (
                          <div className="p-8 text-center">
                              <p className="text-gray-400 text-sm mb-2">No recent chats found.</p>
                              <p className="text-xs text-gray-400">You need to chat with someone before you can mark them as your helper.</p>
                          </div>
                      ) : (
                          chatContacts.map(contact => (
                              <div 
                                key={contact._id} 
                                onClick={() => setSelectedHelper(contact._id)}
                                className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
                                    selectedHelper === contact._id ? 'bg-blue-50' : 'hover:bg-white'
                                }`}
                              >
                                  <div className={`w-4 h-4 rounded-full mr-3 border-2 flex items-center justify-center ${
                                      selectedHelper === contact._id ? 'border-blue-500' : 'border-gray-300'
                                  }`}>
                                      {selectedHelper === contact._id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                  </div>
                                  <img src={contact.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm" alt="User"/>
                                  <span className={`font-semibold ${selectedHelper === contact._id ? 'text-blue-700' : 'text-gray-700'}`}>{contact.name}</span>
                              </div>
                          ))
                      )}
                  </div>

                  <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={submitFulfillment}
                        disabled={!selectedHelper}
                        className={`px-6 py-2.5 rounded-lg text-white font-bold shadow-md transition-all ${
                            !selectedHelper ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                      >
                          Award Karma ✨
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Profile;
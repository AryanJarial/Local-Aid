import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { io } from 'socket.io-client';

const ENDPOINT = "http://localhost:5000";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
    if (!user) return;

    const socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("notification", (data) => {
      // If the notification contains a new Karma score, update it globally
      if (data.newKarma !== undefined) {
        updateUser({ karmaPoints: data.newKarma });
        alert(data.message); // Optional: Show a popup
      }
    });

    return () => socket.disconnect();
  }, [user]);

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md z-50 relative">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">LocalAid</Link>
                <div className="flex items-center">
                    {user ? (
                        <>
                            <span className="hidden sm:inline bg-blue-700 px-3 py-1 rounded-full text-xs font-bold mr-4">
                                ⭐ {user.karmaPoints}
                            </span>
                            <Link
                                to="/create-post"
                                className="bg-green-500 hover:bg-green-600 px-3 py-1 sm:px-4 sm:py-2 rounded mr-4 font-bold text-sm"
                            >
                                + Create Post
                            </Link>

                            <Link to="/profile" className="flex items-center group">
                                <img 
                                    src={user.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt="User"
                                    className="w-8 h-8 rounded-full object-cover mr-2 border border-blue-300 group-hover:border-white"
                                />
                                <span className="font-semibold">{user.name}</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4 hover:underline">Login</Link>
                            <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
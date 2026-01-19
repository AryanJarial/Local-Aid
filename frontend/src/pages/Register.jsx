import { useState, useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(name, email, password);

    if (result.success) {
      navigate('/'); 
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="w-full h-screen grid md:grid-cols-2 overflow-hidden bg-white">
      
      {/* --- LEFT SIDE: FORM --- */}
      {/* Reduced padding (pt-24) to fit better while clearing Navbar */}
      <div className="flex flex-col justify-center px-8 md:px-12 pt-24 pb-4 h-full relative animate-fade-in-up">
        
        <div className="max-w-md mx-auto w-full">
            {/* Header (Compact) */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-6 bg-purple-600 rounded"></div>
                    <span className="font-bold text-gray-800 text-lg">LocalAid</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800">Join the Community</h2>
                <p className="text-gray-500 text-sm mt-1">Create your account to start helping neighbors.</p>
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded text-xs flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {error}
                </div>
            )}

            {/* FORM (Tighter spacing: space-y-4) */}
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Input */}
                <div>
                    <label className="block text-gray-600 font-bold mb-1 text-xs uppercase tracking-wide">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <User className="h-4 w-4 text-gray-400" />
                        </div>
                        {/* Reduced padding: p-3 */}
                        <input
                            type="text"
                            className="w-full pl-10 p-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-50 focus:outline-none transition-all text-sm font-medium text-gray-700 placeholder-gray-400"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <label className="block text-gray-600 font-bold mb-1 text-xs uppercase tracking-wide">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            className="w-full pl-10 p-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-50 focus:outline-none transition-all text-sm font-medium text-gray-700 placeholder-gray-400"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div>
                    <label className="block text-gray-600 font-bold mb-1 text-xs uppercase tracking-wide">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            className="w-full pl-10 p-3 border-2 border-gray-100 bg-gray-50 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-50 focus:outline-none transition-all text-sm font-medium text-gray-700 placeholder-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button (Compact padding) */}
                <button
                    type="submit"
                    className="w-full text-white py-3.5 rounded-xl font-bold text-sm transition-all transform flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/30 mt-2"
                >
                    Sign Up <ArrowRight className="w-4 h-4" />
                </button>

            </form>

            <div className="mt-6 text-center border-t border-gray-100 pt-4">
                <p className="text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 font-bold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: IMAGE --- */}
      <div className="hidden md:block relative h-full bg-gray-100">
           <img 
               src="/Register2.png" 
               alt="Community Join" 
               className="w-full h-full object-cover"
           />
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 pt-32 text-white">
                <div className="max-w-xl">
                    <div className="w-12 h-1 bg-purple-400 mb-4 rounded-full"></div>
                    <h3 className="text-3xl font-bold mb-2 leading-tight">Be the change.</h3>
                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                        "The best way to find yourself is to lose yourself in the service of others."
                    </p>
                </div>
           </div>
      </div>

    </div>
  );
};

export default Register;
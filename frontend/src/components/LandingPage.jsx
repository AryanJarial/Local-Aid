// frontend/src/components/LandingPage.jsx
import { Link } from 'react-router-dom';
import { MapPin, Heart, Shield, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      <div 
        className="relative text-white overflow-hidden bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
        style={{
            backgroundImage: "url('/hero-background3.png')"
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="container mx-auto px-6 py-24 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight drop-shadow-lg">
            Help Your Neighbors.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200 filter drop-shadow-lg">
              Heal Your Community.
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-50 max-w-3xl mx-auto font-medium drop-shadow-md">
            LocalAid connects you with people nearby who need help or are offering it. 
            Earn Karma, build trust, and make your neighborhood a better place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-full hover:bg-white/30 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 120" className="w-full h-auto text-white fill-current">
            <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,112C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How LocalAid Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We use geolocation to find the closest requests to you. No spam, just local people helping each other.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Location Based</h3>
            <p className="text-gray-600">
              See requests and offers within 5km of your current location. Help arrives faster when it's just around the corner.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-purple-50 border border-purple-100 hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Earn Good Karma</h3>
            <p className="text-gray-600">
              Every time you help someone, you earn Karma points. Build a reputation as a trusted community hero.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-teal-50 border border-teal-100 hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Verified & Safe</h3>
            <p className="text-gray-600">
              Chat safely with neighbors using our built-in messaging. No need to share personal phone numbers.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to join your community?</h2>
        <Link 
          to="/register" 
          className="inline-block px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Create Free Account
        </Link>
      </div>

    </div>
  );
};

export default LandingPage;
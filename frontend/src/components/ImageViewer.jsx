import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ImageViewer = ({ images, onClose }) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]); // Re-bind when index changes to keep closure fresh

  const next = (e) => {
    e?.stopPropagation();
    setLoading(true);
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e) => {
    e?.stopPropagation();
    setLoading(true);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn"
      onClick={onClose} // Close when clicking background
    >
      
      {/* --- Top Bar (Counter & Close) --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 text-white/80 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-sm font-medium">
            <ImageIcon className="w-4 h-4" />
            <span>{index + 1} / {images.length}</span>
        </div>

        <button 
          onClick={onClose} 
          className="group bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all border border-white/10 hover:rotate-90 duration-300"
        >
          <X className="w-6 h-6 text-white/90 group-hover:text-white" />
        </button>
      </div>

      {/* --- Navigation Buttons --- */}
      {images.length > 1 && (
        <>
          <button 
            onClick={prev} 
            className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110 z-50 group"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={next} 
            className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:scale-110 z-50 group"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* --- Main Image Area --- */}
      <div 
        className="relative max-w-[95vw] max-h-[85vh] p-2"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
      >
        {/* Loading Spinner */}
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        )}

        <img
          src={images[index]}
          alt={`View ${index + 1}`}
          onLoad={() => setLoading(false)}
          className={`max-h-[80vh] md:max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Thumbnail Strip (Optional - Visual Flair) */}
        {images.length > 1 && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto py-2 px-4 max-w-[90vw] no-scrollbar">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setIndex(i); setLoading(true); }}
                        className={`w-10 h-10 md:w-14 md:h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                            i === index ? 'border-white scale-110 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                        }`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default ImageViewer;
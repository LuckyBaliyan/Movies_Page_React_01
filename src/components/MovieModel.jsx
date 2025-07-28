import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MovieModel = ({ movie, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!movie) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#030014] bg-opacity-80 flex items-center justify-center w-screen h-screen"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="relative bg-[#030014] text-white w-full h-full md:w-4/5 md:h-4/5 flex flex-col md:flex-row rounded-none md:rounded-xl overflow-hidden shadow-lg"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl font-bold text-white hover:text-red-500 z-10 cursor-pointer"
          >
            &times;
          </button>

          {/* Left - Image */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.poster_url}`}
              alt={movie.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Right - Content */}
          <div className="p-6 md:p-10 w-full md:w-1/2 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
            <p className="text-gray-300">{movie.overview || "No description available."}</p>

            {movie.release_date && (
              <p className="mt-4 text-gray-400">
                <span className="font-semibold">Release Date:</span> {movie.release_date}
              </p>
            )}

            {movie.vote_average && (
              <p className="text-gray-400">
                <span className="font-semibold">Rating:</span> ⭐ {movie.vote_average}
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModel;


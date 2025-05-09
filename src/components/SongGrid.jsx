
import React from "react";
import { motion } from "framer-motion";
import SongCard from "@/components/SongCard"; // Ensure this path is correct
import { useData } from "@/context/DataContext"; // Import useData

const SongGrid = ({ songs, title }) => {
  const { addSongToCantoral, myCantoral } = useData(); // Get addSongToCantoral and myCantoral from context

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };

  const isSongInCantoral = (songId) => {
    return myCantoral.some(s => s.id === songId);
  };

  return (
    <div>
      {title && (
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6 text-primary"
        >
          {title}
        </motion.h2>
      )}
      
      {songs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <p>No se encontraron cantos que coincidan con tu búsqueda.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {songs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              onAddToCantoral={addSongToCantoral} // Pass addSongToCantoral
              isInCantoral={isSongInCantoral(song.id)} // Pass isInCantoral status
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SongGrid;

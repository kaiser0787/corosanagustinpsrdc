
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Eye } from "lucide-react"; // Changed icon
import { useData } from "@/context/DataContext";

const CategoryCard = ({ category }) => {
  const { id, name, description } = category;
  const { allSongs } = useData(); // Use allSongs from context
  
  const getSongCount = () => {
    return allSongs.filter(song => song.categoryId === id).length;
  };

  return (
    <Link to={`/buscar?categoria=${id}`}> {/* Link to search page filtered by category */}
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"}}
        className="relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg bg-card h-full flex flex-col"
      >
        <div className="absolute top-4 right-4 opacity-10">
          <Music className="h-16 w-16 text-primary" />
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-primary">{name}</h3>
        {description && <p className="text-foreground/70 mb-4 text-sm flex-grow">{description}</p>}
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <span className="text-sm text-primary font-medium">
            {getSongCount()} cantos
          </span>
          <span className="inline-flex items-center text-sm bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
            <Eye className="h-4 w-4 mr-1.5" />
            Ver Cantos
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;

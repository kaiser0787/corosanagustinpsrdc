
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SongGrid from "@/components/SongGrid";

const SearchPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Get query from URL
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = (query) => {
    setIsSearching(true);
    
    try {
      const songs = JSON.parse(localStorage.getItem("cantoralSongs") || "[]");
      const normalizedQuery = query.toLowerCase().trim();
      
      // Search in title, content and author
      const results = songs.filter(song => 
        song.title.toLowerCase().includes(normalizedQuery) ||
        (song.content && song.content.toLowerCase().includes(normalizedQuery)) ||
        (song.author && song.author.toLowerCase().includes(normalizedQuery))
      );
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching songs:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Update URL with search query
      const newUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
      
      performSearch(searchQuery);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold mb-6">Buscar cantos</h1>
        
        <form onSubmit={handleSearch} className="relative mb-8">
          <Input
            type="search"
            placeholder="Buscar por título, letra o autor..."
            className="w-full pl-4 pr-12 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 h-10"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Search className="h-4 w-4 mr-1" />
                <span>Buscar</span>
              </>
            )}
          </Button>
        </form>
        
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Resultados para "{searchQuery}"
            </h2>
            <p className="text-gray-600">
              {searchResults.length} {searchResults.length === 1 ? "canto encontrado" : "cantos encontrados"}
            </p>
          </div>
        )}
      </div>
      
      {isSearching ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <SongGrid songs={searchResults} />
      )}
    </motion.div>
  );
};

export default SearchPage;

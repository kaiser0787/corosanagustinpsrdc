
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { initialSongs, liturgicalCategories, liturgicalTimes } from '@/config/cantoralConfig';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState([]);
  const [myCantoral, setMyCantoral] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const initializeData = useCallback((toast) => {
    try {
      const storedAllSongs = localStorage.getItem('cantoralDigital_allSongs');
      const storedMyCantoral = localStorage.getItem('cantoralDigital_myCantoral');

      if (storedAllSongs) {
        setAllSongs(JSON.parse(storedAllSongs));
      } else {
        setAllSongs(initialSongs);
        localStorage.setItem('cantoralDigital_allSongs', JSON.stringify(initialSongs));
      }

      if (storedMyCantoral) {
        setMyCantoral(JSON.parse(storedMyCantoral));
      } else {
        localStorage.setItem('cantoralDigital_myCantoral', JSON.stringify([]));
      }
      
      if (!storedAllSongs && toast) {
         toast({
            title: "¡Bienvenido al Cantoral Digital!",
            description: "Hemos cargado algunos cantos de ejemplo.",
          });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing data:", error);
      if (toast) {
        toast({
          variant: "destructive",
          title: "Error de Inicialización",
          description: "No se pudieron cargar los datos. Se usarán valores por defecto.",
        });
      }
      // Fallback to defaults if local storage is corrupted
      setAllSongs(initialSongs);
      setMyCantoral([]);
      localStorage.setItem('cantoralDigital_allSongs', JSON.stringify(initialSongs));
      localStorage.setItem('cantoralDigital_myCantoral', JSON.stringify([]));
      setIsLoaded(true);
    }
  }, []);


  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem('cantoralDigital_allSongs', JSON.stringify(allSongs));
    }
  }, [allSongs, isLoaded]);

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem('cantoralDigital_myCantoral', JSON.stringify(myCantoral));
    }
  }, [myCantoral, isLoaded]);

  const addSongToAll = (song) => {
    const newSongWithId = { ...song, id: song.id || uuidv4() };
    setAllSongs(prev => [...prev, newSongWithId]);
  };

  const addSongToCantoral = (songData) => {
    // First, ensure this song exists in allSongs or add it
    let songToAdd = allSongs.find(s => s.id === songData.id);
    if (!songToAdd) {
        const newGlobalSong = { ...songData, id: songData.id || uuidv4() };
        addSongToAll(newGlobalSong); // This will update allSongs and trigger localStorage save
        songToAdd = newGlobalSong; // Use this newly created/added song
    }
    
    // Then add to myCantoral if not already there
    setMyCantoral(prev => {
      if (prev.find(s => s.id === songToAdd.id)) {
        return prev; // Already in cantoral
      }
      return [...prev, songToAdd];
    });
  };
  

  const removeSongFromCantoral = (songId) => {
    setMyCantoral(prev => prev.filter(song => song.id !== songId));
  };

  const updateSongInCantoral = (updatedSong) => {
    setMyCantoral(prev => prev.map(song => song.id === updatedSong.id ? updatedSong : song));
    // Also update in allSongs if it exists there (it should, as it's from MyCantoral)
    setAllSongs(prev => prev.map(song => song.id === updatedSong.id ? updatedSong : song));
  };

  const clearCantoral = () => {
    setMyCantoral([]);
  };

  return (
    <DataContext.Provider value={{ 
      allSongs, 
      myCantoral, setMyCantoral,
      isLoaded, initializeData,
      addSongToCantoral, 
      removeSongFromCantoral,
      updateSongInCantoral,
      clearCantoral,
      liturgicalCategories,
      liturgicalTimes
    }}>
      {children}
    </DataContext.Provider>
  );
};

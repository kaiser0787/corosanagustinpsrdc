
import React, { createContext, useState, useContext, useEffect } from 'react';
import { liturgicalTimes } from '@/config/cantoralConfig';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [liturgicalTime, setLiturgicalTime] = useState(() => {
    const savedTimeId = localStorage.getItem('liturgicalTimeId');
    return liturgicalTimes.find(t => t.id === savedTimeId) || liturgicalTimes.find(t => t.id === 'ordinario') || liturgicalTimes[0];
  });

  useEffect(() => {
    localStorage.setItem('liturgicalTimeId', liturgicalTime.id);
    document.body.setAttribute('data-theme', liturgicalTime.id);
    // Apply theme variables to root for Tailwind JIT
    const root = document.documentElement;
    root.style.setProperty('--primary-color-val', liturgicalTime.color || '#27AE60'); // Fallback color
  }, [liturgicalTime]);

  const setLiturgicalTimeById = (id) => {
    const newTime = liturgicalTimes.find(t => t.id === id);
    if (newTime) {
      setLiturgicalTime(newTime);
    }
  };

  return (
    <ThemeContext.Provider value={{ liturgicalTime, setLiturgicalTimeById, liturgicalTimes }}>
      {children}
    </ThemeContext.Provider>
  );
};

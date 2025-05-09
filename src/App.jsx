
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { DataProvider, useData } from "@/context/DataContext";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import MyCantoralPage from "@/pages/MyCantoralPage";
import SongSearchPage from "@/pages/SongSearchPage";
import NotFoundPage from "@/pages/NotFoundPage";

const AnimatedRoutes = () => {
  const location = useLocation();
  const { liturgicalTime } = useTheme();
  
  useEffect(() => {
    document.body.setAttribute('data-theme', liturgicalTime.id);
  }, [liturgicalTime]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/mi-cantoral" element={<MyCantoralPage />} />
        <Route path="/buscar" element={<SongSearchPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Cargando Cantoral Digital...</h2>
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  </div>
);

const AppLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <Header />
    <main className="flex-1 container mx-auto px-4 py-8">
      {children}
    </main>
    <Footer />
    <Toaster />
  </div>
);

const AppContent = () => {
  const { toast } = useToast();
  const { isLoaded, initializeData } = useData();

  useEffect(() => {
    initializeData(toast);
  }, [initializeData, toast]);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </Router>
  );
}

function App() {
  return (
    <DataProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;

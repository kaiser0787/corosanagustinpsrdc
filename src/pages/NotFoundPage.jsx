
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center min-h-[60vh]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <AlertTriangle className="h-32 w-32 text-secondary" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Error 404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">Página no encontrada</h2>
      
      <p className="text-foreground/80 max-w-md mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
        Verifica la URL o regresa al inicio.
      </p>
      
      <Link to="/">
        <Button size="lg" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Home className="h-5 w-5" />
          <span>Volver a la página de inicio</span>
        </Button>
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;

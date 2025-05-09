
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, PlusCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/use-toast";
import { liturgicalCategories, liturgicalTimes } from "@/config/cantoralConfig";


const SongCard = ({ song, onAddToCantoral, isInCantoral }) => {
  const { id, title, lyrics, categoryId, liturgicalTimeId } = song;
  const { toast } = useToast();
  
  const getCategoryName = () => liturgicalCategories.find(cat => cat.id === categoryId)?.name || "Desconocida";
  const getLiturgicalTimeName = () => liturgicalTimes.find(t => t.id === liturgicalTimeId)?.name || "Desconocido";

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCantoral(song);
    toast({
      title: "Canto Agregado",
      description: `"${title}" ha sido agregado a "Mi Cantoral".`
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="bg-card rounded-xl border p-6 shadow-sm flex flex-col h-full"
    >
      <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-1">Categoría: {getCategoryName()}</p>
      <p className="text-xs text-muted-foreground mb-3">Tiempo: {getLiturgicalTimeName()}</p>
      
      <div className="text-sm text-foreground/80 mb-4 flex-grow overflow-hidden">
        <pre className="whitespace-pre-wrap font-sans text-xs max-h-24 overflow-hidden">
          {lyrics.substring(0, 100)}{lyrics.length > 100 ? "..." : ""}
        </pre>
      </div>
      
      <div className="mt-auto pt-4 border-t border-border/50">
        {isInCantoral ? (
          <Button variant="outline" disabled className="w-full border-green-500 text-green-500">
            <FileText className="mr-2 h-4 w-4" /> En Mi Cantoral
          </Button>
        ) : (
           <Button onClick={handleAdd} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar al Cantoral
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SongCard;

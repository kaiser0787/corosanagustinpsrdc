
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useData } from "@/context/DataContext";
import { liturgicalTimes } from "@/config/cantoralConfig";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';


const SongForm = ({ categoryId, onSongAdded }) => {
  const [songTitle, setSongTitle] = useState("");
  const [songLyrics, setSongLyrics] = useState("");
  const [songLiturgicalTime, setSongLiturgicalTime] = useState(liturgicalTimes[0].id);
  const { toast } = useToast();
  const { addSongToCantoral } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!songTitle.trim() || !songLyrics.trim()) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor, ingrese el título y la letra del canto.",
      });
      return;
    }

    const newSong = {
      id: uuidv4(),
      title: songTitle.trim(),
      lyrics: songLyrics.trim(),
      categoryId: categoryId,
      liturgicalTimeId: songLiturgicalTime,
    };

    addSongToCantoral(newSong);

    toast({
      title: "Canto agregado",
      description: `"${newSong.title}" ha sido agregado a "Mi Cantoral".`,
    });

    setSongTitle("");
    setSongLyrics("");
    if (onSongAdded) onSongAdded(newSong); 
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-lg bg-card shadow"
    >
      <div>
        <Label htmlFor={`song-title-${categoryId}`}>Título del Canto</Label>
        <Input
          id={`song-title-${categoryId}`}
          type="text"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          placeholder="Ej: Pescador de Hombres"
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`song-lyrics-${categoryId}`}>Letra del Canto (con acordes si desea)</Label>
        <Textarea
          id={`song-lyrics-${categoryId}`}
          value={songLyrics}
          onChange={(e) => setSongLyrics(e.target.value)}
          placeholder="[Intro] G C D G..."
          rows={6}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`liturgical-time-${categoryId}`}>Tiempo Litúrgico</Label>
        <Select value={songLiturgicalTime} onValueChange={setSongLiturgicalTime}>
          <SelectTrigger id={`liturgical-time-${categoryId}`} className="w-full mt-1">
            <SelectValue placeholder="Seleccione un tiempo litúrgico" />
          </SelectTrigger>
          <SelectContent>
            {liturgicalTimes.map((time) => (
              <SelectItem key={time.id} value={time.id}>
                {time.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <PlusCircle className="mr-2 h-4 w-4" />
        Agregar al Cantoral
      </Button>
    </motion.form>
  );
};

export default SongForm;

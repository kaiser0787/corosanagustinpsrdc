
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Trash2, Edit3, Download, AlertTriangle, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import { liturgicalCategories, liturgicalTimes } from "@/config/cantoralConfig";
import { useToast } from "@/components/ui/use-toast";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { generateCantoralPdf } from "@/lib/pdfGenerator";

const EditSongDialog = ({ isOpen, onOpenChange, song, onSave }) => {
  const [editedTitle, setEditedTitle] = useState(song?.title || "");
  const [editedLyrics, setEditedLyrics] = useState(song?.lyrics || "");
  const [editedCategoryId, setEditedCategoryId] = useState(song?.categoryId || "");
  const [editedLiturgicalTimeId, setEditedLiturgicalTimeId] = useState(song?.liturgicalTimeId || "");
  const { toast } = useToast();

  React.useEffect(() => {
    if (song) {
      setEditedTitle(song.title);
      setEditedLyrics(song.lyrics);
      setEditedCategoryId(song.categoryId);
      setEditedLiturgicalTimeId(song.liturgicalTimeId);
    }
  }, [song]);

  const handleSave = () => {
    if (!editedTitle.trim() || !editedLyrics.trim()) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "El título y la letra no pueden estar vacíos.",
      });
      return;
    }
    onSave({
      ...song,
      title: editedTitle.trim(),
      lyrics: editedLyrics.trim(),
      categoryId: editedCategoryId,
      liturgicalTimeId: editedLiturgicalTimeId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Canto</DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu canto aquí. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Título
            </Label>
            <Input
              id="edit-title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-lyrics" className="text-right pt-2">
              Letra
            </Label>
            <Textarea
              id="edit-lyrics"
              value={editedLyrics}
              onChange={(e) => setEditedLyrics(e.target.value)}
              className="col-span-3 min-h-[120px]"
              rows={8}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">
              Categoría
            </Label>
            <Select value={editedCategoryId} onValueChange={setEditedCategoryId}>
              <SelectTrigger id="edit-category" className="col-span-3">
                <SelectValue placeholder="Seleccione categoría" />
              </SelectTrigger>
              <SelectContent>
                {liturgicalCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-liturgical-time" className="text-right">
              Tiempo Litúrgico
            </Label>
            <Select value={editedLiturgicalTimeId} onValueChange={setEditedLiturgicalTimeId}>
              <SelectTrigger id="edit-liturgical-time" className="col-span-3">
                <SelectValue placeholder="Seleccione tiempo" />
              </SelectTrigger>
              <SelectContent>
                {liturgicalTimes.map(time => (
                  <SelectItem key={time.id} value={time.id}>{time.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SongItem = ({ song, index, onEdit, onDelete }) => {
  const getCategoryName = (categoryId) => liturgicalCategories.find(cat => cat.id === categoryId)?.name || "Desconocida";
  const getLiturgicalTimeName = (timeId) => liturgicalTimes.find(t => t.id === timeId)?.name || "Desconocido";

  return (
    <Draggable draggableId={song.id} index={index}>
      {(provided) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-card rounded-lg shadow border flex flex-col sm:flex-row justify-between items-start gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div {...provided.dragHandleProps} className="cursor-grab pr-2 text-muted-foreground hover:text-primary">
                <GripVertical className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-primary">{song.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Categoría: {getCategoryName(song.categoryId)}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Tiempo Litúrgico: {getLiturgicalTimeName(song.liturgicalTimeId)}
            </p>
            <pre className="text-sm bg-background/50 p-3 rounded-md whitespace-pre-wrap font-mono song-content-display max-h-60 overflow-y-auto">
              {song.lyrics}
            </pre>
          </div>
          <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 shrink-0">
            <Button variant="outline" size="sm" onClick={() => onEdit(song)} className="border-primary text-primary hover:bg-primary/5">
              <Edit3 className="mr-1 h-4 w-4" /> Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive">
                  <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que quieres eliminar el canto "{song.title}"? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(song.id)}>
                    Sí, eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};


const MyCantoralPage = () => {
  const { myCantoral, setMyCantoral, removeSongFromCantoral, updateSongInCantoral, clearCantoral } = useData();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditingSong, setCurrentEditingSong] = useState(null);

  const handleEditSong = (song) => {
    setCurrentEditingSong(song);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedSong = (updatedSong) => {
    updateSongInCantoral(updatedSong);
    toast({ title: "Canto actualizado", description: `"${updatedSong.title}" ha sido modificado.` });
    setIsEditDialogOpen(false);
    setCurrentEditingSong(null);
  };

  const handleDeleteSong = (songId) => {
    const songToDelete = myCantoral.find(s => s.id === songId);
    removeSongFromCantoral(songId);
    if (songToDelete) {
      toast({ variant: "destructive", title: "Canto eliminado", description: `"${songToDelete.title}" ha sido eliminado.` });
    }
  };
  
  const handleDownloadPdf = () => {
    generateCantoralPdf(myCantoral, toast);
  };
  
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(myCantoral);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMyCantoral(items);
    toast({ title: "Cantoral Reordenado", description: "El orden de los cantos ha sido actualizado." });
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <FileText className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold">Mi Cantoral</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownloadPdf} disabled={myCantoral.length === 0} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={myCantoral.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Borrar Todo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción borrará todos los cantos de "Mi Cantoral". Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  clearCantoral();
                  toast({ title: "Cantoral Borrado", description: "Todos los cantos han sido eliminados." });
                }}>
                  Sí, borrar todo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {myCantoral.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-card rounded-xl shadow-sm border"
        >
          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Tu cantoral está vacío</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Añade cantos desde las categorías en la página de inicio para verlos aquí.
          </p>
          <Link to="/">
            <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              Añadir Cantos
            </Button>
          </Link>
        </motion.div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="songs">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {myCantoral.map((song, index) => (
                  <SongItem 
                    key={song.id} 
                    song={song} 
                    index={index} 
                    onEdit={handleEditSong}
                    onDelete={handleDeleteSong}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {currentEditingSong && (
        <EditSongDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          song={currentEditingSong}
          onSave={handleSaveEditedSong}
        />
      )}
    </motion.div>
  );
};

export default MyCantoralPage;

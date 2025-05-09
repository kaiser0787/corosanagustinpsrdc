
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, PlusCircle, FileText, Link as LinkIcon, ClipboardPaste } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/context/DataContext";
import { liturgicalCategories, liturgicalTimes } from "@/config/cantoralConfig";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';

const WebScrapeDialog = ({ isOpen, onOpenChange, onSongScraped }) => {
  const [webSearchUrl, setWebSearchUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedTitle, setScrapedTitle] = useState("");
  const [scrapedLyrics, setScrapedLyrics] = useState("");
  const [scrapedCategory, setScrapedCategory] = useState(liturgicalCategories[0].id);
  const [scrapedLiturgicalTime, setScrapedLiturgicalTime] = useState(liturgicalTimes[0].id);
  const { toast } = useToast();
  const { addSongToCantoral } = useData();

  const handlePasteFromWeb = async () => {
    if (!webSearchUrl.trim()) {
      toast({ variant: "destructive", title: "URL Vacía", description: "Por favor, ingrese una URL." });
      return;
    }
    setIsLoading(true);
    setScrapedTitle("");
    setScrapedLyrics("");

    toast({
      title: "Función no implementada",
      description: "La extracción de contenido web no está disponible en este entorno. Por favor, copie y pegue el título y la letra manualmente.",
      variant: "destructive"
    });
    
    setScrapedTitle("Título (copiar y pegar manualmente)");
    setScrapedLyrics("Letra (copiar y pegar manualmente)");
    setIsLoading(false);
  };

  const handleAddScrapedSong = () => {
    if (!scrapedTitle.trim() || !scrapedLyrics.trim()) {
      toast({ variant: "destructive", title: "Datos incompletos", description: "El título y la letra son requeridos."});
      return;
    }
    const newSong = {
      id: uuidv4(),
      title: scrapedTitle,
      lyrics: scrapedLyrics,
      categoryId: scrapedCategory,
      liturgicalTimeId: scrapedLiturgicalTime,
    };
    addSongToCantoral(newSong);
    toast({ title: "Canto Agregado", description: `"${newSong.title}" fue agregado a Mi Cantoral.` });
    onSongScraped(newSong);
    onOpenChange(false);
    setWebSearchUrl("");
    setScrapedTitle("");
    setScrapedLyrics("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Canto desde Web</DialogTitle>
          <DialogDescription>
            Pega la URL de una página con la letra del canto. Intentaremos extraerla.
            Si no funciona, por favor copia y pega manualmente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="web-url">URL del Canto</Label>
            <div className="flex gap-2">
              <Input
                id="web-url"
                placeholder="https://ejemplo.com/letra-canto"
                value={webSearchUrl}
                onChange={(e) => setWebSearchUrl(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handlePasteFromWeb} disabled={isLoading} variant="outline" size="icon">
                {isLoading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <ClipboardPaste className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          { (scrapedTitle || scrapedLyrics || isLoading) && (
            <>
              <div className="space-y-1">
                <Label htmlFor="scraped-title">Título</Label>
                <Input id="scraped-title" value={scrapedTitle} onChange={e => setScrapedTitle(e.target.value)} placeholder="Título del canto"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="scraped-lyrics">Letra</Label>
                <Textarea id="scraped-lyrics" value={scrapedLyrics} onChange={e => setScrapedLyrics(e.target.value)} placeholder="Letra del canto..." rows={6}/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="scraped-category">Categoría</Label>
                <Select value={scrapedCategory} onValueChange={setScrapedCategory}>
                  <SelectTrigger id="scraped-category"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {liturgicalCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="scraped-time">Tiempo Litúrgico</Label>
                <Select value={scrapedLiturgicalTime} onValueChange={setScrapedLiturgicalTime}>
                  <SelectTrigger id="scraped-time"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {liturgicalTimes.map(time => <SelectItem key={time.id} value={time.id}>{time.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleAddScrapedSong} disabled={!scrapedTitle && !scrapedLyrics}>Agregar al Cantoral</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const SongSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allSongs, addSongToCantoral, myCantoral } = useData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLiturgicalTime, setSelectedLiturgicalTime] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isWebScrapeDialogOpen, setIsWebScrapeDialogOpen] = useState(false);


  const getCategoryName = (categoryId) => liturgicalCategories.find(cat => cat.id === categoryId)?.name || "Desconocida";
  const getLiturgicalTimeName = (timeId) => liturgicalTimes.find(t => t.id === timeId)?.name || "Desconocido";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const time = params.get("tiempo") || "all";
    setSearchQuery(query);
    setSelectedLiturgicalTime(time);
    performSearch(query, time);
  }, [location.search, allSongs]);

  const performSearch = (query, timeFilter) => {
    setIsSearching(true);
    const normalizedQuery = query.toLowerCase().trim();

    const results = allSongs.filter(song => {
      const matchesQuery = song.title.toLowerCase().includes(normalizedQuery) ||
                           song.lyrics.toLowerCase().includes(normalizedQuery);
      const matchesTime = timeFilter === "all" || song.liturgicalTimeId === timeFilter;
      return matchesQuery && matchesTime;
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedLiturgicalTime !== "all") params.set("tiempo", selectedLiturgicalTime);
    navigate(`/buscar?${params.toString()}`);
  };

  const handleAddSongToCantoral = (song) => {
    addSongToCantoral(song);
    toast({
      title: "Canto Agregado",
      description: `"${song.title}" ha sido agregado a "Mi Cantoral".`
    });
  };
  
  const handleSongScraped = (newSong) => {
    performSearch(searchQuery, selectedLiturgicalTime); // Refresh search results
  };

  const isSongInCantoral = (songId) => {
    return myCantoral.some(s => s.id === songId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Buscar Cantos</h1>
          <Button onClick={() => setIsWebScrapeDialogOpen(true)} variant="outline" className="border-primary text-primary hover:bg-primary/5">
            <LinkIcon className="mr-2 h-4 w-4" />
            Importar Canto desde Web
          </Button>
        </div>
        <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4 p-6 bg-card rounded-lg shadow border">
          <div className="flex-grow">
            <label htmlFor="search-query" className="block text-sm font-medium text-foreground mb-1">
              Buscar por título o letra (en tu base de datos)
            </label>
            <Input
              id="search-query"
              type="search"
              placeholder="Ej: Aleluya, Cordero de Dios..."
              className="w-full text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:w-1/3">
            <label htmlFor="liturgical-time-filter" className="block text-sm font-medium text-foreground mb-1">
              Filtrar por Tiempo Litúrgico
            </label>
            <Select value={selectedLiturgicalTime} onValueChange={setSelectedLiturgicalTime}>
              <SelectTrigger id="liturgical-time-filter" className="w-full text-lg">
                <SelectValue placeholder="Todos los Tiempos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tiempos</SelectItem>
                {liturgicalTimes.map((time) => (
                  <SelectItem key={time.id} value={time.id}>
                    {time.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full md:w-auto text-lg bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSearching}>
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            Buscar en Mi Base
          </Button>
        </form>
      </div>

      <div>
        {searchQuery || selectedLiturgicalTime !== "all" ? (
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Resultados ({searchResults.length})
          </h2>
        ) : <h2 className="text-2xl font-semibold mb-4 text-foreground">Todos los Cantos en tu Base ({allSongs.length})</h2>
        }

        {isSearching ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : searchResults.length === 0 && (searchQuery || selectedLiturgicalTime !== "all") ? (
          <div className="text-center py-12 text-muted-foreground">
            No se encontraron cantos con los criterios actuales en tu base de datos.
          </div>
        ) : (
          <div className="space-y-4">
            {(searchResults.length > 0 || (searchQuery || selectedLiturgicalTime !== "all") ? searchResults : allSongs).map((song) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-card rounded-lg shadow border flex flex-col sm:flex-row justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary">{song.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Categoría: {getCategoryName(song.categoryId)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tiempo Litúrgico: {getLiturgicalTimeName(song.liturgicalTimeId)}
                  </p>
                  <pre className="text-sm bg-background/50 p-3 rounded-md whitespace-pre-wrap font-mono song-content-display max-h-40 overflow-y-auto">
                    {song.lyrics.substring(0, 200)}{song.lyrics.length > 200 ? "..." : ""}
                  </pre>
                </div>
                <div className="shrink-0 mt-4 sm:mt-0">
                  {isSongInCantoral(song.id) ? (
                     <Button variant="outline" disabled className="border-green-500 text-green-500">
                        <FileText className="mr-2 h-4 w-4" /> En Mi Cantoral
                      </Button>
                  ) : (
                    <Button onClick={() => handleAddSongToCantoral(song)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <PlusCircle className="mr-2 h-4 w-4" /> Agregar al Cantoral
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <WebScrapeDialog 
        isOpen={isWebScrapeDialogOpen} 
        onOpenChange={setIsWebScrapeDialogOpen}
        onSongScraped={handleSongScraped} 
      />
    </motion.div>
  );
};

export default SongSearchPage;


import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Music, Home, Menu, X, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { liturgicalTimes } from "@/config/cantoralConfig";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { liturgicalTime, setLiturgicalTimeById } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false); 
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); 
    }
  };

  const handleThemeChange = (value) => {
    setLiturgicalTimeById(value);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-card/80 backdrop-blur-md shadow-md border-b"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 200 }}
              className="hidden sm:block" 
            >
              <img  alt="Logo Coro San Agustín" className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow-sm" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/37a5f91c-45b6-444e-a01a-d7ddb6023748/94658333efeb1646ad43ecb8c5a9b1ef.png" />
            </motion.div>
             <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="sm:hidden"
            >
              <img alt="Logo Coro San Agustín" className="h-10 w-10 rounded-full object-cover" src="https://storage.googleapis.com/hostinger-horizons-assets-prod/37a5f91c-45b6-444e-a01a-d7ddb6023748/94658333efeb1646ad43ecb8c5a9b1ef.png" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-xl md:text-2xl font-bold gradient-text">
                Cantoral Digital
                <span className="block text-xs md:text-sm text-primary font-normal">Coro San Agustín</span>
              </h1>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-foreground hover:text-primary">
                <Home className="h-4 w-4" />
                <span>Inicio</span>
              </Button>
            </Link>
            <Link to="/mi-cantoral">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-foreground hover:text-primary">
                <FileText className="h-4 w-4" />
                <span>Mi Cantoral</span>
              </Button>
            </Link>
             <Select value={liturgicalTime.id} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[180px] h-9 text-foreground border-primary/50">
                <SelectValue placeholder="Tiempo Litúrgico" />
              </SelectTrigger>
              <SelectContent>
                {liturgicalTimes.map((time) => (
                  <SelectItem key={time.id} value={time.id}>
                    {time.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Buscar en mi base..."
                className="w-[200px] h-9 text-foreground placeholder:text-muted-foreground border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full px-3 text-primary hover:text-primary/80"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-card/95 backdrop-blur-sm border-b"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Buscar en mi base..."
                className="w-full text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full px-3 text-primary"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
             <Select value={liturgicalTime.id} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-full text-foreground">
                <SelectValue placeholder="Tiempo Litúrgico" />
              </SelectTrigger>
              <SelectContent>
                {liturgicalTimes.map((time) => (
                  <SelectItem key={time.id} value={time.id}>
                    {time.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full justify-start text-foreground border-primary/50">
                <Home className="h-4 w-4 mr-2" />
                <span>Inicio</span>
              </Button>
            </Link>
            <Link to="/mi-cantoral" className="w-full">
              <Button variant="outline" className="w-full justify-start text-foreground border-primary/50">
                <FileText className="h-4 w-4 mr-2" />
                <span>Mi Cantoral</span>
              </Button>
            </Link>
             <Link to="/buscar" className="w-full">
              <Button variant="outline" className="w-full justify-start text-foreground border-primary/50">
                <Search className="h-4 w-4 mr-2" />
                <span>Buscar / Importar</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;

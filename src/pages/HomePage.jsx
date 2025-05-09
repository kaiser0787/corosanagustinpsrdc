
import React, { useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, FileText, ChevronDown, ChevronUp, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useData } from "@/context/DataContext";
import { liturgicalCategories } from "@/config/cantoralConfig";
import { useTheme } from "@/context/ThemeContext";

const SongForm = lazy(() => import("@/components/SongForm"));

const HomePage = () => {
  const { myCantoral } = useData();
  const { liturgicalTime } = useTheme();
  const [openAccordionItems, setOpenAccordionItems] = useState([]);

  const toggleAccordionItem = (value) => {
    setOpenAccordionItems(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };
  
  const getCategoryColor = (categoryName) => {
    const category = liturgicalCategories.find(cat => cat.name === categoryName);
    return category ? category.color || liturgicalTime.color : liturgicalTime.color;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      <section className="py-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl shadow-lg">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="gradient-text">Cantoral Digital "Coro San Agustín"</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto px-4"
        >
          Organiza y accede a tus cantos litúrgicos de forma sencilla y adaptada a cada tiempo.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-x-4"
        >
          <Link to="/mi-cantoral">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <FileText className="mr-2 h-5 w-5" />
              Ir a Mi Cantoral ({myCantoral.length})
            </Button>
          </Link>
          <Link to="/buscar">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Music className="mr-2 h-5 w-5" />
              Buscar Cantos
            </Button>
          </Link>
        </motion.div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Categorías Litúrgicas</h2>
        <Accordion 
          type="multiple" 
          value={openAccordionItems}
          onValueChange={setOpenAccordionItems} 
          className="w-full space-y-2"
        >
          {liturgicalCategories.map((category) => (
            <AccordionItem value={category.id} key={category.id} className="border rounded-lg shadow-sm bg-card overflow-hidden">
              <AccordionTrigger 
                className="px-6 py-4 text-lg font-semibold hover:no-underline hover:bg-primary/5 transition-colors"
                style={{ borderLeft: `4px solid ${getCategoryColor(category.name)}`}}
              >
                <div className="flex items-center">
                  <PlusSquare className="mr-3 h-5 w-5 text-primary" />
                  {category.name}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-6">
                <p className="text-foreground/70 mb-4">{category.description}</p>
                <Suspense fallback={<div className="text-center py-4">Cargando formulario...</div>}>
                  <SongForm categoryId={category.id} />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </motion.div>
  );
};

export default HomePage;

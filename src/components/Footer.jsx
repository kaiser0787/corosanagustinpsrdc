
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary/10 text-primary-foreground py-8 border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Cantoral Digital "Coro San Agustín"</h3>
            <p className="text-foreground/80">
              Herramienta para la organización y visualización de cantos litúrgicos.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/mi-cantoral" className="text-foreground/80 hover:text-primary transition-colors">
                  Mi Cantoral
                </Link>
              </li>
              <li>
                <Link to="/buscar" className="text-foreground/80 hover:text-primary transition-colors">
                  Buscar Cantos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Con ❤️</h3>
            <p className="text-foreground/80 mb-4">
              Desarrollado para facilitar la alabanza y el servicio musical en la Iglesia.
            </p>
            <div className="flex items-center space-x-2 text-foreground/80">
              <span>Hecho con</span>
              <Heart className="h-5 w-5 text-red-500 fill-current" />
              <span>por Hostinger Horizons</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary/20 text-center text-foreground/70">
          <p>&copy; {new Date().getFullYear()} Cantoral Digital "Coro San Agustín". Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

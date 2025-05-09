
export const liturgicalCategories = [
  { id: "entrada", name: "Entrada", description: "Cantos para el inicio de la celebración.", color: "#4A90E2" },
  { id: "piedad", name: "Piedad", description: "Cantos para el acto penitencial (Señor, ten piedad).", color: "#7B68EE" },
  { id: "aspersion", name: "Aspersión", description: "Cantos para el rito de aspersión con agua bendita.", color: "#50E3C2" },
  { id: "gloria", name: "Gloria", description: "Cantos para el Gloria.", color: "#F8E71C" },
  { id: "aleluya", name: "Aleluya", description: "Cantos para el Aleluya antes del Evangelio.", color: "#F5A623" },
  { id: "ofertorio", name: "Ofertorio", description: "Cantos para la presentación de las ofrendas.", color: "#BD10E0" },
  { id: "santo", name: "Santo", description: "Cantos para el Santo.", color: "#D0021B" },
  { id: "cordero", name: "Cordero", description: "Cantos para el Cordero de Dios.", color: "#9013FE" },
  { id: "comunion", name: "Comunión", description: "Cantos para el momento de la Comunión.", color: "#417505" },
  { id: "salida", name: "Salida", description: "Cantos para finalizar la celebración.", color: "#B8E986" },
  { id: "animacion", name: "Animación", description: "Cantos para momentos de animación o especiales.", color: "#00A2FF" }
];

export const liturgicalTimes = [
  { id: "ordinario", name: "Tiempo Ordinario", color: "#27AE60" }, // Verde
  { id: "adviento", name: "Adviento", color: "#8E44AD" }, // Morado
  { id: "navidad", name: "Navidad", color: "#F1C40F" }, // Dorado/Blanco
  { id: "cuaresma", name: "Cuaresma", color: "#6A1B9A" }, // Morado más oscuro
  { id: "pascua", name: "Pascua", color: "#FFFFFF" }, // Blanco/Dorado brillante (usaremos un dorado claro para el tema)
  { id: "solemnidades", name: "Solemnidades y Fiestas", color: "#C0392B" } // Rojo (o blanco/dorado según la solemnidad)
];

export const initialSongs = [
  {
    id: "sample-1",
    title: "Entrada Festiva (Ejemplo)",
    lyrics: "[Intro]\nC G Am F\n\n[Verse 1]\nC         G\nCon alegría venimos,\nAm        F\nA tu casa, Señor,\nC         G\nCon cantos de gozo,\nF    G    C\nPara darte honor.",
    categoryId: "entrada",
    liturgicalTimeId: "ordinario",
  },
  {
    id: "sample-2",
    title: "Cordero de Dios (Ejemplo)",
    lyrics: "[Verse]\nD              A\nCordero de Dios,\nBm             F#m\nQue quitas el pecado del mundo,\nG         D     Em   A\nTen piedad de noso-tros.\n\n(Repetir 2 veces)\n\nD              A\nCordero de Dios,\nBm             F#m\nQue quitas el pecado del mundo,\nG      D  A   D\nDanos la pa-az.",
    categoryId: "cordero",
    liturgicalTimeId: "cuaresma",
  },
  {
    id: "sample-3",
    title: "Aleluya Pascual (Ejemplo)",
    lyrics: "[Chorus]\nG     D    Em   C\nAleluya, Aleluya,\nG          D      G\nCristo ha resucitado, Aleluya.",
    categoryId: "aleluya",
    liturgicalTimeId: "pascua",
  }
];

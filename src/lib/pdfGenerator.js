
import jsPDF from "jspdf";
import { liturgicalCategories, liturgicalTimes } from "@/config/cantoralConfig";

const getCategoryName = (categoryId) => liturgicalCategories.find(cat => cat.id === categoryId)?.name || "Desconocida";
const getLiturgicalTimeName = (timeId) => liturgicalTimes.find(t => t.id === timeId)?.name || "Desconocido";

export const generateCantoralPdf = (songs, toast) => {
  if (!songs || songs.length === 0) {
    toast({
      variant: "destructive",
      title: "Cantoral vacío",
      description: "No hay cantos para descargar.",
    });
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const usableWidth = pageWidth - 2 * margin;
  let yPos = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Cantoral Digital \"Coro San Agustín\"", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  songs.forEach((song, index) => {
    if (yPos > pageHeight - margin - 30) { 
      doc.addPage();
      yPos = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const titleLines = doc.splitTextToSize(`${index + 1}. ${song.title}`, usableWidth);
    doc.text(titleLines, margin, yPos);
    yPos += titleLines.length * 7; 

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const categoryText = `Categoría: ${getCategoryName(song.categoryId)}`;
    const timeText = `Tiempo: ${getLiturgicalTimeName(song.liturgicalTimeId)}`;
    doc.text(categoryText, margin, yPos);
    yPos += 5;
    doc.text(timeText, margin, yPos);
    yPos += 7;

    doc.setFont("courier", "normal"); 
    doc.setFontSize(10);
    const lyricsLines = doc.splitTextToSize(song.lyrics, usableWidth);

    lyricsLines.forEach(line => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 4.5; 
    });
    yPos += 10; 
  });

  doc.save("Cantoral_Digital_Coro_San_Agustin.pdf");
  toast({ title: "PDF Descargado", description: "El cantoral ha sido descargado como PDF." });
};

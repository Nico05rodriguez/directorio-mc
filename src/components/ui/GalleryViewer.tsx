"use client";

import { useState } from "react";
import Image from "next/image";

export const GalleryViewer = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* GRILLA DE FOTOS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((url, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedImage(url)}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-gray-100 group"
          >
            <Image 
              src={url} 
              alt={`Galería ${index}`} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            {/* Icono de Lupa al pasar el mouse */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-3xl transform scale-50 group-hover:scale-100 transition-all duration-300">🔍</span>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX (MODAL DE ZOOM) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          {/* Botón Cerrar */}
          <button className="absolute top-5 right-5 text-white/70 hover:text-white text-4xl font-bold z-50">
            &times;
          </button>
          
          <div className="relative w-full max-w-5xl h-[80vh] rounded-lg overflow-hidden shadow-2xl">
            <Image 
              src={selectedImage} 
              alt="Zoom" 
              fill 
              className="object-contain" 
            />
          </div>
        </div>
      )}
    </>
  );
};
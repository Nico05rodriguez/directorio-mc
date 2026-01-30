"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce"; // Necesitaremos instalar esto, o lo hacemos manual para no instalar nada.

// Haremos el debounce manual para no obligarte a instalar librerías extra
export const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Leemos la URL actual para mantener el estado si recargas
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [text, setText] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);

  // Categorías fijas (Mismas del registro)
  const categories = ["Alimentos", "Comercio", "Servicios", "Salud", "Automotriz"];

  // Efecto: Cuando cambia el texto o categoría, actualizamos la URL
  useEffect(() => {
    // Creamos un timer para no recargar en cada letra (Debounce de 500ms)
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (text) params.set("q", text);
      if (category) params.set("category", category);
      
      router.push(`/directorio?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [text, category, router]);

  return (
    <div className="space-y-6 mb-10">
      
      {/* 1. Buscador Principal */}
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="¿Qué estás buscando hoy? (Ej. Tacos, Dentista...)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-100 shadow-lg shadow-gray-200/50 text-lg outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all text-mc-dark"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
          🔍
        </span>
      </div>

      {/* 2. Filtros de Categoría */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            category === ""
              ? "bg-mc-dark text-white scale-105 shadow-md"
              : "bg-white text-gray-500 border border-gray-200 hover:border-mc-orange"
          }`}
        >
          Todas
        </button>
        
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === category ? "" : cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              category === cat
                ? "bg-mc-orange text-white scale-105 shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:border-mc-orange"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
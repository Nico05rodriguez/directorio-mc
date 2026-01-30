"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  // Estado inmediato (lo que ves al escribir)
  const [text, setText] = useState(initialQuery);
  // Estado para la URL (se actualiza solo al hacer clic o esperar)
  const [category, setCategory] = useState(initialCategory);
  
  // Estado "reposado" solo para el texto (para el debounce)
  const [debouncedText, setDebouncedText] = useState(initialQuery);

  const categories = ["Alimentos", "Comercio", "Servicios", "Salud", "Automotriz"];

  // EFECTO 1: El "Reloj" (Solo para el texto)
  // Espera 300ms después de que dejas de escribir para confirmar el texto
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 300); // 300ms es más ágil que 500ms

    return () => clearTimeout(timer);
  }, [text]);

  // EFECTO 2: El "Navegador" (Actualiza la URL)
  // Se dispara INMEDIATAMENTE si cambia la categoría, o cuando el texto "reposa"
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedText) params.set("q", debouncedText);
    if (category) params.set("category", category);
    
    router.push(`/directorio?${params.toString()}`);
  }, [debouncedText, category, router]);

  return (
    <div className="space-y-6 mb-10">
      
      {/* 1. Buscador Principal */}
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="¿Qué estás buscando hoy? (Ej. Tacos, Dentista...)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-100 shadow-lg shadow-gray-200/50 text-lg outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all text-mc-dark placeholder-gray-400"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none">
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
              : "bg-white text-gray-500 border border-gray-200 hover:border-mc-orange hover:text-mc-orange"
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
                : "bg-white text-gray-500 border border-gray-200 hover:border-mc-orange hover:text-mc-orange"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
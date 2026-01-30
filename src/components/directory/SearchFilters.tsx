"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// VERSIÓN CORREGIDA: Sin librerías externas para evitar errores de build
export const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estados locales para el texto y la categoría
  const [text, setText] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  
  // Estado para el texto "retrasado" (debounce manual)
  const [debouncedText, setDebouncedText] = useState(text);

  // EFECTO 1: Debounce manual (espera 500ms antes de actualizar la búsqueda)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 500);

    // Si el usuario sigue escribiendo, limpiamos el reloj anterior
    return () => {
      clearTimeout(timer);
    };
  }, [text]);

  // EFECTO 2: Actualizar la URL cuando cambian los filtros
  useEffect(() => {
    // Creamos una copia de los parámetros actuales
    const params = new URLSearchParams(searchParams.toString());
    
    // Actualizamos o borramos la búsqueda
    if (debouncedText) {
      params.set("q", debouncedText);
    } else {
      params.delete("q");
    }

    // Actualizamos o borramos la categoría
    if (category && category !== "Todas") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // Empujamos la nueva URL sin recargar la página
    router.push(`/directorio?${params.toString()}`);
  }, [debouncedText, category, router, searchParams]);

  const categories = ["Todas", "Alimentos", "Servicios", "Tecnología", "Salud", "Ropa", "Hogar", "Automotriz"];

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
      {/* Buscador de Texto */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="¿Qué buscas? (ej. tacos, dentista...)"
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mc-orange focus:border-transparent shadow-sm text-mc-dark placeholder-gray-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      {/* Selector de Categoría */}
      <div className="relative md:w-48">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full pl-4 pr-10 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mc-orange focus:border-transparent shadow-sm appearance-none bg-white cursor-pointer text-mc-dark"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
};
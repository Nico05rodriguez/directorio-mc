"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const [text, setText] = useState(initialQuery);
  const [debouncedText, setDebouncedText] = useState(initialQuery);

  // EFECTO: Detectar cambios en el input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 300);
    return () => clearTimeout(timer);
  }, [text]);

  // EFECTO: Actualizar URL cuando cambia el texto (Mantenemos la categoría si existe)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedText) {
      params.set("q", debouncedText);
    } else {
      params.delete("q");
    }
    
    // NOTA: Ya no manejamos la categoría aquí, lo hace el componente CategoryPills
    
    router.push(`/directorio?${params.toString()}`);
  }, [debouncedText, router, searchParams]);

  return (
    <div className="mb-6">
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="¿Qué estás buscando hoy?..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-100 shadow-lg shadow-gray-200/50 text-lg outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all text-mc-dark placeholder-gray-400"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none">
          🔍
        </span>
      </div>
      
      {/* ¡AQUÍ BORRAMOS LOS BOTONES VIEJOS! */}
    </div>
  );
};
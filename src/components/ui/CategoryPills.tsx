"use client";

import Link from "next/link";

// Lista de categorías con sus iconos (puedes agregar más)
const categories = [
  { name: "Alimentos", icon: "🍔", slug: "Alimentos" },
  { name: "Servicios", icon: "🔧", slug: "Servicios" },
  { name: "Salud", icon: "🩺", slug: "Salud" },
  { name: "Ropa", icon: "👕", slug: "Ropa" },
  { name: "Hogar", icon: "🏠", slug: "Hogar" },
  { name: "Tecnología", icon: "💻", slug: "Tecnología" },
  { name: "Automotriz", icon: "🚗", slug: "Automotriz" },
];

export const CategoryPills = () => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between px-6 mb-3 md:hidden">
        <h3 className="font-bold text-mc-dark text-sm">Categorías</h3>
        <span className="text-xs text-gray-400">Desliza →</span>
      </div>

      {/* Contenedor Scroll Horizontal (Oculto scrollbar) */}
      <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/directorio?category=${cat.slug}`}
            className="flex flex-col items-center gap-2 min-w-[70px] snap-center group"
          >
            {/* Círculo del icono */}
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all duration-300">
              {cat.icon}
            </div>
            
            {/* Texto */}
            <span className="text-xs font-medium text-gray-500 group-hover:text-mc-orange transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Para detectar cuál está activa

// --- ICONOS SVG ---
const Icons = {
  // CAMBIO: Icono de Hamburguesa real
  Burger: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 15h8"/><path d="M12 2a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4z"/></svg>,
  Service: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Health: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Clothes: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>,
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Tech: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>,
  Car: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h2"/><path d="M15 17h2"/></svg>,
};

const categories = [
  { name: "Alimentos", icon: Icons.Burger, slug: "Alimentos" },
  { name: "Servicios", icon: Icons.Service, slug: "Servicios" },
  { name: "Salud", icon: Icons.Health, slug: "Salud" },
  { name: "Ropa", icon: Icons.Clothes, slug: "Ropa" },
  { name: "Hogar", icon: Icons.Home, slug: "Hogar" },
  { name: "Tecnología", icon: Icons.Tech, slug: "Tecnología" },
  { name: "Automotriz", icon: Icons.Car, slug: "Automotriz" },
];

export const CategoryPills = () => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="w-full mb-8">
      {/* Scroll Horizontal */}
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x scrollbar-hide md:justify-center">
        
        {/* Opción "Todas" */}
        <Link
            href="/directorio"
            className="flex flex-col items-center gap-2 min-w-[70px] snap-center group"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-300 border ${
              !currentCategory 
                ? "bg-mc-dark text-white border-mc-dark scale-105" 
                : "bg-gray-50 text-gray-400 border-gray-100 group-hover:bg-gray-100"
            }`}>
              All
            </div>
            <span className={`text-xs font-medium transition-colors ${!currentCategory ? "text-mc-dark font-bold" : "text-gray-500"}`}>
              Todas
            </span>
        </Link>

        {categories.map((cat) => {
          const isActive = currentCategory === cat.slug;
          return (
            <Link
              key={cat.name}
              href={isActive ? "/directorio" : `/directorio?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 min-w-[70px] snap-center group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 border ${
                isActive 
                  ? "bg-orange-50 text-mc-orange border-mc-orange scale-105" 
                  : "bg-gray-50 text-gray-500 border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 group-hover:text-mc-orange"
              }`}>
                <cat.icon />
              </div>
              
              <span className={`text-xs font-medium transition-colors ${isActive ? "text-mc-orange font-bold" : "text-gray-500 group-hover:text-mc-orange"}`}>
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
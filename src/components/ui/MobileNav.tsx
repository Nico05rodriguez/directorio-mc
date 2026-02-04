"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNav = () => {
  const pathname = usePathname();

  // Función auxiliar para saber si el link está activo
  const isActive = (path: string) => pathname === path;

  // Clases base para los items
  const itemClass = "flex flex-col items-center justify-center w-full h-full space-y-1";
  const activeClass = "text-mc-orange font-bold";
  const inactiveClass = "text-gray-400 hover:text-gray-600 font-medium";

  return (
    // md:hidden ASEGURA que esto desaparezca en escritorio
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
      <div className="grid h-full grid-cols-3 mx-auto">
        
        {/* Botón 1: Inicio */}
        <Link href="/" className={`${itemClass} ${isActive("/") ? activeClass : inactiveClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isActive("/") ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[10px]">Inicio</span>
        </Link>

        {/* Botón 2: Directorio (Búsqueda) */}
        <Link href="/directorio" className={`${itemClass} ${isActive("/directorio") ? activeClass : inactiveClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive("/directorio") ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span className="text-[10px]">Buscar</span>
        </Link>

        {/* Botón 3: Registro / Perfil */}
        <Link href="/registro" className={`${itemClass} ${isActive("/registro") ? activeClass : inactiveClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isActive("/registro") ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="text-[10px]">Cuenta</span>
        </Link>

      </div>
    </div>
  );
};
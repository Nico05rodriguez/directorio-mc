"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileNav = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const itemClass = "flex flex-col items-center justify-center w-full h-full space-y-1";
  const activeClass = "text-mc-orange font-bold";
  const inactiveClass = "text-gray-400 hover:text-gray-600 font-medium";

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
      <div className="grid h-full grid-cols-3 mx-auto">
        
        {/* 1. Inicio */}
        <Link href="/" className={`${itemClass} ${isActive("/") ? activeClass : inactiveClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isActive("/") ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[10px]">Inicio</span>
        </Link>

        {/* 2. Buscar */}
        <Link href="/directorio" className={`${itemClass} ${isActive("/directorio") ? activeClass : inactiveClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive("/directorio") ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <span className="text-[10px]">Buscar</span>
        </Link>

        {/* 3. Registrar (CAMBIO APLICADO: Icono de 'Plus/Añadir' y texto claro) */}
        <Link href="/registro" className={`${itemClass} ${isActive("/registro") ? activeClass : inactiveClass}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <line x1="12" x2="12" y1="8" y2="16"/>
            <line x1="8" x2="16" y1="12" y2="12"/>
          </svg>
          <span className="text-[10px]">Registrar</span>
        </Link>

      </div>
    </div>
  );
};
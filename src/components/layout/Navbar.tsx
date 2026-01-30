"use client";

import Link from 'next/link';
import { useState } from 'react';

// Iconos SVG Vectoriales (Sin Emojis)
const Icons = {
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  )
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
        
        {/* 1. LOGO */}
        <Link 
          href="/" 
          onClick={() => setIsOpen(false)}
          className="text-2xl font-bold tracking-tight text-mc-dark hover:text-mc-orange transition-colors"
        >
          Directorio <span className="text-mc-orange">MC</span>
        </Link>

        {/* 2. MENÚ ESCRITORIO (Oculto en móvil) */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/directorio" 
            className="text-sm font-medium text-mc-dark/80 hover:text-mc-orange transition-colors"
          >
            Explorar Negocios
          </Link>
          <Link 
            href="/registro" 
            className="rounded-full bg-mc-orange px-5 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:scale-105 transition-all"
          >
            Registrar mi Negocio
          </Link>
        </div>

        {/* 3. BOTÓN MÓVIL (Hamburguesa) */}
        <button 
          className="md:hidden p-2 text-mc-dark hover:text-mc-orange transition-colors focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú"
        >
          {isOpen ? <Icons.Close /> : <Icons.Menu />}
        </button>

        {/* 4. MENÚ DESPLEGABLE MÓVIL (Fondo Sólido) */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-xl flex flex-col animate-in slide-in-from-top-5 md:hidden">
            
            <Link 
              href="/directorio" 
              onClick={() => setIsOpen(false)}
              className="px-6 py-4 text-lg font-medium text-mc-dark border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              Explorar Negocios
            </Link>

            <Link 
              href="/registro" 
              onClick={() => setIsOpen(false)}
              className="px-6 py-4 text-lg font-bold text-mc-orange border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              Registrar mi Negocio
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
};
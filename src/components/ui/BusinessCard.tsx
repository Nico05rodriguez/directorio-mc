import Link from "next/link";
import Image from "next/image";
import { Business } from "../../types";

// Iconos SVG internos para no depender de librerías externas
const Icons = {
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  ArrowRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
};

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <Link 
      href={`/negocio/${business.slug}`}
      className="group relative flex flex-col bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
    >
      
      {/* 1. PORTADA + LOGO */}
      <div className="relative h-40 w-full rounded-t-[1.5rem]"> 
        <div className="absolute inset-0 rounded-t-[1.5rem] overflow-hidden">
            {business.portada_url ? (
              <Image src={business.portada_url} alt={business.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300 text-4xl">🏪</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
        </div>

        {/* Logo Flotante */}
        <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-full border-4 border-white bg-white shadow-md z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
           {business.logo_url ? (
             <Image src={business.logo_url} alt="Logo" fill className="object-cover" />
           ) : (
             <span className="text-2xl font-bold text-gray-300">{business.nombre ? business.nombre.charAt(0) : "?"}</span>
           )}
        </div>

        {/* Badge Categoría */}
        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-mc-dark shadow-sm z-10 border border-white/50">
          {business.categoria || "General"}
        </span>
      </div>

      {/* 2. CONTENIDO */}
      <div className="p-5 pt-9 flex flex-col flex-grow">
        
        <div className="mb-2">
          <h3 className="text-lg font-bold text-mc-dark group-hover:text-mc-orange transition-colors line-clamp-1">
            {business.nombre}
          </h3>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow leading-relaxed">
          {business.descripcion || "Conoce nuestros productos y servicios..."}
        </p>

        {/* 3. FOOTER ARREGLADO (Botones estables) */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
          
          {/* Teléfono: Se encoge si falta espacio, texto truncado */}
          <div className="flex-1 min-w-0 bg-gray-50 border border-gray-100 text-gray-500 px-3 py-2 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-colors group-hover:bg-gray-100 group-hover:text-mc-dark">
             <Icons.Phone /> 
             <span className="truncate">{business.whatsapp}</span>
          </div>

          {/* Botón Acción: Tamaño fijo, no se rompe */}
          <div className="shrink-0 bg-mc-orange text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm shadow-orange-200 group-hover:bg-orange-600 transition-colors flex items-center gap-1 whitespace-nowrap">
            Ver Perfil <Icons.ArrowRight />
          </div>
          
        </div>

      </div>
    </Link>
  );
};
import Link from "next/link";
import Image from "next/image";
import { Business } from "../../types";

interface Props {
  business: Business;
}

export const BusinessCard = ({ business }: Props) => {
  return (
    <Link 
      href={`/negocio/${business.slug}`} 
      className="group block relative w-full bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50"
    >
      {/* 1. IMAGEN (La clave de lo inmersivo) */}
      <div className="relative w-full">
        {/* TRUCO VISUAL: 
           aspect-[4/3] en móvil (Foto alta, se ve enorme y bonito)
           md:aspect-video en PC (Formato cine, para que no quede gigante)
        */}
        <div className="aspect-[4/3] md:aspect-video relative overflow-hidden">
          <Image
            src={business.image || "/placeholder-business.jpg"} // Fallback por si no hay foto
            alt={business.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Degradado oscuro abajo para que el texto blanco se lea siempre (Estilo TikTok/Reels) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Badge de Categoría (Flotante) */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-mc-dark shadow-sm z-10">
          {business.category}
        </div>
        
        {/* Logo del negocio (Círculo flotante superpuesto) */}
        {business.logo_url && (
           <div className="absolute -bottom-6 left-4 md:left-6 w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white bg-white overflow-hidden shadow-md z-20">
             <Image 
               src={business.logo_url} 
               alt="Logo" 
               width={56} 
               height={56} 
               className="object-cover w-full h-full"
             />
           </div>
        )}
      </div>

      {/* 2. CONTENIDO (Debajo de la foto) */}
      <div className="pt-8 pb-5 px-5 md:px-6">
        <div className="flex flex-col gap-1">
          {/* Título y Verificado */}
          <div className="flex items-center gap-1">
            <h3 className="text-lg md:text-xl font-bold text-mc-dark leading-tight group-hover:text-mc-orange transition-colors">
              {business.name}
            </h3>
            {business.verified && (
              <span className="text-blue-500 text-sm" title="Verificado">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </span>
            )}
          </div>

          {/* Descripción corta */}
          <p className="text-sm text-gray-500 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {business.descripcion || "Descubre los productos y servicios que este negocio local tiene para ti."}
          </p>
        </div>

        {/* 3. BOTÓN DE ACCIÓN (Call to Action) */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
          {/* Teléfono (Solo visible si existe) */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
             {business.phone ? (
               <>
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                 {business.phone}
               </>
             ) : (
               <span>Ver detalles</span>
             )}
          </div>

          {/* Botón Píldora */}
          <span className="bg-orange-50 text-mc-orange px-4 py-2 rounded-full text-xs font-bold group-hover:bg-mc-orange group-hover:text-white transition-all flex items-center gap-1">
            Ver Perfil →
          </span>
        </div>
      </div>
    </Link>
  );
};
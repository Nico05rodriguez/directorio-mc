import Link from "next/link";
import Image from "next/image";
import { GlassCard } from "../../../components/ui/GlassCard";
import { GalleryViewer } from "../../../components/ui/GalleryViewer"; // Importamos el componente nuevo
import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getBusiness(slug: string) {
  const { data, error } = await supabase
    .from('negocios')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) notFound();

  // Convertimos el horario en una lista estructurada para el nuevo diseño
  const horarioLines = business.horario ? business.horario.split(', ') : [];

  return (
    <div className="py-10 animate-in fade-in duration-700 min-h-screen bg-gray-50/50">
      
      {/* Navegación */}
      <div className="max-w-7xl mx-auto mb-6 px-4">
        <Link 
          href="/directorio" 
          className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-mc-orange transition-colors"
        >
          ← Volver al directorio
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* HERO BANNER */}
          <div className="relative h-64 md:h-96 rounded-[2rem] overflow-hidden shadow-2xl group">
            {business.portada_url ? (
              <Image 
                src={business.portada_url} 
                alt="Portada" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-gray-200 to-gray-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full flex items-end gap-6">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-white p-1 shadow-xl flex-shrink-0 relative overflow-hidden border-4 border-white/20 backdrop-blur-sm">
                {business.logo_url ? (
                   <Image src={business.logo_url} alt="Logo" fill className="object-cover rounded-xl" />
                ) : (
                   <div className="h-full w-full bg-gray-100 flex items-center justify-center text-4xl">👤</div>
                )}
              </div>
              
              <div className="mb-2">
                <span className="bg-mc-orange text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-lg border border-orange-400">
                  {business.categoria}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white shadow-sm leading-tight">
                  {business.nombre}
                </h1>
              </div>
            </div>
          </div>

          {/* ATRIBUTOS (NUEVO COLOR ORANGE MC) */}
          <div className="flex flex-wrap gap-3">
            {business.tiene_local && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mc-orange text-white shadow-md shadow-orange-500/20 text-sm font-bold transition-transform hover:scale-105">
                <span>🏪</span> Tienda Física
              </div>
            )}
            {business.tiene_domicilio && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mc-orange text-white shadow-md shadow-orange-500/20 text-sm font-bold transition-transform hover:scale-105">
                <span>🛵</span> Servicio a Domicilio
              </div>
            )}
            {business.tiene_envios && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mc-orange text-white shadow-md shadow-orange-500/20 text-sm font-bold transition-transform hover:scale-105">
                <span>📍</span> Punto Medio / Acordado
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN */}
          <GlassCard className="bg-white border-none shadow-lg shadow-gray-200/50">
            <h2 className="text-xl font-bold text-mc-dark mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
              📝 Sobre nosotros
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
              {business.descripcion || "Sin descripción disponible."}
            </p>
          </GlassCard>

          {/* CATÁLOGO */}
          {business.servicios && business.servicios.length > 0 && (
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-mc-dark pl-3 border-l-4 border-mc-orange">
                 Menú / Catálogo
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {business.servicios.map((item: any, index: number) => (
                   <div key={index} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-100 transition-all group">
                     <div className="h-20 w-20 relative rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 group-hover:scale-105 transition-transform">
                       {item.imagen ? (
                         <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                       ) : (
                         <div className="h-full w-full flex items-center justify-center text-gray-300 text-2xl">★</div>
                       )}
                     </div>
                     <div className="flex-grow flex flex-col justify-center">
                       <div className="flex justify-between items-start">
                          <h3 className="font-bold text-mc-dark text-lg leading-tight">{item.nombre}</h3>
                          {item.precio && (
                            <span className="text-sm font-bold text-white bg-mc-orange px-2 py-1 rounded-lg ml-2 whitespace-nowrap shadow-sm">
                              {item.precio}
                            </span>
                          )}
                       </div>
                       {item.descripcion && (
                         <p className="text-sm text-gray-400 mt-1 line-clamp-2 leading-snug">
                           {item.descripcion}
                         </p>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

           {/* GALERÍA CON ZOOM (Integración del componente nuevo) */}
           {business.galeria_urls && business.galeria_urls.length > 0 && (
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-mc-dark pl-3 border-l-4 border-mc-orange">
                 Galería
               </h2>
               {/* Aquí usamos el componente cliente que creamos */}
               <GalleryViewer images={business.galeria_urls} />
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA (Sidebar) */}
        <div className="space-y-6">
          <GlassCard className="sticky top-24 bg-white border-none shadow-xl shadow-gray-200/50 rounded-[2rem]">
            
            {/* Botones de Acción */}
            <div className="flex flex-col gap-3 mb-8">
              <a 
                href={`https://wa.me/${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold py-4 px-4 rounded-xl text-center transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span className="text-2xl">💬</span> Contactar por WhatsApp
              </a>
              {business.mapa_link && (
                <a 
                  href={business.mapa_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-50 text-mc-dark font-bold py-3 px-4 rounded-xl text-center hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-gray-200"
                >
                  📍 Ver en Mapa
                </a>
              )}
            </div>

            {/* HORARIO (REDISEÑADO) */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2 ml-1">
                🕒 Horario de Atención
              </h3>
              
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                {horarioLines.length > 0 ? (
                  horarioLines.map((linea: string, i: number) => {
                    const [dia, horas] = linea.split(': ');
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-bold text-white bg-mc-dark px-2 py-1 rounded-md text-xs min-w-[3rem] text-center">
                          {dia}
                        </span>
                        <span className="font-medium text-gray-600">
                          {horas}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-400 italic text-center">No especificado</p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3 ml-1">
                📍 Dirección
              </h3>
              <p className="text-mc-dark font-medium leading-relaxed bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-sm">
                {business.direccion || "Solo servicio a domicilio o digital."}
              </p>
            </div>

          </GlassCard>
        </div>

      </div>
    </div>
  );
}
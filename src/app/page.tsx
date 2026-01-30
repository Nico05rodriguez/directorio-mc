import Link from "next/link";
import { GlassCard } from "../components/ui/GlassCard";
import { BusinessCard } from "../components/ui/BusinessCard";
import { HeroSlider } from "../components/ui/HeroSlider";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { supabase } from "../lib/supabase";
import { Business } from "../types";

export const revalidate = 60;

// --- ICONOS SVG (Para sustituir emojis) ---
const Icons = {
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Rocket: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  ArrowDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Handshake: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 2 0l.47-.28c2.63-1.57 2.3-4.34.15-6.1a5.5 5.5 0 0 0-7.52 0l-.61.61a2.82 2.82 0 0 1-4 0l-1.7-1.7a1 1 0 1 0-1.42 1.42l1.7 1.7a2.83 2.83 0 0 1 0 4l-5.27 5.27a2.5 2.5 0 0 0-.73 1.77c0 .66.26 1.3.73 1.77l2.83 2.83a2.5 2.5 0 0 0 1.77.73c.66 0 1.3-.26 1.77-.73l.67-.67"/></svg>
};

async function getRecientes() {
  const { data } = await supabase.from('negocios').select('*').eq('estado', 'aprobado').order('created_at', { ascending: false }).limit(3);
  if (!data) return [];
  
  // AQUÍ ESTABA EL ERROR: Faltaban campos obligatorios para TypeScript
  return data.map((item: any) => ({
    id: item.id,
    
    // Campos que ya tenías
    nombre: item.nombre, 
    categoria: item.categoria, 
    descripcion: item.descripcion, 
    whatsapp: item.whatsapp, 
    portada_url: item.portada_url, 
    logo_url: item.logo_url, 
    slug: item.slug, 
    verified: item.verificado,
    name: item.nombre, 
    category: item.categoria, 
    image: item.portada_url, 
    phone: item.telefono || "",

    // --- AGREGAMOS LOS FALTANTES (REQUERIDOS POR EL TIPO BUSINESS) ---
    telefono: item.telefono || "",
    direccion: item.direccion || "",
    mapa_link: item.mapa_link || "",
    horario: item.horario || "",
    sitio_web: item.sitio_web || "",
    email: item.email || "",
    instagram: item.instagram || "",
    facebook: item.facebook || ""

  })) as unknown as Business[]; // <--- EL TRUCO QUE SOLUCIONA TODO
}

export default async function Home() {
  const recientes = await getRecientes();

  // Estilo "Solid Liquid" para móviles
  const mobileBtnBase = "flex-1 text-center py-3.5 px-6 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/40 shadow-xl";
  const darkBtn = `${mobileBtnBase} bg-gradient-to-br from-gray-800 to-black text-white shadow-gray-400/30`;
  const orangeBtn = `${mobileBtnBase} bg-gradient-to-br from-mc-orange to-orange-600 text-white shadow-orange-200`;

  return (
    <div className="flex flex-col gap-12 md:gap-16 bg-white min-h-screen m-3 md:m-6 rounded-[2.5rem] shadow-xl shadow-gray-200/40 overflow-hidden p-6 md:p-10 lg:p-12 pb-16">
      
      <ScrollToTop />

      {/* 1. SECCIÓN HERO */}
      <section className="flex flex-col items-center animate-in fade-in zoom-in duration-700 pt-2">
        
        <HeroSlider />

        {/* BOTONES MÓVIL (Estilo Liquid Sólido) */}
        <div className="flex lg:hidden flex-wrap justify-center gap-4 w-full mt-6 max-w-xl">
          <Link href="/directorio" className={darkBtn}>
            <Icons.Search /> Explorar
          </Link>
          <Link href="/registro" className={orangeBtn}>
            <Icons.Rocket /> Registrar
          </Link>
        </div>
        
        <div className="lg:hidden mt-6 mb-2">
           <a href="#conocer-mas" className="text-gray-400 text-sm font-bold border-b border-gray-200 pb-1 hover:text-mc-orange transition-colors flex items-center gap-1">
             Conocer más <Icons.ArrowDown />
           </a>
        </div>

      </section>

      {/* 2. NUEVOS INGRESOS (Sin emoji en título) */}
      {recientes.length > 0 && (
        <section className="p-6 md:p-8 bg-gray-50/80 border border-gray-100 rounded-[2rem]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl md:text-3xl font-bold text-mc-dark tracking-tight">Nuevos Ingresos</h2>
              
              {/* CAMBIO APLICADO: Botón 'Ver todos' mejorado estilo Píldora */}
              <Link 
                href="/directorio" 
                className="group flex items-center gap-1 text-xs md:text-sm font-bold text-mc-orange bg-orange-50 hover:bg-mc-orange hover:text-white px-4 py-2 rounded-full transition-all duration-300 shadow-sm"
              >
                Ver todos
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recientes.map((negocio) => (<BusinessCard key={negocio.id} business={negocio} />))}
            </div>
          </div>
        </section>
      )}

      {/* 3. INFO (Conocer más) - ICONOS SVG */}
      <section id="conocer-mas" className="scroll-mt-32 pt-4 px-2">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-mc-dark mb-6 tracking-tight">¿Qué es Directorio MC?</h2>
          <p className="text-lg text-gray-500 leading-relaxed mx-auto">
            Un espacio moderno diseñado para conectar a los ciudadanos con los negocios locales.
            Fomentamos el consumo local para fortalecer la economía.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <GlassCard className="bg-orange-50/40 border-orange-100/50 shadow-sm hover:shadow-md p-8 group">
            <div className="h-14 w-14 rounded-2xl bg-white text-mc-orange flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
               <Icons.MapPin />
            </div>
            <h3 className="text-xl font-bold text-mc-dark mb-3">Encuentra Cerca</h3>
            <p className="text-base text-gray-500 leading-relaxed">Ubica rápidamente comercios y servicios en tu zona.</p>
          </GlassCard>

          <GlassCard className="bg-blue-50/40 border-blue-100/50 shadow-sm hover:shadow-md p-8 group">
            <div className="h-14 w-14 rounded-2xl bg-white text-blue-500 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
               <Icons.Rocket />
            </div>
            <h3 className="text-xl font-bold text-mc-dark mb-3">Impulso Digital</h3>
            <p className="text-base text-gray-500 leading-relaxed">Visibilidad profesional con perfil, fotos y WhatsApp.</p>
          </GlassCard>

          <GlassCard className="bg-green-50/40 border-green-100/50 shadow-sm hover:shadow-md p-8 group">
            <div className="h-14 w-14 rounded-2xl bg-white text-green-500 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
               <Icons.Handshake />
            </div>
            <h3 className="text-xl font-bold text-mc-dark mb-3">Comunidad</h3>
            <p className="text-base text-gray-500 leading-relaxed">Conectamos vecinos con emprendedores locales.</p>
          </GlassCard>

        </div>
      </section>
    </div>
  );
}
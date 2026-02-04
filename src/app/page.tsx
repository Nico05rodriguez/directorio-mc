import Link from "next/link";
import { GlassCard } from "../components/ui/GlassCard";
import { BusinessCard } from "../components/ui/BusinessCard";
import { HeroSlider } from "../components/ui/HeroSlider";
import { ScrollToTop } from "../components/ui/ScrollToTop";
import { supabase } from "../lib/supabase";
import { Business } from "../types";
import { CategoryPills } from "../components/ui/CategoryPills"; // Importación correcta

export const revalidate = 60;

// --- ICONOS SVG ---
const Icons = {
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Rocket: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  ArrowDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Handshake: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 2 0l.47-.28c2.63-1.57 2.3-4.34.15-6.1a5.5 5.5 0 0 0-7.52 0l-.61.61a2.82 2.82 0 0 1-4 0l-1.7-1.7a1 1 0 1 0-1.42 1.42l1.7 1.7a2.83 2.83 0 0 1 0 4l-5.27 5.27a2.5 2.5 0 0 0-.73 1.77c0 .66.26 1.3.73 1.77l2.83 2.83a2.5 2.5 0 0 0 1.77.73c.66 0 1.3-.26 1.77-.73l.67-.67"/></svg>
};

async function getRecientes() {
  const { data } = await supabase.from('negocios').select('*').eq('estado', 'aprobado').order('created_at', { ascending: false }).limit(5);
  if (!data) return [];
  
  return data.map((item: any) => ({
    id: item.id,
    nombre: item.nombre, categoria: item.categoria, descripcion: item.descripcion, whatsapp: item.whatsapp, portada_url: item.portada_url, logo_url: item.logo_url, slug: item.slug, verified: item.verificado,
    name: item.nombre, category: item.categoria, image: item.portada_url, phone: item.telefono || "",
    telefono: item.telefono || "", direccion: item.direccion || "", mapa_link: item.mapa_link || "", horario: item.horario || "", sitio_web: item.sitio_web || "", email: item.email || "", instagram: item.instagram || "", facebook: item.facebook || ""
  })) as unknown as Business[];
}

export default async function Home() {
  const recientes = await getRecientes();

  const mobileBtnBase = "flex-1 text-center py-3.5 px-6 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/40 shadow-xl";
  const darkBtn = `${mobileBtnBase} bg-gradient-to-br from-gray-800 to-black text-white shadow-gray-400/30`;
  const orangeBtn = `${mobileBtnBase} bg-gradient-to-br from-mc-orange to-orange-600 text-white shadow-orange-200`;

  return (
    <div className="flex flex-col gap-8 md:gap-16 bg-white min-h-screen md:m-6 md:rounded-[2.5rem] shadow-xl shadow-gray-200/40 overflow-hidden pt-6 md:p-10 lg:p-12 pb-24">
      
      <ScrollToTop />

      {/* 1. SECCIÓN HERO */}
      <section className="flex flex-col items-center animate-in fade-in zoom-in duration-700 pt-2 px-6 md:px-0">
        <HeroSlider />

        {/* Botones de Acción (Solo móvil) */}
        <div className="flex lg:hidden flex-wrap justify-center gap-4 w-full mt-6 mb-8 max-w-xl">
          <Link href="/directorio" className={darkBtn}>
            <Icons.Search /> Explorar
          </Link>
          <Link href="/registro" className={orangeBtn}>
            <Icons.Rocket /> Registrar
          </Link>
        </div>
      </section>

      {/* --- AQUÍ ESTÁ EL CAMBIO: BURBUJAS DE CATEGORÍAS --- */}
      {/* Solo visible en móvil (md:hidden) */}
      <div className="md:hidden">
        <CategoryPills />
      </div>

      {/* 2. NUEVOS INGRESOS */}
      {recientes.length > 0 && (
        <section className="py-4 md:p-8 bg-gray-50/80 border-y md:border border-gray-100 md:rounded-[2rem]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 px-6 md:px-2">
              <h2 className="text-xl md:text-3xl font-bold text-mc-dark tracking-tight">Nuevos Ingresos</h2>
              <Link href="/directorio" className="text-xs font-bold text-mc-orange bg-orange-50 px-3 py-1.5 rounded-full">
                Ver todos
              </Link>
            </div>
            
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none px-6 md:px-0 scrollbar-hide">
              {recientes.map((negocio) => (
                <div key={negocio.id} className="min-w-[85%] md:min-w-0 snap-center shrink-0 first:pl-0 last:pr-6 md:last:pr-0">
                   <BusinessCard business={negocio} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. INFO */}
      <section className="px-6 md:px-2 pb-10">
        <div className="max-w-3xl mx-auto text-center mb-10 mt-8">
          <h2 className="text-2xl md:text-4xl font-bold text-mc-dark mb-4 tracking-tight">Directorio MC</h2>
          <p className="text-sm md:text-lg text-gray-500 leading-relaxed mx-auto">
            Conectamos vecinos con emprendedores locales.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
          <GlassCard className="bg-orange-50/40 border-orange-100/50 shadow-sm p-6 flex flex-row md:flex-col items-center gap-4">
            <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-white text-mc-orange flex items-center justify-center shadow-sm shrink-0">
               <Icons.MapPin />
            </div>
            <div className="text-left md:text-center">
               <h3 className="text-base font-bold text-mc-dark">Cerca de ti</h3>
               <p className="text-xs text-gray-500">Comercios en tu zona.</p>
            </div>
          </GlassCard>

          <GlassCard className="bg-blue-50/40 border-blue-100/50 shadow-sm p-6 flex flex-row md:flex-col items-center gap-4">
            <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-white text-blue-500 flex items-center justify-center shadow-sm shrink-0">
               <Icons.Rocket />
            </div>
            <div className="text-left md:text-center">
               <h3 className="text-base font-bold text-mc-dark">Digital</h3>
               <p className="text-xs text-gray-500">Tu negocio online.</p>
            </div>
          </GlassCard>

          <GlassCard className="bg-green-50/40 border-green-100/50 shadow-sm p-6 flex flex-row md:flex-col items-center gap-4">
            <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-white text-green-500 flex items-center justify-center shadow-sm shrink-0">
               <Icons.Handshake />
            </div>
            <div className="text-left md:text-center">
               <h3 className="text-base font-bold text-mc-dark">Comunidad</h3>
               <p className="text-xs text-gray-500">Apoyo local real.</p>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
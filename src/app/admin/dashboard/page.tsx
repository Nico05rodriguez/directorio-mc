"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// AGREGADO: Importamos Link para la navegación
import Link from "next/link"; 
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

// --- ICONOS SVG ---
const Icons = {
  Grid: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  List: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Pause: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
};

type TabEstado = 'pendiente' | 'aprobado' | 'pausado' | 'rechazado';

// --- COMPONENTE DE BOTÓN RESPONSIVO ---
const ActionButton = ({ icon: Icon, label, onClick, bgColor, hoverColor, textColor = "text-white", shadowColor }: any) => (
  <button
    onClick={onClick}
    className={`${bgColor} ${hoverColor} ${textColor} flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-md ${shadowColor} active:scale-95 md:w-auto md:h-auto md:px-4 md:py-2`}
    title={label}
  >
    <Icon />
    <span className="hidden md:inline-block ml-2 text-sm font-bold">{label}</span>
  </button>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [negocios, setNegocios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentTab, setCurrentTab] = useState<TabEstado>('pendiente');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/admin");
      else fetchNegocios();
    };
    checkSession();
  }, [router]);

  const fetchNegocios = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("negocios")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setNegocios(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, nuevoEstado: string, confirmarMsg: string) => {
    if (!confirm(confirmarMsg)) return;
    const { error } = await supabase.from("negocios").update({ estado: nuevoEstado, verificado: nuevoEstado === 'aprobado' }).eq("id", id);
    if (!error) fetchNegocios(); else alert("Error al actualizar");
  };

  const handleApprove = (id: string) => updateStatus(id, 'aprobado', "¿Aprobar y publicar?");
  const handlePause = (id: string) => updateStatus(id, 'pausado', "¿Pausar este negocio?");
  const handleReactivate = (id: string) => updateStatus(id, 'aprobado', "¿Reactivar negocio?");
  const handleReject = (id: string) => updateStatus(id, 'rechazado', "¿Marcar como RECHAZADO?");
  const handleDelete = async (id: string) => { if (!confirm("⚠️ ¿BORRAR DEFINITIVAMENTE?")) return; const { error } = await supabase.from("negocios").delete().eq("id", id); if (!error) fetchNegocios(); };
  const handleEdit = (id: string) => { router.push(`/admin/editar/${id}`); };

  const filteredNegocios = negocios.filter(n => n.estado === currentTab);

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-mc-dark">Panel de Control</h1>
          <p className="text-gray-500 text-sm">Gestión centralizada del directorio.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* BOTÓN NUEVO: IR AL GESTOR DEL SLIDER */}
          <Link href="/admin/slider">
             <button className="flex items-center gap-2 bg-mc-dark text-white px-4 py-2 rounded-full border border-gray-800 hover:bg-black font-bold text-xs transition-colors shadow-sm">
                🖼️ <span className="hidden sm:inline">Portada</span>
             </button>
          </Link>

          <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 shadow-sm">
            Total: {negocios.length}
          </span>
          
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/admin"); }} className="flex items-center gap-2 bg-white text-red-500 px-4 py-2 rounded-full border border-red-100 hover:bg-red-50 font-bold text-xs transition-colors shadow-sm">
            <Icons.Logout />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0"><div className="flex gap-1 min-w-max">{(['pendiente', 'aprobado', 'pausado', 'rechazado'] as TabEstado[]).map((tab) => (<button key={tab} onClick={() => setCurrentTab(tab)} className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-bold capitalize transition-all flex items-center gap-2 ${currentTab === tab ? 'bg-mc-dark text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>{tab}s <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${currentTab === tab ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>{negocios.filter(n => n.estado === tab).length}</span></button>))}</div></div>
          <div className="flex bg-gray-100/80 p-1 rounded-full flex-shrink-0"><button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-mc-orange' : 'text-gray-400'}`}><Icons.Grid /></button><button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-mc-orange' : 'text-gray-400'}`}><Icons.List /></button></div>
        </div>

        {filteredNegocios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"><div className="text-4xl mb-3 opacity-20">📂</div><p className="text-gray-400 italic text-sm">No hay negocios en esta sección.</p></div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "flex flex-col gap-3"}>
            {filteredNegocios.map((negocio) => (
              <div key={negocio.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex group ${viewMode === 'grid' ? 'flex-col' : 'flex-col md:flex-row md:items-center p-3 gap-4'}`}>
                
                {/* IMAGEN / LOGO */}
                <div className={`relative ${viewMode === 'grid' ? 'h-40 bg-gray-100' : 'h-16 w-full md:w-20 rounded-xl flex-shrink-0 bg-gray-100'}`}>
                   {negocio.portada_url && viewMode === 'grid' && <Image src={negocio.portada_url} alt="Cover" fill className="object-cover opacity-90" />}
                   
                   <div className={`absolute bg-white p-1 shadow-md border border-gray-100 overflow-hidden transition-all
                     ${viewMode === 'grid' 
                       ? '-bottom-6 left-6 w-20 h-20 rounded-full'  
                       : 'inset-0 w-full h-full rounded-xl'
                     }`}>
                     {negocio.logo_url ? (
                       <div className={`relative w-full h-full overflow-hidden ${viewMode === 'grid' ? 'rounded-full' : 'rounded-lg'}`}>
                         <Image src={negocio.logo_url} alt="Logo" fill className="object-cover" />
                       </div>
                     ) : (
                       <div className={`w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 text-xl ${viewMode === 'grid' ? 'rounded-full' : 'rounded-lg'}`}>📷</div>
                     )}
                   </div>
                </div>

                {/* INFO */}
                <div className={`${viewMode === 'grid' ? 'pt-10 p-5' : 'flex-grow px-2 md:px-0'}`}>
                   <h3 className="font-bold text-base text-mc-dark leading-tight">{negocio.nombre}</h3>
                   <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2 items-center">
                     <span className="bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">{negocio.categoria}</span>
                   </div>
                </div>

                {/* BOTONERA */}
                <div className={`flex items-center gap-3 border-t border-gray-50 ${viewMode === 'grid' ? 'p-4 justify-end bg-gray-50/30' : 'p-2 border-none justify-end w-full md:w-auto'}`}>
                  <a href={`/negocio/${negocio.slug}`} target="_blank" className="bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-sm active:scale-95 md:w-auto md:h-auto md:px-4 md:py-2 md:text-sm md:font-bold" title="Ver Perfil"><Icons.Eye /><span className="hidden md:inline-block ml-2">Ver</span></a>
                  <div className="w-px h-6 bg-gray-200 mx-1 hidden md:block"></div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {negocio.estado === 'pendiente' && (<><ActionButton onClick={() => handleReject(negocio.id)} icon={Icons.X} label="Rechazar" bgColor="bg-red-500" hoverColor="hover:bg-red-600" shadowColor="shadow-red-200" /><ActionButton onClick={() => handleApprove(negocio.id)} icon={Icons.Check} label="Aprobar" bgColor="bg-green-500" hoverColor="hover:bg-green-600" shadowColor="shadow-green-200" /></>)}
                    {negocio.estado === 'aprobado' && (<><ActionButton onClick={() => handlePause(negocio.id)} icon={Icons.Pause} label="Pausar" bgColor="bg-amber-400" hoverColor="hover:bg-amber-500" shadowColor="shadow-amber-200" /><ActionButton onClick={() => handleEdit(negocio.id)} icon={Icons.Edit} label="Editar" bgColor="bg-blue-500" hoverColor="hover:bg-blue-600" shadowColor="shadow-blue-200" /><ActionButton onClick={() => handleDelete(negocio.id)} icon={Icons.Trash} label="Borrar" bgColor="bg-red-500" hoverColor="hover:bg-red-600" shadowColor="shadow-red-200" /></>)}
                    {negocio.estado === 'pausado' && (<><ActionButton onClick={() => handleReactivate(negocio.id)} icon={Icons.Play} label="Reactivar" bgColor="bg-green-500" hoverColor="hover:bg-green-600" shadowColor="shadow-green-200" /><ActionButton onClick={() => handleEdit(negocio.id)} icon={Icons.Edit} label="Editar" bgColor="bg-blue-500" hoverColor="hover:bg-blue-600" shadowColor="shadow-blue-200" /></>)}
                     {negocio.estado === 'rechazado' && (<><ActionButton onClick={() => handleApprove(negocio.id)} icon={Icons.Check} label="Recuperar" bgColor="bg-gray-400" hoverColor="hover:bg-gray-500" shadowColor="shadow-gray-200" /><ActionButton onClick={() => handleDelete(negocio.id)} icon={Icons.Trash} label="Borrar" bgColor="bg-red-500" hoverColor="hover:bg-red-600" shadowColor="shadow-red-200" /></>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect, ChangeEvent, use } from "react";
import { GlassCard } from "../../../../components/ui/GlassCard";
import Image from "next/image";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- TIPOS ---
type ServiceItem = {
  id: string;
  text: string;
  price?: string;
  description?: string;
  imagePreview: string | null; // URL existente o Preview local
  imageFile?: File; // Solo si es nueva
};

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
type DiaHorario = { active: boolean; start: string; end: string };

// --- COMPONENTES UI (Mismos del registro) ---
const PillInput = (props: any) => (
  <div className="group mb-4">
    <label className="block text-xs font-bold text-gray-400 uppercase ml-4 mb-1 tracking-wider group-focus-within:text-mc-orange transition-colors">
      {props.label} {props.required && "*"}
    </label>
    <input {...props} className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 text-mc-dark outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all shadow-sm placeholder:text-gray-300" />
  </div>
);

const ServiceSwitch = ({ label, icon, checked, onClick }: any) => (
  <div onClick={onClick} className={`cursor-pointer relative flex items-center justify-between p-4 rounded-full border-2 transition-all duration-300 shadow-sm ${checked ? 'bg-orange-50 border-mc-orange' : 'bg-white border-gray-100 hover:border-gray-300'}`}>
    <div className="flex items-center gap-3"><span className={`text-xl ${!checked && 'grayscale opacity-70'}`}>{icon}</span><span className={`font-bold text-sm ${checked ? 'text-mc-dark' : 'text-gray-400'}`}>{label}</span></div>
    <div className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-mc-orange' : 'bg-gray-200'}`}><div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} /></div>
  </div>
);

// --- PÁGINA DE EDICIÓN ---
export default function EditarNegocioPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados Horario
  const [scheduleState, setScheduleState] = useState<Record<string, DiaHorario>>(
    diasSemana.reduce((acc, dia) => ({ ...acc, [dia]: { active: false, start: "09:00", end: "18:00" } }), {})
  );

  // Estados Formulario
  const [formData, setFormData] = useState({
    responsable: "", nombre: "", categoria: "", whatsapp: "", descripcion: "",
    direccion: "", mapaLink: "", horario: "",
    tiene_domicilio: false, tiene_local: false, tiene_envios: false,
  });

  // Imágenes (URLs existentes o Files nuevos)
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const [portadaPreview, setPortadaPreview] = useState<string>("");
  const [portadaFile, setPortadaFile] = useState<File | null>(null);

  // GALERÍA: Estado Híbrido (Viejas + Nuevas)
  const [galeriaUrls, setGaleriaUrls] = useState<string[]>([]); // URLs viejas (desde DB)
  const [galeriaNewFiles, setGaleriaNewFiles] = useState<File[]>([]); // Archivos nuevos (para subir)
  const [galeriaNewPreviews, setGaleriaNewPreviews] = useState<string[]>([]); // Previews locales de los archivos nuevos

  // Servicios
  const [servicios, setServicios] = useState<ServiceItem[]>([]);
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", precio: "", descripcion: "" });
  const [nuevoServicioFile, setNuevoServicioFile] = useState<File | undefined>(undefined);
  const [nuevaImagenPreview, setNuevaImagenPreview] = useState<string | null>(null);

  // --- CARGAR DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('negocios').select('*').eq('id', id).single();
      if (error || !data) { alert("Negocio no encontrado"); router.push('/admin/dashboard'); return; }

      setFormData({
        responsable: data.responsable_name || "",
        nombre: data.nombre,
        categoria: data.categoria,
        whatsapp: data.whatsapp,
        descripcion: data.descripcion || "",
        direccion: data.direccion || "",
        mapaLink: data.mapa_link || "",
        horario: data.horario || "",
        tiene_domicilio: data.tiene_domicilio,
        tiene_local: data.tiene_local,
        tiene_envios: data.tiene_envios,
      });

      if (data.logo_url) setLogoPreview(data.logo_url);
      if (data.portada_url) setPortadaPreview(data.portada_url);
      if (data.galeria_urls) setGaleriaUrls(data.galeria_urls);

      if (data.servicios) {
        setServicios(data.servicios.map((s: any, i: number) => ({
          id: i.toString(),
          text: s.nombre,
          price: s.precio,
          description: s.descripcion,
          imagePreview: s.imagen || null
        })));
      }

      if (data.horario) {
        const newSchedule = { ...scheduleState };
        const parts = data.horario.split(', ');
        parts.forEach((part: string) => {
          const [day, time] = part.split(': ');
          if (day && time && newSchedule[day]) {
            const [start, end] = time.split('-');
            newSchedule[day] = { active: true, start: start || "09:00", end: end || "18:00" };
          }
        });
        setScheduleState(newSchedule);
      }

      setLoading(false);
    };
    fetchData();
  }, [id, router]);

  useEffect(() => {
    if (!loading) {
      const lines: string[] = [];
      diasSemana.forEach(dia => {
        const s = scheduleState[dia];
        if (s?.active) lines.push(`${dia}: ${s.start}-${s.end}`);
      });
      setFormData(prev => ({ ...prev, horario: lines.join(", ") }));
    }
  }, [scheduleState, loading]);


  // --- MANEJADORES ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateSchedule = (dia: string, field: keyof DiaHorario, value: any) => {
    setScheduleState(prev => ({ ...prev, [dia]: { ...prev[dia], [field]: value } }));
  };

  // Manejo de Imágenes (Híbrido: Previsualiza File nuevo, o mantiene URL vieja)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'portada' | 'galeria') => {
    const file = e.target.files?.[0];
    
    if (type === 'logo' && file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else if (type === 'portada' && file) {
      setPortadaFile(file);
      setPortadaPreview(URL.createObjectURL(file));
    } else if (type === 'galeria' && e.target.files) {
      // FIX: Manejo correcto de galería múltiple y previews
      const files = Array.from(e.target.files);
      // 1. Guardamos los archivos reales para subir luego
      setGaleriaNewFiles(prev => [...prev, ...files]);
      // 2. Generamos previews visuales inmediatos
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setGaleriaNewPreviews(prev => [...prev, ...newPreviews]);
    }
     // FIX: Reset input value para permitir re-selección
     if (e.target) e.target.value = "";
  };

  // Función para eliminar una foto NUEVA (pendiente de subir)
  const removeNewPhoto = (index: number) => {
    setGaleriaNewFiles(prev => prev.filter((_, i) => i !== index));
    setGaleriaNewPreviews(prev => {
       // Liberar memoria de la URL temporal
       if (prev[index]) URL.revokeObjectURL(prev[index]);
       return prev.filter((_, i) => i !== index);
    });
  };

  // Servicios
  const agregarServicio = () => {
    if (nuevoServicio.nombre.trim()) {
      setServicios([...servicios, {
        id: Date.now().toString(),
        text: nuevoServicio.nombre,
        price: nuevoServicio.precio,
        description: nuevoServicio.descripcion,
        imagePreview: nuevaImagenPreview,
        imageFile: nuevoServicioFile
      }]);
      setNuevoServicio({ nombre: "", precio: "", descripcion: "" });
      setNuevaImagenPreview(null);
      setNuevoServicioFile(undefined);
    }
  };

  const eliminarServicio = (id: string) => setServicios(servicios.filter(s => s.id !== id));

  // --- SUBMIT (ACTUALIZAR) ---
  const uploadImage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { error } = await supabase.storage.from('fotos-negocios').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('fotos-negocios').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      
      let finalLogoUrl = logoPreview;
      if (logoFile) finalLogoUrl = await uploadImage(logoFile, 'logos');

      let finalPortadaUrl = portadaPreview;
      if (portadaFile) finalPortadaUrl = await uploadImage(portadaFile, 'portadas');

      // Galería: Mezclar URLs viejas + Nuevas subidas
      let finalGaleria = [...galeriaUrls]; // Empezamos con las viejas que no se borraron
      for (const file of galeriaNewFiles) {
        const url = await uploadImage(file, 'galerias');
        finalGaleria.push(url);
      }

      const finalServicios = await Promise.all(servicios.map(async (s) => {
        let imgUrl = s.imagePreview;
        if (s.imageFile) {
          imgUrl = await uploadImage(s.imageFile, 'servicios');
        }
        return {
          nombre: s.text,
          precio: s.price,
          descripcion: s.description,
          imagen: imgUrl
        };
      }));

      const { error } = await supabase.from('negocios').update({
        nombre: formData.nombre,
        responsable_name: formData.responsable,
        categoria: formData.categoria,
        whatsapp: formData.whatsapp,
        descripcion: formData.descripcion,
        direccion: formData.direccion,
        mapa_link: formData.mapaLink,
        horario: formData.horario,
        tiene_domicilio: formData.tiene_domicilio,
        tiene_local: formData.tiene_local,
        tiene_envios: formData.tiene_envios,
        logo_url: finalLogoUrl,
        portada_url: finalPortadaUrl,
        galeria_urls: finalGaleria,
        servicios: finalServicios
      }).eq('id', id);

      if (error) throw error;

      alert("✅ Negocio actualizado correctamente");
      router.push('/admin/dashboard');

    } catch (e) {
      console.error(e);
      alert("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4">
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-mc-dark">✏️ Editar Negocio</h1>
        <Link href="/admin/dashboard" className="text-gray-500 hover:text-mc-dark font-bold text-sm">Cancelar</Link>
      </div>

      <GlassCard className="max-w-3xl mx-auto bg-white p-8 space-y-8">
        
        {/* SECCIÓN 1: DATOS BÁSICOS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b pb-2 text-mc-orange">Datos Principales</h2>
          <PillInput label="Nombre del Negocio" name="nombre" value={formData.nombre} onChange={handleInputChange} />
          <PillInput label="Responsable" name="responsable" value={formData.responsable} onChange={handleInputChange} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PillInput label="WhatsApp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} />
            <div className="group mb-4">
                <label className="block text-xs font-bold text-gray-400 uppercase ml-4 mb-1">Categoría</label>
                <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200">
                  <option>Alimentos</option><option>Comercio</option><option>Servicios</option><option>Salud</option><option>Automotriz</option>
                </select>
            </div>
          </div>
          <div className="group"><label className="block text-xs font-bold text-gray-400 uppercase ml-4 mb-1">Descripción</label><textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={3} className="w-full px-5 py-3 rounded-3xl bg-gray-50 border border-gray-200 resize-none" /></div>
        </div>

        {/* SECCIÓN 2: OPERACIÓN */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold border-b pb-2 text-mc-orange">Operación</h2>
          <PillInput label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
          <PillInput label="Link Mapa" name="mapaLink" value={formData.mapaLink} onChange={handleInputChange} />
          
          {/* Horario */}
          <div className="bg-gray-50 rounded-3xl p-4 border border-gray-100 space-y-2">
             <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Horario</label>
             {diasSemana.map((dia) => (
               <div key={dia} className="flex items-center gap-2">
                 <button type="button" onClick={() => updateSchedule(dia, 'active', !scheduleState[dia].active)} className={`w-8 h-8 rounded-full text-xs font-bold border ${scheduleState[dia].active ? 'bg-mc-dark text-white border-mc-dark' : 'bg-white text-gray-300'}`}>{dia.charAt(0)}</button>
                 <div className={`flex gap-2 transition-opacity ${scheduleState[dia].active ? 'opacity-100' : 'opacity-25 pointer-events-none'}`}>
                   <input type="time" value={scheduleState[dia].start} onChange={(e) => updateSchedule(dia, 'start', e.target.value)} className="rounded-lg border px-2 py-1 text-xs" />
                   <input type="time" value={scheduleState[dia].end} onChange={(e) => updateSchedule(dia, 'end', e.target.value)} className="rounded-lg border px-2 py-1 text-xs" />
                 </div>
               </div>
             ))}
          </div>

          <div className="space-y-3">
             <ServiceSwitch label="Tienda Física" icon="🏪" checked={formData.tiene_local} onClick={() => setFormData({...formData, tiene_local: !formData.tiene_local})} />
             <ServiceSwitch label="A Domicilio" icon="🛵" checked={formData.tiene_domicilio} onClick={() => setFormData({...formData, tiene_domicilio: !formData.tiene_domicilio})} />
             <ServiceSwitch label="Punto Medio" icon="📍" checked={formData.tiene_envios} onClick={() => setFormData({...formData, tiene_envios: !formData.tiene_envios})} />
          </div>
        </div>

        {/* SECCIÓN 3: IMÁGENES (FIX APLICADO AQUÍ) */}
        <div className="space-y-6">
           <h2 className="text-lg font-bold border-b pb-2 text-mc-orange">Imágenes</h2>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold mb-2">Logo</p>
                <label className="block w-32 h-32 rounded-2xl bg-gray-100 relative overflow-hidden cursor-pointer border-2 border-dashed hover:border-mc-orange">
                  {logoPreview && <Image src={logoPreview} alt="Logo" fill className="object-cover" />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                </label>
              </div>
              <div>
                <p className="text-xs font-bold mb-2">Portada</p>
                <label className="block w-full h-32 rounded-2xl bg-gray-100 relative overflow-hidden cursor-pointer border-2 border-dashed hover:border-mc-orange">
                  {portadaPreview && <Image src={portadaPreview} alt="Portada" fill className="object-cover" />}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'portada')} />
                </label>
              </div>
           </div>
           
           {/* Galería Híbrida */}
           <div>
             <p className="text-xs font-bold mb-2">
                Galería ({galeriaUrls.length} existentes + {galeriaNewFiles.length} nuevas)
             </p>
             <div className="flex gap-2 overflow-x-auto pb-4">
               
               {/* 1. Fotos VIEJAS (DB) */}
               {galeriaUrls.map((url, i) => (
                 <div key={`old-${i}`} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 group">
                   <Image src={url} alt="old" fill className="object-cover" />
                   <button type="button" onClick={() => setGaleriaUrls(galeriaUrls.filter(u => u !== url))} className="absolute top-1 right-1 bg-red-500/80 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                 </div>
               ))}

               {/* 2. Fotos NUEVAS (Previews Locales) */}
               {galeriaNewPreviews.map((url, i) => (
                 <div key={`new-${i}`} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-mc-orange group shadow-sm">
                   <Image src={url} alt="new" fill className="object-cover" />
                   {/* Botón para quitar foto nueva */}
                   <button type="button" onClick={() => removeNewPhoto(i)} className="absolute top-1 right-1 bg-mc-orange text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center shadow-sm">×</button>
                   <span className="absolute bottom-0 left-0 right-0 bg-mc-orange/80 text-white text-[8px] text-center font-bold py-0.5">NUEVA</span>
                 </div>
               ))}

             </div>
             <label className="mt-2 inline-block px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200">
               + Agregar Fotos
               <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'galeria')} />
             </label>
           </div>
        </div>

        {/* BOTÓN FINAL */}
        <button 
          onClick={handleUpdate} 
          disabled={saving}
          className="w-full py-4 bg-mc-dark text-white font-bold rounded-full shadow-xl hover:bg-black transition-all disabled:opacity-50 fixed bottom-4 left-4 right-4 max-w-3xl mx-auto md:static md:mb-0 z-50"
        >
          {saving ? "Guardando Cambios..." : "💾 Guardar Cambios"}
        </button>

      </GlassCard>
    </div>
  );
}
"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import Image from "next/image";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

// --- TIPOS ---
type ServiceItem = {
  id: string;
  text: string;
  price?: string;
  description?: string;
  imagePreview: string | null;
  imageFile?: File;
};

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
type DiaHorario = { active: boolean; start: string; end: string };

// --- COMPONENTES UI (Externos) ---

const PillInput = (props: any) => (
  <div className="group mb-4">
    <label className="block text-xs font-bold text-gray-400 uppercase ml-4 mb-1 tracking-wider group-focus-within:text-mc-orange transition-colors">
      {props.label} {props.required && "*"}
    </label>
    <input 
      {...props} 
      className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 text-mc-dark outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all shadow-sm placeholder:text-gray-300" 
    />
  </div>
);

const ServiceSwitch = ({ label, icon, checked, onClick }: { label: string, icon: string, checked: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`cursor-pointer relative flex items-center justify-between p-4 rounded-full border-2 transition-all duration-300 shadow-sm ${checked ? 'bg-orange-50 border-mc-orange' : 'bg-white border-gray-100 hover:border-gray-300'}`}
  >
    <div className="flex items-center gap-3">
      <span className={`text-xl ${!checked && 'grayscale opacity-70'}`}>{icon}</span>
      <span className={`font-bold text-sm ${checked ? 'text-mc-dark' : 'text-gray-400'}`}>{label}</span>
    </div>
    <div className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-mc-orange' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

// --- PÁGINA PRINCIPAL ---

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estados Horario
  const [scheduleState, setScheduleState] = useState<Record<string, DiaHorario>>(
    diasSemana.reduce((acc, dia) => ({
      ...acc,
      [dia]: { active: dia !== "Dom", start: "09:00", end: "18:00" }
    }), {})
  );

  // Estados Formulario
  const [formData, setFormData] = useState({
    responsable: "",
    nombre: "",
    categoria: "",
    whatsapp: "",
    descripcion: "",
    direccion: "",
    mapaLink: "",
    horario: "", 
    tiene_domicilio: false,
    tiene_local: false,
    tiene_envios: false,
  });

  useEffect(() => {
    const lines: string[] = [];
    diasSemana.forEach(dia => {
      const s = scheduleState[dia];
      if (s?.active) {
        lines.push(`${dia}: ${s.start}-${s.end}`);
      }
    });
    setFormData(prev => ({ ...prev, horario: lines.join(", ") }));
  }, [scheduleState]);

  // Manejadores
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleServiceAttribute = (field: 'tiene_local' | 'tiene_domicilio' | 'tiene_envios') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const updateSchedule = (dia: string, field: keyof DiaHorario, value: any) => {
    setScheduleState(prev => ({
      ...prev,
      [dia]: { ...prev[dia], [field]: value }
    }));
  };

  // --- IMÁGENES GENERALES ---
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  
  // CORRECCIÓN 1: Usamos File[] (Array) en lugar de FileList
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]); 
  
  const [previews, setPreviews] = useState({ logo: "", portada: "" });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'portada' | 'galeria') => {
    const file = e.target.files?.[0];
    
    // Si no hay archivos y es galería, no hacemos nada (para no borrar lo que había si cancelan)
    if (!e.target.files || e.target.files.length === 0) return;

    if (type === 'logo' && file) {
      setLogoFile(file);
      setPreviews(prev => ({ ...prev, logo: URL.createObjectURL(file) }));
    } else if (type === 'portada' && file) {
      setPortadaFile(file);
      setPreviews(prev => ({ ...prev, portada: URL.createObjectURL(file) }));
    } else if (type === 'galeria') {
      // CORRECCIÓN 2: Convertimos FileList a Array inmediatamente para guardarlo seguro
      const fileArray = Array.from(e.target.files);
      setGaleriaFiles(fileArray);
    }
    
    // Limpiamos el input
    e.target.value = "";
  };

  // --- LÓGICA DE SERVICIOS ---
  const [servicios, setServicios] = useState<ServiceItem[]>([]);
  const [nuevoServicio, setNuevoServicio] = useState({ nombre: "", precio: "", descripcion: "" });
  const [nuevaImagenPreview, setNuevaImagenPreview] = useState<string | null>(null);
  const [nuevoServicioFile, setNuevoServicioFile] = useState<File | undefined>(undefined);

  const handleServiceImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNuevoServicioFile(file);
      setNuevaImagenPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const agregarServicio = () => {
    if (nuevoServicio.nombre.trim() !== "") {
      const newItem: ServiceItem = {
        id: Date.now().toString(),
        text: nuevoServicio.nombre,
        price: nuevoServicio.precio,
        description: nuevoServicio.descripcion,
        imagePreview: nuevaImagenPreview,
        imageFile: nuevoServicioFile
      };
      setServicios([...servicios, newItem]);
      setNuevoServicio({ nombre: "", precio: "", descripcion: "" });
      setNuevaImagenPreview(null);
      setNuevoServicioFile(undefined);
    }
  };

  const eliminarServicio = (idToDelete: string) => {
    setServicios(servicios.filter(item => item.id !== idToDelete));
  };

  // Subida a Supabase
  const uploadImage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from('fotos-negocios').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('fotos-negocios').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!formData.nombre || !formData.whatsapp) {
        alert("Faltan datos obligatorios.");
        setLoading(false);
        return;
      }
      const slug = formData.nombre.toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

      let logoUrl = "";
      let portadaUrl = "";
      let galeriaUrls: string[] = [];

      if (logoFile) logoUrl = await uploadImage(logoFile, 'logos');
      if (portadaFile) portadaUrl = await uploadImage(portadaFile, 'portadas');
      
      // CORRECCIÓN 3: Iteramos sobre el Array seguro
      if (galeriaFiles.length > 0) {
        for (const file of galeriaFiles) {
          const url = await uploadImage(file, 'galerias');
          galeriaUrls.push(url);
        }
      }

      const serviciosFinales = await Promise.all(servicios.map(async (servicio) => {
        let imageUrl = "";
        if (servicio.imageFile) imageUrl = await uploadImage(servicio.imageFile, 'servicios');
        return { nombre: servicio.text, precio: servicio.price, descripcion: servicio.description, imagen: imageUrl };
      }));

      const { error } = await supabase.from('negocios').insert({
        nombre: formData.nombre,
        slug: slug + '-' + Date.now().toString().slice(-4),
        categoria: formData.categoria,
        whatsapp: formData.whatsapp,
        descripcion: formData.descripcion,
        responsable_name: formData.responsable,
        direccion: formData.direccion,
        mapa_link: formData.mapaLink,
        horario: formData.horario,
        tiene_domicilio: formData.tiene_domicilio,
        tiene_local: formData.tiene_local,
        tiene_envios: formData.tiene_envios,
        logo_url: logoUrl,
        portada_url: portadaUrl,
        galeria_urls: galeriaUrls, // Aquí ya van las URLs
        servicios: serviciosFinales,
        estado: 'pendiente'
      });

      if (error) throw error;
      router.push('/directorio');
    } catch (error) {
      console.error(error);
      alert("Error al guardar: " + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="relative min-h-screen py-10 flex flex-col items-center justify-center overflow-hidden px-4 font-sans">
      
      {/* Fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mc-orange/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-8 z-10">
        <h1 className="text-3xl font-bold text-mc-dark">Alta de Negocio</h1>
        <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-4 mx-auto overflow-hidden">
          <div className="h-full bg-mc-orange transition-all duration-500 ease-out" style={{ width: `${step * 25}%` }} />
        </div>
      </div>

      <GlassCard className="w-full max-w-2xl bg-white border-white/60 shadow-xl backdrop-blur-2xl relative z-10 animate-in fade-in zoom-in duration-500 p-8">
        <form onSubmit={(e) => e.preventDefault()}>
          
          {/* PASO 1 */}
          {step === 1 && (
            <div className="space-y-2 animate-in slide-in-from-right duration-300">
              <h2 className="text-xl font-bold text-mc-dark mb-6 pl-2 border-l-4 border-mc-orange">Información</h2>
              <PillInput label="Tu Nombre (Privado)" name="responsable" value={formData.responsable} onChange={handleInputChange} placeholder="Ej. Ana García" />
              <PillInput label="Nombre del Negocio" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej. Florería Jazmín" required />
              
              <div className="group mb-4">
                <label className="block text-xs font-bold text-gray-400 uppercase ml-4 mb-1 tracking-wider">Categoría</label>
                <div className="relative">
                  <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 text-mc-dark outline-none focus:border-mc-orange appearance-none cursor-pointer">
                    <option value="">Selecciona...</option>
                    <option value="Alimentos">Alimentos</option>
                    <option value="Comercio">Comercio</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Salud">Salud</option>
                    <option value="Automotriz">Automotriz</option>
                  </select>
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
                </div>
              </div>
              <PillInput label="WhatsApp (10 Dígitos)" name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleInputChange} placeholder="5512345678" required />
              <div className="group mb-4">
                 <label className="block text-xs font-bold text-gray-400 uppercase ml-4 mb-1 tracking-wider">Descripción</label>
                 <textarea name="descripcion" rows={3} value={formData.descripcion} onChange={handleInputChange} placeholder="Cuéntanos brevemente qué ofreces..." className="w-full px-5 py-3 rounded-3xl bg-gray-50 border border-gray-200 text-mc-dark outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all resize-none"/>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-xl font-bold text-mc-dark mb-4 pl-2 border-l-4 border-mc-orange">Ubicación y Horario</h2>
              <PillInput label="Dirección / Colonia" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Ej. Calle Morelos #45, Centro" />
              <PillInput label="Link Google Maps (Opcional)" name="mapaLink" value={formData.mapaLink} onChange={handleInputChange} placeholder="https://maps.google..." />

              <div className="bg-gray-50 rounded-3xl p-4 md:p-6 border border-gray-100">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Configura tu Horario</label>
                <div className="space-y-3">
                  {diasSemana.map((dia) => (
                    <div key={dia} className="flex items-center justify-between gap-2">
                      <div onClick={() => updateSchedule(dia, 'active', !scheduleState[dia].active)} className={`w-8 h-8 md:w-14 md:h-8 rounded-full flex items-center justify-center cursor-pointer transition-all border font-bold text-xs ${scheduleState[dia].active ? 'bg-mc-dark text-white border-mc-dark' : 'bg-white text-gray-300 border-gray-200'}`}>
                        <span className="md:hidden">{dia.charAt(0)}</span>
                        <span className="hidden md:block">{dia}</span>
                      </div>
                      <div className={`flex-grow flex items-center gap-1 md:gap-2 transition-opacity ${scheduleState[dia].active ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                        <input type="time" value={scheduleState[dia].start} onChange={(e) => updateSchedule(dia, 'start', e.target.value)} className="bg-white px-1 md:px-2 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm w-full outline-none focus:border-mc-orange text-center" />
                        <span className="text-gray-300">-</span>
                         <input type="time" value={scheduleState[dia].end} onChange={(e) => updateSchedule(dia, 'end', e.target.value)} className="bg-white px-1 md:px-2 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm w-full outline-none focus:border-mc-orange text-center" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-400 uppercase ml-2 tracking-wider">Tipo de Servicio</label>
                <div className="grid grid-cols-1 gap-3">
                  <ServiceSwitch label="Tienda Física / Local" icon="🏪" checked={formData.tiene_local} onClick={() => toggleServiceAttribute('tiene_local')} />
                  <ServiceSwitch label="Servicio a Domicilio" icon="🛵" checked={formData.tiene_domicilio} onClick={() => toggleServiceAttribute('tiene_domicilio')} />
                  <ServiceSwitch label="Entrega en Punto Medio / Acordado" icon="🤝" checked={formData.tiene_envios} onClick={() => toggleServiceAttribute('tiene_envios')} />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-xl font-bold text-mc-dark mb-4 pl-2 border-l-4 border-mc-orange">Productos Destacados</h2>
              <div className="bg-gray-50 p-4 rounded-3xl border border-gray-200 space-y-4">
                <div className="flex gap-4 items-start">
                   <label className="h-20 w-20 flex-shrink-0 rounded-2xl bg-white border-2 border-dashed border-gray-300 hover:border-mc-orange cursor-pointer flex items-center justify-center overflow-hidden relative group transition-all">
                    {nuevaImagenPreview ? <Image src={nuevaImagenPreview} alt="Preview" fill className="object-cover" /> : <span className="text-2xl opacity-30">📷</span>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleServiceImageSelect} />
                  </label>
                  <div className="flex-grow space-y-3">
                    <input type="text" value={nuevoServicio.nombre} onChange={(e) => setNuevoServicio({...nuevoServicio, nombre: e.target.value})} placeholder="Nombre (Ej. Hamburguesa)" className="w-full bg-white px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-mc-orange text-sm" />
                    <div className="flex gap-2">
                      <input type="text" value={nuevoServicio.precio} onChange={(e) => setNuevoServicio({...nuevoServicio, precio: e.target.value})} placeholder="$ Precio" className="w-1/3 bg-white px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-mc-orange text-sm" />
                      <input type="text" value={nuevoServicio.descripcion} onChange={(e) => setNuevoServicio({...nuevoServicio, descripcion: e.target.value})} placeholder="Detalles..." className="w-2/3 bg-white px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-mc-orange text-sm" />
                    </div>
                  </div>
                </div>
                <button type="button" onClick={agregarServicio} disabled={!nuevoServicio.nombre} className="w-full py-3 bg-mc-dark text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50 text-sm">
                  + Agregar
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                 {servicios.map((item) => (
                    <div key={item.id} className="flex items-center p-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0 mr-3">
                         {item.imagePreview && <Image src={item.imagePreview} alt="img" fill className="object-cover" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-sm text-mc-dark">{item.text}</p>
                          {item.price && <span className="text-xs font-bold text-mc-orange bg-orange-50 px-2 py-0.5 rounded-full">{item.price}</span>}
                        </div>
                      </div>
                      <button onClick={() => eliminarServicio(item.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">✕</button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* PASO 4 */}
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <h2 className="text-xl font-bold text-mc-dark mb-4 pl-2 border-l-4 border-mc-orange">Imagen Visual</h2>
               <div className="grid grid-cols-2 gap-4">
                 <div className="text-center">
                    <label className="block w-full aspect-square rounded-3xl border-2 border-dashed border-gray-200 hover:border-mc-orange cursor-pointer relative overflow-hidden bg-gray-50 mx-auto transition-all group">
                      {previews.logo ? <Image src={previews.logo} alt="Logo" fill className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-gray-300 text-4xl group-hover:scale-110 transition-transform">👤</span>}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                    </label>
                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase">Logo</p>
                 </div>
                 <div className="text-center">
                    <label className="block w-full aspect-square rounded-3xl border-2 border-dashed border-gray-200 hover:border-mc-orange cursor-pointer relative overflow-hidden bg-gray-50 mx-auto transition-all group">
                      {previews.portada ? <Image src={previews.portada} alt="Portada" fill className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-gray-300 text-4xl group-hover:scale-110 transition-transform">🖼️</span>}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'portada')} />
                    </label>
                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase">Portada</p>
                 </div>
               </div>
               <div className="pt-4">
                 <label className="flex items-center justify-center w-full p-4 rounded-3xl border border-gray-200 bg-white hover:border-mc-orange cursor-pointer gap-3 transition-all shadow-sm group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
                    <span className="text-sm font-bold text-gray-500 group-hover:text-mc-orange">
                      {galeriaFiles.length > 0 ? `${galeriaFiles.length} fotos listas` : "Subir Galería (+)"}
                    </span>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'galeria')} />
                 </label>
               </div>
            </div>
          )}

          {/* CONTROLES */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={prevStep} disabled={loading} className="text-gray-400 font-bold hover:text-mc-dark px-4 transition-colors">← Atrás</button>
            ) : <div />}

            {step < 4 ? (
              <button type="button" onClick={nextStep} className="bg-mc-dark text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Siguiente</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="bg-mc-orange text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 hover:scale-105 transition-all disabled:opacity-70">
                {loading ? "Guardando..." : "Finalizar ✨"}
              </button>
            )}
          </div>

        </form>
      </GlassCard>
    </div>
  );
}
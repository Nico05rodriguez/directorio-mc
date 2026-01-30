"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminSliderPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data } = await supabase.from("hero_slides").select("*").order("created_at", { ascending: false });
    if (data) setSlides(data);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Subir imagen
    const { error: uploadError } = await supabase.storage.from('sliders').upload(filePath, file);
    if (uploadError) { alert("Error subiendo imagen"); setUploading(false); return; }

    // 2. Obtener URL
    const { data: { publicUrl } } = supabase.storage.from('sliders').getPublicUrl(filePath);

    // 3. Guardar en DB
    const { error: dbError } = await supabase.from('hero_slides').insert([{ image_url: publicUrl }]);
    
    if (!dbError) {
      fetchSlides();
    } else {
      alert("Error guardando en base de datos");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if(!confirm("¿Borrar esta imagen?")) return;
    await supabase.from("hero_slides").delete().eq("id", id);
    fetchSlides();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-mc-dark">Gestor de Portada</h1>
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-mc-dark font-bold">← Volver</Link>
        </div>

        {/* Subir Nueva */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 text-center">
          <label className="cursor-pointer inline-block">
             <span className="bg-mc-orange text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
               {uploading ? "Subiendo..." : "+ Subir Nueva Imagen"}
             </span>
             <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
          <p className="text-xs text-gray-400 mt-2">Recomendado: 1200x600px o superior.</p>
        </div>

        {/* Lista de Slides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="relative group rounded-xl overflow-hidden shadow-md bg-white">
              <div className="relative h-48 w-full">
                <Image src={slide.image_url} alt="Slide" fill className="object-cover" />
              </div>
              <button 
                onClick={() => handleDelete(slide.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="Borrar"
              >
                🗑️
              </button>
            </div>
          ))}
          {slides.length === 0 && <p className="text-gray-400 text-center col-span-2 py-10">No hay imágenes en el slider.</p>}
        </div>
      </div>
    </div>
  );
}
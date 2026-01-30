"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

// Iconos SVG limpios (Color blanco por defecto vía currentColor)
const Icons = {
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Rocket: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  ArrowDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
};

export const HeroSlider = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase.from('hero_slides').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setSlides(data);
      } else {
        setSlides([{ id: 'default', image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000' }]);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById("conocer-mas");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Estilo Liquid Glass (Transparente para fondo oscuro)
  const glassButtonClass = "px-6 py-2.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white font-semibold text-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] flex items-center justify-center gap-2";
  
  if (slides.length === 0) return <div className="h-48 md:h-[400px] bg-gray-100 rounded-2xl animate-pulse" />;

  return (
    <div className="relative w-full max-w-6xl mx-auto h-64 md:h-96 lg:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl mb-2 group border border-white/10">
      
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={slide.image_url} alt="Hero" fill className="object-cover" priority={index === 0} />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight drop-shadow-2xl mb-10">
          <span className="text-white">Apoyemos lo </span>
          <span className="text-mc-orange drop-shadow-sm">nuestro</span>
        </h1>

        <div className="hidden lg:flex gap-4">
          <Link href="/directorio" className={glassButtonClass}>
            <Icons.Search /> Explorar
          </Link>
          <Link href="/registro" className={`${glassButtonClass} bg-mc-orange/80 border-mc-orange/50 hover:bg-mc-orange`}>
            <Icons.Rocket /> Registrar
          </Link>
          <button onClick={handleScrollDown} className={glassButtonClass}>
            Conocer más <Icons.ArrowDown />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all shadow-sm ${index === current ? "bg-white w-8" : "bg-white/40 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </div>
  );
};
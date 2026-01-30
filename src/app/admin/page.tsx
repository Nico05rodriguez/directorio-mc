"use client";

import { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Intentamos iniciar sesión con Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: Credenciales incorrectas o acceso no autorizado.");
      setLoading(false);
    } else {
      // Si es correcto, nos vamos al Dashboard (que crearemos en el siguiente paso)
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-4">
      
      {/* Fondos Decorativos */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mc-orange/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />

      <GlassCard className="w-full max-w-md bg-white border-white/60 shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-mc-dark mb-2">
            Panel <span className="text-mc-orange">Admin</span>
          </h1>
          <p className="text-gray-400 text-sm">Acceso exclusivo para administradores</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@directoriomc.com"
              className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 text-mc-dark outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-full bg-gray-50 border border-gray-200 text-mc-dark outline-none focus:border-mc-orange focus:ring-4 focus:ring-orange-100 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mc-dark text-white font-bold py-4 rounded-full shadow-lg hover:scale-105 hover:bg-black transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? "Verificando..." : "Entrar al Sistema →"}
          </button>

        </form>
      </GlassCard>
    </div>
  );
}
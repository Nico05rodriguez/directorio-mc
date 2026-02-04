import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { MobileNav } from "../components/ui/MobileNav"; // Ya tenías esto, ¡bien!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Directorio MC - Impulso Local",
  description: "Plataforma de apoyo al comercio local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        
        {/* CAMBIO CLAVE: pb-24 en móvil (espacio para la barra) y md:pb-12 en escritorio (normal) */}
        <main className="flex-grow pt-24 pb-24 md:pb-12 px-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        <Footer />
        
        {/* AQUÍ CONECTAMOS LA BARRA (Se ocultará sola en PC gracias a su código interno) */}
        <MobileNav />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

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
        {/* pt-24 da espacio para que el navbar fijo no tape el contenido */}
        <main className="flex-grow pt-24 pb-12 px-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
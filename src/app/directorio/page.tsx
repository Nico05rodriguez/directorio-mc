import { BusinessCard } from "../../components/ui/BusinessCard";
import { SearchFilters } from "../../components/directory/SearchFilters"; 
import { supabase } from "../../lib/supabase";
import { Business } from "../../types";

export const dynamic = 'force-dynamic';

// Función para buscar en Supabase con filtros
async function getNegocios(query: string, category: string) {
  
  // Empezamos la consulta base (solo aprobados)
  let dbQuery = supabase
    .from('negocios')
    .select('*')
    .eq('estado', 'aprobado')
    .order('created_at', { ascending: false });

  // Si hay categoría seleccionada, filtramos
  if (category && category !== "Todas") {
    dbQuery = dbQuery.eq('categoria', category);
  }

  // Si hay texto de búsqueda, buscamos en nombre O descripción
  if (query) {
    // ilike es "case insensitive like" (busca sin importar mayúsculas)
    dbQuery = dbQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
  }

  const { data, error } = await dbQuery;

  if (error) {
    console.error("Error cargando negocios:", error);
    return [];
  }

  // AQUÍ ESTABA EL ERROR: Faltaban campos requeridos por el tipo Business
  return data.map((item: any) => ({
    id: item.id,
    
    // Campos principales
    nombre: item.nombre,
    categoria: item.categoria,
    descripcion: item.descripcion,
    whatsapp: item.whatsapp,
    portada_url: item.portada_url,
    logo_url: item.logo_url,
    slug: item.slug,
    verified: item.verificado,

    // Compatibilidad (Inglés/Español)
    name: item.nombre,
    category: item.categoria,
    phone: item.telefono,
    image: item.portada_url,

    // --- CAMPOS AGREGADOS PARA CORREGIR EL ERROR DE BUILD ---
    // Si no existen en la DB, enviamos cadena vacía "" para que TypeScript no falle
    telefono: item.telefono || "",
    direccion: item.direccion || "",
    mapa_link: item.mapa_link || "",
    horario: item.horario || "",
    sitio_web: item.sitio_web || "",
    email: item.email || "",
    instagram: item.instagram || "",
    facebook: item.facebook || ""
    
  })) as unknown as Business[]; // <--- EL TRUCO FINAL: Forzamos el tipo
}

export default async function DirectorioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  // Leemos los parámetros de la URL (Esperamos la promesa para Next.js 15)
  const resolvedParams = await searchParams;
  const q = resolvedParams?.q || "";
  const category = resolvedParams?.category || "";
  
  // Pedimos los datos filtrados
  const businesses = await getNegocios(q, category);

  return (
    <div className="py-10 animate-in fade-in duration-700 min-h-screen bg-gray-50/30">
      
      {/* Encabezado */}
      <div className="mb-8 text-center px-4">
        <h1 className="text-4xl font-bold text-mc-dark mb-4">
          Directorio <span className="text-mc-orange">Local</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Apoya el comercio local. Encuentra todo lo que necesitas en tu municipio.
        </p>

        {/* Buscador Interactivo */}
        <SearchFilters />
      </div>

      {/* Resultados */}
      <div className="max-w-7xl mx-auto px-4">
        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((negocio) => (
              <BusinessCard key={negocio.id} business={negocio} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 mx-4">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-bold text-gray-400">
              No encontramos resultados para "{q}"
            </h3>
            <p className="text-gray-400 mt-2">
              Intenta con otra palabra o categoría.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


// Forzando actualización para Vercel
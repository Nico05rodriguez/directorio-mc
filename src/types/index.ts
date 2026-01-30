export interface ServiceItem {
  nombre: string;
  imagen?: string;
  precio?: string;       // Nuevo
  descripcion?: string;  // Nuevo
}

export interface Business {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  descripcion: string;
  telefono: string;
  whatsapp: string;
  responsable_name?: string;
  
  // Ubicación
  direccion: string;
  mapa_link: string;
  
  // Atributos Nuevos
  horario: string;
  tiene_domicilio: boolean;
  tiene_local: boolean;
  tiene_envios: boolean;

  // Imágenes
  logo_url: string;
  portada_url: string;
  galeria_urls: string[];
  
  // Contenido Rico
  servicios: ServiceItem[];
  
  // Estado
  verified: boolean;
  estado: string;
}
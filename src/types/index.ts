export interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  price?: number | null;
  precio_entresemana?: number;
  precio_fin_de_semana?: number;
  precio_dia?: number;
  bathrooms?: number;
  bedrooms?: number;
  toilets?: number;
  square_meters?: number;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  main_image_path?: string | null;
  image_paths?: string[] | null;
  amenities?: string[] | null;
  lat?: number;
  lng?: number;
  meses_temporada?: string[];
  precio_mes?: number;
  alquila_temporada_completa?: boolean;
  url_idealista?: string;
  url_booking?: string;
  url_airbnb?: string;
  min_days?: number;
  max_days?: number;
  owner_id?: string;
  agency_id?: string;
  destacada?: boolean;
  tipo?: string;
  region?: string;
  property_code?: string;
  created_at?: string;
}

export interface Experience {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    duration: number;
    max_participants: number;
    photos: string[];
    featured: boolean;
    category: string;
    what_is_included?: string;
    what_is_needed?: string;
    external_url?: string;
    recurring_dates?: {
        type: string;
        dates: string[];
        days: string[];
    };
    created_at?: string;
    updated_at?: string;
} 
-- =====================================================
-- HOLYDEO - ESQUEMA COMPLETO DE BASE DE DATOS
-- =====================================================
-- Plataforma de gestión inmobiliaria y experiencias turísticas
-- Versión: 2.0.0
-- Fecha: 2025

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  photo_url TEXT,
  provider TEXT DEFAULT 'email',
  role TEXT DEFAULT 'guest' CHECK (role IN ('guest', 'agent', 'owner', 'admin')),
  is_active BOOLEAN DEFAULT true,
  last_sign_in TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de propietarios
CREATE TABLE IF NOT EXISTS owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de agencias
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logo_url TEXT
);

-- Tabla de agentes
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  agency_id UUID REFERENCES agencies(id),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT
);

-- Tabla de huéspedes
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clerk_id TEXT
);

-- =====================================================
-- GESTIÓN INMOBILIARIA
-- =====================================================

-- Tabla de propiedades
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  toilets INTEGER NOT NULL,
  square_meters INTEGER NOT NULL,
  street_address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'España',
  main_image_path TEXT,
  image_paths TEXT[],
  amenities TEXT[],
  precio_mes NUMERIC NOT NULL,
  precio_entresemana NUMERIC NOT NULL,
  precio_dia NUMERIC,
  alquila_temporada_completa BOOLEAN,
  meses_temporada TEXT[],
  lat NUMERIC,
  lng NUMERIC,
  precio_fin_de_semana NUMERIC NOT NULL,
  url_idealista TEXT,
  url_booking TEXT,
  url_airbnb TEXT,
  min_days INTEGER,
  max_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  owner_id UUID REFERENCES owners(id),
  agency_id UUID REFERENCES agencies(id),
  destacada BOOLEAN DEFAULT false,
  tipo VARCHAR,
  region VARCHAR,
  featured BOOLEAN DEFAULT false
);

-- Tabla de servicios cercanos
CREATE TABLE IF NOT EXISTS nearby_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  service_type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  distance_minutes INTEGER NOT NULL,
  description TEXT,
  icon_name VARCHAR,
  color VARCHAR DEFAULT '#3B82F6',
  external_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fechas bloqueadas
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  date DATE NOT NULL,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de precios especiales
CREATE TABLE IF NOT EXISTS special_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  date DATE NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de agentes de propiedades
CREATE TABLE IF NOT EXISTS property_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  agent_id UUID REFERENCES agents(id),
  role VARCHAR DEFAULT 'agent',
  commission_percentage NUMERIC DEFAULT 0.00,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA DE RESERVAS
-- =====================================================

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  guest_name VARCHAR NOT NULL,
  guest_email VARCHAR NOT NULL,
  guest_phone VARCHAR,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER DEFAULT 1,
  total_price NUMERIC NOT NULL,
  message TEXT,
  source VARCHAR DEFAULT 'landing_page',
  user_id TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nights INTEGER,
  notes TEXT
);

-- Tabla de alquileres de temporada
CREATE TABLE IF NOT EXISTS season_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  guest_name VARCHAR NOT NULL,
  guest_email VARCHAR NOT NULL,
  guest_phone VARCHAR,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests_count INTEGER DEFAULT 1,
  monthly_price NUMERIC NOT NULL,
  total_months INTEGER NOT NULL,
  total_price NUMERIC NOT NULL,
  message TEXT,
  source VARCHAR DEFAULT 'landing_page',
  user_id TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EXPERIENCIAS TURÍSTICAS
-- =====================================================

-- Tabla de experiencias
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('Actividad Turística', 'Gastronómica', 'Deportiva', 'greenfees')),
  description TEXT,
  external_url VARCHAR,
  price NUMERIC,
  photos TEXT[],
  what_is_included TEXT,
  what_is_needed TEXT,
  featured BOOLEAN DEFAULT false,
  recurring_dates JSONB,
  location VARCHAR,
  duration_hours INTEGER,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  region VARCHAR
);

-- Tabla de reservas de experiencias
CREATE TABLE IF NOT EXISTS experience_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID REFERENCES experiences(id),
  user_id UUID REFERENCES users(id),
  guest_name VARCHAR NOT NULL,
  guest_email VARCHAR NOT NULL,
  guest_phone VARCHAR,
  participants INTEGER DEFAULT 1 CHECK (participants > 0),
  preferred_date DATE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de favoritos de experiencias
CREATE TABLE IF NOT EXISTS experience_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL,
  experience_id UUID REFERENCES experiences(id)
);

-- Tabla de favoritos de propiedades
CREATE TABLE IF NOT EXISTS property_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL,
  property_id UUID REFERENCES properties(id),
  UNIQUE(user_id, property_id)
);

-- Tabla de disponibilidad de experiencias
CREATE TABLE IF NOT EXISTS experience_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  experience_id UUID REFERENCES experiences(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_available BOOLEAN DEFAULT true,
  start_time TIME DEFAULT '09:00:00',
  end_time TIME DEFAULT '18:00:00',
  max_participants INTEGER DEFAULT 10,
  price_modifier NUMERIC DEFAULT 1.00,
  notes TEXT
);

-- =====================================================
-- SISTEMA DE MENSAJERÍA
-- =====================================================

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  recipient_type VARCHAR NOT NULL CHECK (recipient_type IN ('users', 'guests', 'agents', 'owners', 'agencies')),
  subject VARCHAR,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REDES SOCIALES
-- =====================================================

-- Tabla de categorías sociales
CREATE TABLE IF NOT EXISTS social_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR DEFAULT '#3B82F6',
  icon_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de posts sociales
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id TEXT,
  author_name VARCHAR NOT NULL,
  author_avatar TEXT,
  category_id INTEGER REFERENCES social_categories(id),
  content TEXT NOT NULL,
  image_url TEXT,
  location VARCHAR,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de likes sociales
CREATE TABLE IF NOT EXISTS social_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social_posts(id),
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comentarios sociales
CREATE TABLE IF NOT EXISTS social_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES social_posts(id),
  author_id TEXT,
  author_name VARCHAR NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA DE NOTIFICACIONES
-- =====================================================

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('booking_change', 'social_post', 'booking_status', 'system')),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  related_type VARCHAR,
  is_read BOOLEAN DEFAULT false,
  icon VARCHAR,
  color VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONFIGURACIÓN ICAL
-- =====================================================

-- Tabla de configuración ICAL
CREATE TABLE IF NOT EXISTS ical_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('import', 'export')),
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_interval INTEGER DEFAULT 24 CHECK (sync_interval >= 1 AND sync_interval <= 168),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SISTEMA DE TESTIMONIOS
-- =====================================================

-- Tabla de testimonios
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  avatar TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES Y OPTIMIZACIONES
-- =====================================================

-- Índices para propiedades
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Índices para experiencias
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_featured ON experiences(featured);

-- Índices para servicios cercanos
CREATE INDEX IF NOT EXISTS idx_nearby_services_property_id ON nearby_services(property_id);
CREATE INDEX IF NOT EXISTS idx_nearby_services_type ON nearby_services(service_type);

-- Índices para testimonios
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating DESC);

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nearby_services_updated_at BEFORE UPDATE ON nearby_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Insertar categorías sociales por defecto
INSERT INTO social_categories (name, slug, description, color, icon_name) VALUES
  ('Noticias', 'noticias', 'Últimas noticias del sector inmobiliario', '#3B82F6', 'newspaper'),
  ('Consejos', 'consejos', 'Consejos para propietarios e inquilinos', '#10B981', 'lightbulb'),
  ('Ofertas', 'ofertas', 'Ofertas especiales y promociones', '#F59E0B', 'tag'),
  ('Eventos', 'eventos', 'Eventos y actividades relacionadas', '#EC4899', 'calendar');

-- Insertar testimonios de ejemplo
INSERT INTO testimonials (name, role, content, rating, location) VALUES
  ('María García', 'Inquilina de Temporada', 'La experiencia fue increíble. La propiedad superó todas nuestras expectativas y el proceso de reserva fue muy sencillo. Definitivamente volveremos el próximo año.', 5, 'Madrid, España'),
  ('Carlos Rodríguez', 'Familia Vacacional', 'Perfecto para nuestras vacaciones familiares. La casa tenía todo lo necesario y la ubicación era ideal para explorar la zona. Muy recomendable.', 5, 'Barcelona, España'),
  ('Ana Martínez', 'Profesional Remoto', 'Trabajé desde la propiedad durante 3 meses y fue excelente. Conexión WiFi perfecta, ambiente tranquilo y todas las comodidades necesarias.', 5, 'Valencia, España');

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================

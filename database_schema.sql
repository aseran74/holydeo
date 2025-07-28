-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA SISTEMA DE PROPIEDADES
-- =====================================================

-- Tabla de propiedades principales
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    price DECIMAL(10,2),
    price_weekday DECIMAL(10,2),
    price_weekend DECIMAL(10,2),
    monthly_price DECIMAL(10,2),
    bathrooms INTEGER DEFAULT 1,
    beds INTEGER DEFAULT 1,
    guests INTEGER DEFAULT 1,
    bedrooms INTEGER DEFAULT 1,
    amenities TEXT[], -- Array de strings para comodidades
    gallery TEXT[], -- Array de URLs de imágenes
    lat DECIMAL(10,8), -- Latitud
    lng DECIMAL(11,8), -- Longitud
    seasons TEXT[], -- Array de temporadas
    property_code VARCHAR(100),
    url VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    propietario_id UUID REFERENCES profiles(user_id),
    agency_id UUID REFERENCES profiles(user_id),
    agent_id UUID REFERENCES profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para fechas bloqueadas de propiedades
CREATE TABLE IF NOT EXISTS blocked_dates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    source VARCHAR(20) DEFAULT 'manual', -- 'manual' o 'ical'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para precios especiales por fecha
CREATE TABLE IF NOT EXISTS special_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para experiencias
CREATE TABLE IF NOT EXISTS experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Actividad Turística',
    external_url VARCHAR(500),
    price DECIMAL(10,2),
    description TEXT,
    what_is_included TEXT,
    what_is_needed TEXT,
    featured BOOLEAN DEFAULT false,
    photos TEXT[], -- Array de URLs de fotos
    recurring_dates JSONB, -- JSON para fechas recurrentes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para mensajes
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(user_id),
    recipient_id UUID NOT NULL,
    recipient_type VARCHAR(50) NOT NULL, -- 'agents', 'agencies', 'owners', 'clients'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para reservas
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES profiles(user_id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests_count INTEGER DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES profiles(user_id),
    booking_id UUID REFERENCES bookings(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =====================================================

-- Índices para propiedades
CREATE INDEX IF NOT EXISTS idx_properties_propietario_id ON properties(propietario_id);
CREATE INDEX IF NOT EXISTS idx_properties_agency_id ON properties(agency_id);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(lat, lng);

-- Índices para fechas bloqueadas
CREATE INDEX IF NOT EXISTS idx_blocked_dates_property_date ON blocked_dates(property_id, date);

-- Índices para precios especiales
CREATE INDEX IF NOT EXISTS idx_special_prices_property_date ON special_prices(property_id, date);

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Índices para mensajes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, recipient_type);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at 
    BEFORE UPDATE ON experiences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para propiedades (lectura pública, escritura solo para propietarios/agentes)
CREATE POLICY "Propiedades visibles públicamente" ON properties FOR SELECT USING (true);
CREATE POLICY "Propietarios pueden editar sus propiedades" ON properties FOR UPDATE USING (auth.uid() = propietario_id);
CREATE POLICY "Agentes pueden editar propiedades de su agencia" ON properties FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Usuarios autenticados pueden crear propiedades" ON properties FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas para reservas
CREATE POLICY "Usuarios pueden ver sus propias reservas" ON bookings FOR SELECT USING (auth.uid() = guest_id);
CREATE POLICY "Propietarios pueden ver reservas de sus propiedades" ON bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties WHERE properties.id = bookings.property_id AND properties.propietario_id = auth.uid())
);
CREATE POLICY "Usuarios autenticados pueden crear reservas" ON bookings FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- =====================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =====================================================

-- Insertar algunas propiedades de ejemplo
INSERT INTO properties (title, description, address, price, price_weekday, price_weekend, bathrooms, beds, guests, bedrooms, amenities, featured) VALUES
('Apartamento de lujo en el centro', 'Hermoso apartamento con vistas al mar', 'Calle Mayor 123, Madrid', 150.00, 120.00, 180.00, 2, 2, 4, 2, ARRAY['Piscina', 'Terraza', 'Aire Acond.'], true),
('Casa rural con jardín', 'Casa tradicional en el campo', 'Camino Rural 45, Toledo', 80.00, 70.00, 100.00, 1, 3, 6, 2, ARRAY['Jardín', 'Garaje', 'Vistas al mar'], false),
('Estudio moderno en la playa', 'Estudio completamente equipado', 'Avenida del Mar 78, Málaga', 95.00, 85.00, 120.00, 1, 1, 2, 1, ARRAY['Terraza', 'Ascensor', 'Lujo'], true);

-- Insertar algunas experiencias de ejemplo
INSERT INTO experiences (name, category, price, description, featured) VALUES
('Tour por el casco histórico', 'Actividad Turística', 25.00, 'Recorrido guiado por los monumentos más importantes', true),
('Cena en restaurante local', 'Gastronómica', 45.00, 'Cena tradicional con productos locales', false),
('Clase de surf', 'Deportiva', 60.00, 'Clase de surf para principiantes', true); 
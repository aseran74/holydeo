-- Crear tabla de testimonios
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

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating DESC);

-- Crear bucket de storage para avatares si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas RLS para la tabla testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de testimonios
CREATE POLICY "Allow public read access to testimonials" ON testimonials
  FOR SELECT USING (true);

-- Política para permitir inserción solo a usuarios autenticados
CREATE POLICY "Allow authenticated users to insert testimonials" ON testimonials
  FOR INSERT WITH AUTHENTICATED (true);

-- Política para permitir actualización solo a usuarios autenticados
CREATE POLICY "Allow authenticated users to update testimonials" ON testimonials
  FOR UPDATE WITH AUTHENTICATED (true);

-- Política para permitir eliminación solo a usuarios autenticados
CREATE POLICY "Allow authenticated users to delete testimonials" ON testimonials
  FOR DELETE WITH AUTHENTICATED (true);

-- Insertar algunos testimonios de ejemplo
INSERT INTO testimonials (name, role, content, rating, location) VALUES
  (
    'María García',
    'Inquilina de Temporada',
    'La experiencia fue increíble. La propiedad superó todas nuestras expectativas y el proceso de reserva fue muy sencillo. Definitivamente volveremos el próximo año.',
    5,
    'Madrid, España'
  ),
  (
    'Carlos Rodríguez',
    'Familia Vacacional',
    'Perfecto para nuestras vacaciones familiares. La casa tenía todo lo necesario y la ubicación era ideal para explorar la zona. Muy recomendable.',
    5,
    'Barcelona, España'
  ),
  (
    'Ana Martínez',
    'Profesional Remoto',
    'Trabajé desde la propiedad durante 3 meses y fue excelente. Conexión WiFi perfecta, ambiente tranquilo y todas las comodidades necesarias.',
    5,
    'Valencia, España'
  );

-- Crear función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar automáticamente updated_at
CREATE TRIGGER update_testimonials_updated_at 
  BEFORE UPDATE ON testimonials 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

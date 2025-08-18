-- Crear tabla de perfiles para información de contacto
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'guest',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública de perfiles
CREATE POLICY "Allow public read access to profiles" ON public.profiles
  FOR SELECT USING (true);

-- Política para permitir inserción de perfiles
CREATE POLICY "Allow insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Política para permitir actualización de perfiles
CREATE POLICY "Allow update for own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

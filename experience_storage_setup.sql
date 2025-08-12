-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA IMÁGENES DE EXPERIENCIAS
-- =====================================================

-- Crear el bucket para imágenes de experiencias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'experience',
  'experience',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Política para permitir subida de archivos a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden subir imágenes de experiencias" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'experience' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir lectura pública de imágenes de experiencias
CREATE POLICY "Lectura pública de imágenes de experiencias" ON storage.objects
FOR SELECT USING (
  bucket_id = 'experience'
);

-- Política para permitir actualización de archivos a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden actualizar imágenes de experiencias" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'experience' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir eliminación de archivos a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes de experiencias" ON storage.objects
FOR DELETE USING (
  bucket_id = 'experience' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- POLÍTICAS RLS PARA LA TABLA experiences
-- =====================================================

-- Habilitar RLS en la tabla experiences si no está habilitado
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública de experiencias
CREATE POLICY "Lectura pública de experiencias" ON experiences
FOR SELECT USING (true);

-- Política para inserción por usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden crear experiencias" ON experiences
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para actualización por usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden actualizar experiencias" ON experiences
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para eliminación por usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden eliminar experiencias" ON experiences
FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- VERIFICACIÓN DE CONFIGURACIÓN
-- =====================================================

-- Verificar que el bucket se creó correctamente
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'experience';

-- Verificar las políticas del storage
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%experiencias%';

-- Verificar las políticas de la tabla experiences
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'experiences';

-- Verificar que RLS está habilitado en experiences
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'experiences';

-- Verificar datos de experiencias
SELECT 
  id,
  name,
  photos,
  created_at
FROM experiences
ORDER BY created_at DESC
LIMIT 5;

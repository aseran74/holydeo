-- =====================================================
-- REPARACIÓN COMPLETA DEL BUCKET "experience"
-- =====================================================

-- 1. ELIMINAR BUCKET EXISTENTE SI HAY PROBLEMAS
-- DROP POLICY IF EXISTS "Lectura pública de imágenes de experiencias" ON storage.objects;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes de experiencias" ON storage.objects;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar imágenes de experiencias" ON storage.objects;
-- DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar imágenes de experiencias" ON storage.objects;

-- 2. CREAR BUCKET "experience" DESDE CERO
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'experience',
  'experience',
  true, -- IMPORTANTE: Debe ser público para lectura
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

-- 3. POLÍTICAS PARA LECTURA PÚBLICA (IMPORTANTE PARA MOSTRAR IMÁGENES)
CREATE POLICY IF NOT EXISTS "Lectura pública de imágenes de experiencias" ON storage.objects
FOR SELECT USING (
  bucket_id = 'experience'
);

-- 4. POLÍTICAS PARA USUARIOS AUTENTICADOS
CREATE POLICY IF NOT EXISTS "Usuarios autenticados pueden subir imágenes de experiencias" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'experience' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Usuarios autenticados pueden actualizar imágenes de experiencias" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'experience' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Usuarios autenticados pueden eliminar imágenes de experiencias" ON storage.objects
FOR DELETE USING (
  bucket_id = 'experience' 
  AND auth.role() = 'authenticated'
);

-- 5. VERIFICAR QUE EL BUCKET SE CREÓ CORRECTAMENTE
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'experience';

-- 6. VERIFICAR QUE LAS POLÍTICAS ESTÁN CONFIGURADAS
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

-- 7. VERIFICAR QUE LA TABLA experiences TIENE DATOS
SELECT 
  id, 
  name, 
  photos,
  created_at
FROM experiences 
ORDER BY created_at DESC 
LIMIT 5;

-- 8. VERIFICAR QUE LAS FOTOS EN experiences TIENEN FORMATO CORRECTO
SELECT 
  id, 
  name, 
  photos,
  CASE 
    WHEN photos IS NULL THEN 'Sin fotos'
    WHEN array_length(photos, 1) = 0 THEN 'Array vacío'
    WHEN photos[1] LIKE 'http%' THEN 'URLs externas'
    ELSE 'Nombres de archivo (correcto)'
  END as tipo_fotos
FROM experiences 
WHERE photos IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- =====================================================
-- SOLUCIÓN PARA PROBLEMAS COMUNES
-- =====================================================

-- Si hay problemas con RLS, asegurarse de que esté habilitado
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Si hay problemas con autenticación, verificar que auth.uid() funcione
-- SELECT auth.uid(), auth.role();

-- =====================================================
-- PRUEBA DE ACCESO AL BUCKET
-- =====================================================

-- Esta consulta debería funcionar si todo está configurado correctamente
-- (Ejecutar desde la aplicación, no desde SQL)
/*
const { data, error } = await supabase.storage
  .from('experience')
  .list('', { limit: 10 });

console.log('Archivos en bucket:', data);
console.log('Error si existe:', error);
*/

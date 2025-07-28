-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA IMÁGENES DE PROPIEDADES
-- =====================================================

-- Crear el bucket para imágenes de propiedades
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Política para permitir subida de archivos a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir lectura pública de imágenes
CREATE POLICY "Lectura pública de imágenes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'property-images'
);

-- Política para permitir actualización de archivos a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden actualizar imágenes" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir eliminación de archivos a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Crear bucket para fotos de perfil si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Políticas para fotos de perfil
CREATE POLICY "Usuarios autenticados pueden subir fotos de perfil" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Lectura pública de fotos de perfil" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-photos'
);

CREATE POLICY "Usuarios autenticados pueden actualizar fotos de perfil" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Usuarios autenticados pueden eliminar fotos de perfil" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos' 
  AND auth.role() = 'authenticated'
);

-- Verificar que los buckets se crearon correctamente
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id IN ('property-images', 'profile-photos'); 
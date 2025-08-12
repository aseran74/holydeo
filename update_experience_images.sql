-- Script para actualizar las experiencias existentes para usar imágenes de Supabase
-- en lugar de URLs externas de Unsplash

-- Primero, vamos a ver las experiencias que tienen URLs externas
SELECT 
  id, 
  name, 
  photos,
  created_at
FROM experiences 
WHERE photos IS NOT NULL 
  AND array_length(photos, 1) > 0 
  AND photos[1] LIKE 'http%'
ORDER BY created_at DESC;

-- Actualizar la primera experiencia para usar una imagen de Supabase
UPDATE experiences 
SET photos = ARRAY['experience_1754859972090_21d505.webp']
WHERE id = (
  SELECT id FROM experiences 
  WHERE photos IS NOT NULL 
    AND array_length(photos, 1) > 0 
    AND photos[1] LIKE 'http%'
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Actualizar la segunda experiencia para usar otra imagen de Supabase
UPDATE experiences 
SET photos = ARRAY['experience_1754843406044_nyj41r.webp']
WHERE id = (
  SELECT id FROM experiences 
  WHERE photos IS NOT NULL 
    AND array_length(photos, 1) > 0 
    AND photos[1] LIKE 'http%'
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Actualizar la tercera experiencia para usar otra imagen de Supabase
UPDATE experiences 
SET photos = ARRAY['experience_1754843184410_5k9vzf.webp']
WHERE id = (
  SELECT id FROM experiences 
  WHERE photos IS NOT NULL 
    AND array_length(photos, 1) > 0 
    AND photos[1] LIKE 'http%'
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Actualizar la cuarta experiencia para usar otra imagen de Supabase
UPDATE experiences 
SET photos = ARRAY['experience_1754843164487_k7j1bd.webp']
WHERE id = (
  SELECT id FROM experiences 
  WHERE photos IS NOT NULL 
    AND array_length(photos, 1) > 0 
    AND photos[1] LIKE 'http%'
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Verificar que las actualizaciones se realizaron correctamente
SELECT 
  id, 
  name, 
  photos,
  created_at
FROM experiences 
ORDER BY created_at DESC 
LIMIT 10;

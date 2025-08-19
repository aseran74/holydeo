-- Script para agregar la categoría "Últimas Ofertas" a la red social
-- Ejecutar este script en Supabase para crear la nueva categoría

-- Insertar la nueva categoría "Últimas Ofertas"
INSERT INTO social_categories (
  name,
  slug,
  description,
  color,
  icon_name,
  created_at,
  updated_at
) VALUES (
  'Últimas Ofertas',
  'ultimas-ofertas',
  'Publicaciones sobre ofertas especiales, descuentos y promociones',
  '#FF6B35', -- Color naranja para destacar ofertas
  'tag',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- Verificar que se haya insertado correctamente
SELECT * FROM social_categories WHERE slug = 'ultimas-ofertas';

-- Mostrar todas las categorías existentes
SELECT id, name, slug, color FROM social_categories ORDER BY name;

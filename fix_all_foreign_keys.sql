-- Script completo para corregir TODAS las referencias de clave foránea
-- Ejecutar en el SQL Editor de Supabase

-- 1. Primero, cambiar la columna id de users de UUID a TEXT
ALTER TABLE users 
ALTER COLUMN id TYPE TEXT;

-- 2. Actualizar TODAS las referencias de clave foránea
-- Propiedades
ALTER TABLE properties 
ALTER COLUMN owner_id TYPE TEXT;

-- Reservas
ALTER TABLE bookings 
ALTER COLUMN user_id TYPE TEXT;

-- Mensajes
ALTER TABLE messages 
ALTER COLUMN sender_id TYPE TEXT;
ALTER TABLE messages 
ALTER COLUMN receiver_id TYPE TEXT;

-- Experiencias
ALTER TABLE experiences 
ALTER COLUMN owner_id TYPE TEXT;

-- Reseñas
ALTER TABLE reviews 
ALTER COLUMN reviewer_id TYPE TEXT;

-- Posts sociales
ALTER TABLE social_posts 
ALTER COLUMN author_id TYPE TEXT;

-- Likes de posts
ALTER TABLE post_likes 
ALTER COLUMN user_id TYPE TEXT;

-- Comentarios de posts
ALTER TABLE post_comments 
ALTER COLUMN author_id TYPE TEXT;

-- Notificaciones
ALTER TABLE notifications 
ALTER COLUMN user_id TYPE TEXT;

-- 3. Verificar que todos los cambios se aplicaron
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  c.data_type as foreign_key_type
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  JOIN information_schema.columns c
    ON c.table_name = ccu.table_name 
    AND c.column_name = ccu.column_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name = 'users';

-- 4. Verificar que la tabla users tiene el tipo correcto
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'id';

-- 5. Verificar que los datos existentes se mantuvieron
SELECT id, email, role, full_name FROM users LIMIT 5;

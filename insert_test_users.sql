-- Script para insertar usuarios de prueba en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Insertar usuarios de prueba
INSERT INTO users (id, full_name, email, role, created_at) VALUES
(
  gen_random_uuid(),
  'Juan Pérez',
  'juan.perez@example.com',
  'admin',
  NOW()
),
(
  gen_random_uuid(),
  'María García',
  'maria.garcia@example.com',
  'user',
  NOW()
),
(
  gen_random_uuid(),
  'Carlos López',
  'carlos.lopez@example.com',
  'user',
  NOW()
),
(
  gen_random_uuid(),
  'Ana Martínez',
  'ana.martinez@example.com',
  'agent',
  NOW()
),
(
  gen_random_uuid(),
  'Luis Rodríguez',
  'luis.rodriguez@example.com',
  'owner',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT id, full_name, email, role FROM users ORDER BY created_at DESC LIMIT 10;

-- Insertar algunos mensajes de prueba (solo si hay usuarios)
INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
SELECT 
  (SELECT id FROM users WHERE email = 'juan.perez@example.com'),
  (SELECT id FROM users WHERE email = 'maria.garcia@example.com'),
  'users',
  'Bienvenido al sistema',
  '¡Hola María! Bienvenida a nuestra plataforma de gestión de propiedades.'
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'juan.perez@example.com')
  AND EXISTS (SELECT 1 FROM users WHERE email = 'maria.garcia@example.com');

INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
SELECT 
  (SELECT id FROM users WHERE email = 'maria.garcia@example.com'),
  (SELECT id FROM users WHERE email = 'juan.perez@example.com'),
  'users',
  'Consulta sobre reserva',
  'Hola Juan, me gustaría hacer una consulta sobre la reserva de la próxima semana.'
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'maria.garcia@example.com')
  AND EXISTS (SELECT 1 FROM users WHERE email = 'juan.perez@example.com');

-- Verificar mensajes
SELECT 
  m.id,
  m.subject,
  m.content,
  sender.full_name as sender_name,
  recipient.full_name as recipient_name,
  m.created_at
FROM messages m
JOIN users sender ON m.sender_id = sender.id
JOIN users recipient ON m.recipient_id = recipient.id
ORDER BY m.created_at DESC; 
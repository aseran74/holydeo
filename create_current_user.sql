-- Script para crear un usuario que coincida con el email de Firebase
-- IMPORTANTE: Cambia 'tu.email@ejemplo.com' por tu email real de Firebase

-- Insertar usuario que coincida con tu email de Firebase
INSERT INTO users (id, full_name, email, role, created_at) VALUES
(
  gen_random_uuid(),
  'Usuario Actual',
  'tu.email@ejemplo.com',  -- CAMBIA ESTO POR TU EMAIL REAL
  'admin',
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Verificar que se insertó correctamente
SELECT 'Usuario creado:' as info;
SELECT id, full_name, email, role FROM users WHERE email = 'tu.email@ejemplo.com';

-- Insertar algunos mensajes de prueba para este usuario
INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
SELECT 
  (SELECT id FROM users WHERE email = 'tu.email@ejemplo.com'),
  (SELECT id FROM users WHERE email = 'juan.perez@example.com'),
  'users',
  'Mensaje de prueba',
  'Este es un mensaje de prueba para verificar que el sistema funciona.'
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'tu.email@ejemplo.com')
  AND EXISTS (SELECT 1 FROM users WHERE email = 'juan.perez@example.com');

INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
SELECT 
  (SELECT id FROM users WHERE email = 'maria.garcia@example.com'),
  (SELECT id FROM users WHERE email = 'tu.email@ejemplo.com'),
  'users',
  'Respuesta de prueba',
  'Este es un mensaje de respuesta para verificar que puedes recibir mensajes.'
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'maria.garcia@example.com')
  AND EXISTS (SELECT 1 FROM users WHERE email = 'tu.email@ejemplo.com');

-- Verificar mensajes
SELECT 'Mensajes de prueba:' as info;
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
WHERE sender.email = 'tu.email@ejemplo.com' OR recipient.email = 'tu.email@ejemplo.com'
ORDER BY m.created_at DESC; 
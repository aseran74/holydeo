-- Script para verificar y configurar datos de prueba en messages

-- 1. Verificar la estructura de la tabla messages
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;

-- 2. Verificar si hay datos en la tabla
SELECT COUNT(*) as total_messages FROM messages;

-- 3. Verificar usuarios disponibles para crear mensajes de prueba
SELECT id, full_name, email FROM users LIMIT 5;

-- 4. Insertar datos de prueba (ejecutar solo si hay usuarios)
-- Descomenta las siguientes líneas si hay usuarios en la tabla users:

-- INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
-- SELECT 
--     (SELECT id FROM users LIMIT 1), 
--     (SELECT id FROM users LIMIT 1 OFFSET 1), 
--     'users', 
--     'Bienvenido al sistema', 
--     '¡Hola! Bienvenido a nuestra plataforma de gestión de propiedades.'
-- WHERE EXISTS (SELECT 1 FROM users LIMIT 2);

-- INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
-- SELECT 
--     (SELECT id FROM users LIMIT 1 OFFSET 1), 
--     (SELECT id FROM users LIMIT 1), 
--     'users', 
--     'Consulta sobre reserva', 
--     'Me gustaría hacer una consulta sobre la reserva de la próxima semana.'
-- WHERE EXISTS (SELECT 1 FROM users LIMIT 2); 
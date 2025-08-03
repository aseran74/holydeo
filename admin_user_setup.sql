-- =====================================================
-- SCHEMA SQL PARA CONFIGURAR USUARIOS ADMINISTRADORES
-- =====================================================

-- Verificar si el usuario existe
SELECT id, email, role FROM users WHERE email = 'alvaroserr@gmail.com';

-- Insertar el usuario alvaroserr@gmail.com como administrador
INSERT INTO users (id, email, full_name, role, created_at)
VALUES (
  gen_random_uuid(),
  'alvaroserr@gmail.com',
  'Álvaro Serrano',
  'admin',
  NOW()
);

-- Verificar que el usuario se creó correctamente
SELECT id, email, full_name, role, created_at FROM users WHERE email = 'alvaroserr@gmail.com';

-- =====================================================
-- COMANDOS ADICIONALES PARA GESTIÓN DE USUARIOS
-- =====================================================

-- Listar todos los usuarios administradores
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE role = 'admin' 
ORDER BY created_at DESC;

-- Actualizar rol de un usuario existente a administrador
-- UPDATE users 
-- SET role = 'admin' 
-- WHERE email = 'usuario@ejemplo.com';

-- Eliminar un usuario (cuidado: esto elimina permanentemente)
-- DELETE FROM users WHERE email = 'usuario@ejemplo.com';

-- =====================================================
-- ESTRUCTURA DE LA TABLA USERS
-- =====================================================

/*
Tabla: users
- id: UUID (clave primaria)
- email: TEXT (único, no nulo)
- full_name: TEXT (opcional)
- role: TEXT (no nulo, valores válidos: 'admin', 'agency', 'agent', 'owner', 'guest')
- agency_id: UUID (opcional, referencia a agencies.id)
- created_at: TIMESTAMP (automático)

Roles disponibles:
- 'admin': Administrador del sistema
- 'agency': Usuario de agencia
- 'agent': Agente inmobiliario
- 'owner': Propietario de propiedades
- 'guest': Huésped/cliente
*/

-- =====================================================
-- EJEMPLOS DE USUARIOS ADICIONALES
-- =====================================================

-- Crear otro usuario administrador
-- INSERT INTO users (id, email, full_name, role, created_at)
-- VALUES (
--   gen_random_uuid(),
--   'otroadmin@ejemplo.com',
--   'Otro Administrador',
--   'admin',
--   NOW()
-- );

-- Crear usuario de agencia
-- INSERT INTO users (id, email, full_name, role, agency_id, created_at)
-- VALUES (
--   gen_random_uuid(),
--   'agencia@ejemplo.com',
--   'Usuario Agencia',
--   'agency',
--   'uuid-de-la-agencia',
--   NOW()
-- );

-- =====================================================
-- VERIFICACIONES DE SEGURIDAD
-- =====================================================

-- Verificar que no hay usuarios duplicados
SELECT email, COUNT(*) as count
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Verificar roles válidos
SELECT DISTINCT role FROM users ORDER BY role;

-- Contar usuarios por rol
SELECT role, COUNT(*) as total_users
FROM users 
GROUP BY role 
ORDER BY total_users DESC; 
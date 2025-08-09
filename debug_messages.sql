-- Script para verificar el estado actual de la base de datos
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Verificar si hay usuarios
SELECT 'USUARIOS:' as info;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT id, full_name, email, role FROM users LIMIT 5;

-- 2. Verificar si hay mensajes
SELECT 'MENSAJES:' as info;
SELECT COUNT(*) as total_mensajes FROM messages;
SELECT 
  m.id,
  m.sender_id,
  m.recipient_id,
  m.subject,
  m.content,
  m.created_at,
  sender.full_name as sender_name,
  recipient.full_name as recipient_name
FROM messages m
LEFT JOIN users sender ON m.sender_id = sender.id
LEFT JOIN users recipient ON m.recipient_id = recipient.id
ORDER BY m.created_at DESC
LIMIT 5;

-- 3. Verificar la estructura de la tabla messages
SELECT 'ESTRUCTURA TABLA MESSAGES:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;

-- 4. Verificar políticas RLS
SELECT 'POLÍTICAS RLS:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'messages'; 
-- Migración segura para actualizar la tabla messages
-- Esta migración maneja casos donde los objetos ya existen

-- Agregar campos faltantes a la tabla messages (solo si no existen)
DO $$ 
BEGIN
    -- Agregar subject si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'subject') THEN
        ALTER TABLE messages ADD COLUMN subject VARCHAR(255) DEFAULT 'Sin asunto';
    END IF;
    
    -- Agregar is_read si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'is_read') THEN
        ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT false;
    END IF;
    
    -- Agregar updated_at si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'messages' AND column_name = 'updated_at') THEN
        ALTER TABLE messages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Crear índice para optimizar consultas de mensajes no leídos (solo si no existe)
CREATE INDEX IF NOT EXISTS idx_messages_recipient_unread ON messages(recipient_id, is_read);

-- Crear trigger para actualizar updated_at automáticamente (solo si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_messages_updated_at') THEN
        CREATE TRIGGER update_messages_updated_at
            BEFORE UPDATE ON messages
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Eliminar políticas existentes si las hay (para evitar duplicados)
DROP POLICY IF EXISTS "Usuarios pueden ver mensajes enviados y recibidos" ON messages;
DROP POLICY IF EXISTS "Usuarios autenticados pueden enviar mensajes" ON messages;
DROP POLICY IF EXISTS "Usuarios pueden marcar sus mensajes como leídos" ON messages;

-- Crear políticas RLS para mensajes
CREATE POLICY "Usuarios pueden ver mensajes enviados y recibidos" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = recipient_id
    );

CREATE POLICY "Usuarios autenticados pueden enviar mensajes" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Usuarios pueden marcar sus mensajes como leídos" ON messages
    FOR UPDATE USING (auth.uid() = recipient_id);

-- Insertar datos de ejemplo solo si la tabla está vacía
INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000'::uuid, 
    '550e8400-e29b-41d4-a716-446655440001'::uuid, 
    'users', 
    'Bienvenido', 
    '¡Hola! Bienvenido a nuestra plataforma.'
WHERE NOT EXISTS (SELECT 1 FROM messages LIMIT 1);

INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
SELECT 
    '550e8400-e29b-41d4-a716-446655440001'::uuid, 
    '550e8400-e29b-41d4-a716-446655440000'::uuid, 
    'users', 
    'Consulta sobre reserva', 
    'Me gustaría hacer una consulta sobre la reserva.'
WHERE NOT EXISTS (SELECT 1 FROM messages LIMIT 1);

INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content)
SELECT 
    '550e8400-e29b-41d4-a716-446655440000'::uuid, 
    '550e8400-e29b-41d4-a716-446655440002'::uuid, 
    'guests', 
    'Confirmación de reserva', 
    'Su reserva ha sido confirmada exitosamente.'
WHERE NOT EXISTS (SELECT 1 FROM messages LIMIT 1); 
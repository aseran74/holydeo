-- Migración para actualizar la tabla messages
-- Agregar campos necesarios para el sistema de mensajería

-- Agregar campos faltantes a la tabla messages
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT 'Sin asunto',
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear índice para optimizar consultas de mensajes no leídos
CREATE INDEX IF NOT EXISTS idx_messages_recipient_unread ON messages(recipient_id, is_read);

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS para mensajes
CREATE POLICY "Usuarios pueden ver mensajes enviados y recibidos" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = recipient_id
    );

CREATE POLICY "Usuarios autenticados pueden enviar mensajes" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Usuarios pueden marcar sus mensajes como leídos" ON messages
    FOR UPDATE USING (auth.uid() = recipient_id);

-- Datos de ejemplo para testing
INSERT INTO messages (sender_id, recipient_id, recipient_type, subject, content) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'users', 'Bienvenido', '¡Hola! Bienvenido a nuestra plataforma.'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'users', 'Consulta sobre reserva', 'Me gustaría hacer una consulta sobre la reserva.'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'guests', 'Confirmación de reserva', 'Su reserva ha sido confirmada exitosamente.'); 
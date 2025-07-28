-- =====================================================
-- CONFIGURACIÓN DE TABLA ICAL_CONFIGS
-- =====================================================

-- Crear tabla para configuraciones iCal
CREATE TABLE IF NOT EXISTS ical_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'manual' CHECK (type IN ('airbnb', 'booking', 'vrbo', 'manual', 'other')),
    enabled BOOLEAN DEFAULT true,
    sync_frequency VARCHAR(20) DEFAULT 'daily' CHECK (sync_frequency IN ('hourly', 'daily', 'weekly')),
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_ical_configs_property_id ON ical_configs(property_id);
CREATE INDEX IF NOT EXISTS idx_ical_configs_enabled ON ical_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_ical_configs_type ON ical_configs(type);

-- Habilitar RLS
ALTER TABLE ical_configs ENABLE ROW LEVEL SECURITY;

-- Políticas para ical_configs
CREATE POLICY "Propietarios pueden gestionar configuraciones iCal de sus propiedades" ON ical_configs
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = ical_configs.property_id 
        AND properties.propietario_id = auth.uid()
    )
);

CREATE POLICY "Agentes pueden gestionar configuraciones iCal de propiedades de su agencia" ON ical_configs
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM properties 
        WHERE properties.id = ical_configs.property_id 
        AND properties.agent_id = auth.uid()
    )
);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_ical_configs_updated_at 
    BEFORE UPDATE ON ical_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunas configuraciones de ejemplo
INSERT INTO ical_configs (property_id, name, url, type, sync_frequency) VALUES
(
    (SELECT id FROM properties LIMIT 1),
    'Airbnb Calendar',
    'https://calendar.google.com/calendar/ical/example%40gmail.com/public/basic.ics',
    'airbnb',
    'daily'
),
(
    (SELECT id FROM properties LIMIT 1),
    'Booking.com Calendar',
    'https://calendar.google.com/calendar/ical/example%40gmail.com/public/basic.ics',
    'booking',
    'hourly'
)
ON CONFLICT DO NOTHING;

-- Verificar que la tabla se creó correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'ical_configs'
ORDER BY ordinal_position; 
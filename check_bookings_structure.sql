-- Verificar la estructura real de la tabla bookings
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Ver algunos registros de ejemplo
SELECT * FROM bookings LIMIT 3;

-- Verificar si existe la columna user_id
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'user_id'
) as has_user_id;

-- Verificar si existe la columna guest_id
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'guest_id'
) as has_guest_id;

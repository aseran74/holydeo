-- Datos de prueba para la tabla experiences
-- Insertar 20 experiencias de prueba

INSERT INTO experiences (name, category, description, price, location, duration_hours, max_participants, photos, what_is_included, what_is_needed, featured, external_url, recurring_dates) VALUES

-- Experiencias Gastronómicas
('Ruta de Tapas por el Casco Antiguo', 'Gastronómica', 'Descubre los mejores bares de tapas del casco antiguo con un guía local. Degusta las tapas más auténticas mientras conoces la historia de la ciudad.', 45.00, 'Sevilla', 3, 8, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=800'], 'Tapas incluidas en 4 bares, Guía local experto, Bebida en cada parada, Historia y anécdotas locales', 'Ropa cómoda, Ganas de disfrutar, Apetito', true, 'https://example.com/tapas-sevilla', '{"type": "weekly", "days": ["Lunes", "Miércoles", "Viernes", "Sábado"]}'),

('Clase de Paella Valenciana', 'Gastronómica', 'Aprende a cocinar la auténtica paella valenciana con un chef local. Desde la selección de ingredientes hasta el punto perfecto de cocción.', 65.00, 'Valencia', 4, 6, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=800'], 'Todos los ingredientes, Paellera individual, Delantal y utensilios, Degustación completa, Receta por escrito', 'Ropa cómoda, Ganas de aprender', false, NULL, '{"type": "specific", "dates": ["2024-02-15", "2024-02-22", "2024-03-01"]}'),

('Cata de Vinos en Bodega', 'Gastronómica', 'Visita una bodega centenaria y disfruta de una cata de vinos premium con un enólogo experto. Conoce el proceso de elaboración y los secretos del vino.', 85.00, 'La Rioja', 2, 12, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Visita a la bodega, Cata de 6 vinos, Quesos y embutidos, Guía enólogo, Certificado de cata', 'Ropa cómoda, Edad legal para beber', true, NULL, '{"type": "weekly", "days": ["Martes", "Jueves", "Sábado"]}'),

-- Experiencias Deportivas
('Paseo en Kayak por la Costa', 'Deportiva', 'Explora la costa desde una perspectiva única en kayak. Navega por calas secretas y disfruta de la naturaleza en estado puro.', 35.00, 'Costa Brava', 2, 10, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=800'], 'Kayak y remos, Chaleco salvavidas, Guía instructor, Seguro de actividad, Snack y agua', 'Bañador y toalla, Protector solar, Ropa de cambio', false, NULL, '{"type": "weekly", "days": ["Lunes", "Miércoles", "Viernes", "Domingo"]}'),

('Escalada en Montaña', 'Deportiva', 'Aprende las técnicas básicas de escalada en roca natural con instructores certificados. Disfruta de vistas espectaculares desde las cumbres.', 75.00, 'Sierra de Guadarrama', 6, 8, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Todo el equipo de escalada, Instructor certificado, Seguro de actividad, Transporte desde Madrid, Almuerzo', 'Ropa deportiva, Calzado de montaña, Mochila pequeña', true, NULL, '{"type": "specific", "dates": ["2024-02-10", "2024-02-17", "2024-02-24"]}'),

('Buceo en Islas Canarias', 'Deportiva', 'Explora los fondos marinos de las Islas Canarias. Descubre la rica biodiversidad marina en una de las mejores zonas de buceo de España.', 120.00, 'Lanzarote', 4, 6, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Equipo completo de buceo, Instructor PADI, Seguro de buceo, Certificado de inmersión, Fotos submarinas', 'Certificado médico, Experiencia básica de natación', false, NULL, '{"type": "weekly", "days": ["Martes", "Jueves", "Sábado"]}'),

-- Experiencias Turísticas
('Visita Guiada al Alhambra', 'Actividad Turística', 'Explora uno de los monumentos más importantes de España con un guía oficial. Descubre la historia, arquitectura y secretos del palacio nazarí.', 55.00, 'Granada', 3, 15, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1515669097368-22e68427d265?w=800'], 'Entrada al Alhambra, Guía oficial, Auriculares, Acceso a zonas restringidas, Historia detallada', 'Documento de identidad, Calzado cómodo', true, 'https://www.alhambra-patronato.es', '{"type": "weekly", "days": ["Lunes", "Miércoles", "Viernes", "Sábado", "Domingo"]}'),

('Paseo en Globo por Toledo', 'Actividad Turística', 'Vuela sobre la ciudad imperial en globo aerostático. Disfruta de vistas panorámicas únicas de Toledo y sus monumentos históricos.', 180.00, 'Toledo', 4, 8, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Vuelo en globo, Desayuno típico, Certificado de vuelo, Fotos profesionales, Transporte desde Madrid', 'Ropa cómoda, Calzado cerrado', false, NULL, '{"type": "specific", "dates": ["2024-02-12", "2024-02-19", "2024-02-26"]}'),

('Ruta de los Pueblos Blancos', 'Actividad Turística', 'Recorre los pueblos más pintorescos de Andalucía. Descubre la arquitectura tradicional, gastronomía local y paisajes únicos.', 95.00, 'Cádiz', 8, 12, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Transporte desde Sevilla, Guía local, Almuerzo típico, Visitas a 5 pueblos, Degustación de productos locales', 'Ropa cómoda, Cámara de fotos', true, NULL, '{"type": "weekly", "days": ["Martes", "Jueves", "Sábado"]}'),

('Visita Nocturna al Museo del Prado', 'Actividad Turística', 'Disfruta del Museo del Prado sin aglomeraciones en una visita nocturna exclusiva. Descubre las obras maestras con un experto en arte.', 70.00, 'Madrid', 2, 20, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Entrada nocturna, Guía experto en arte, Auriculares, Cava y canapés, Acceso a salas especiales', 'Ropa elegante casual, Documento de identidad', false, 'https://www.museodelprado.es', '{"type": "weekly", "days": ["Viernes", "Sábado"]}'),

-- Más Experiencias Gastronómicas
('Taller de Sushi Tradicional', 'Gastronómica', 'Aprende a preparar sushi auténtico con un chef japonés. Desde el arroz perfecto hasta el enrollado profesional.', 80.00, 'Barcelona', 3, 8, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Todos los ingredientes, Utensilios profesionales, Delantal, Degustación completa, Receta por escrito', 'Ropa cómoda, Ganas de aprender', false, NULL, '{"type": "weekly", "days": ["Lunes", "Miércoles", "Viernes"]}'),

('Cena en Cueva Flamenca', 'Gastronómica', 'Disfruta de una cena tradicional andaluza en una cueva flamenca auténtica. Música en vivo y ambiente único.', 65.00, 'Granada', 3, 25, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Cena completa, Espectáculo flamenco, Bebidas incluidas, Transporte desde el centro', 'Ropa elegante casual', true, NULL, '{"type": "weekly", "days": ["Martes", "Jueves", "Sábado"]}'),

('Ruta de Sidra Asturiana', 'Gastronómica', 'Visita las mejores sidrerías de Asturias y aprende sobre la elaboración tradicional de la sidra.', 45.00, 'Asturias', 4, 15, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Visita a 3 sidrerías, Degustación de sidras, Quesos asturianos, Guía local, Transporte', 'Ropa cómoda, Ganas de disfrutar', false, NULL, '{"type": "weekly", "days": ["Viernes", "Sábado"]}'),

-- Más Experiencias Deportivas
('Surf en Fuerteventura', 'Deportiva', 'Aprende a surfear en una de las mejores playas de Europa. Clases para todos los niveles con instructores certificados.', 60.00, 'Fuerteventura', 3, 8, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Tabla de surf, Traje de neopreno, Instructor certificado, Seguro de actividad, Certificado de clase', 'Bañador, Toalla, Protector solar', true, NULL, '{"type": "weekly", "days": ["Lunes", "Miércoles", "Viernes", "Sábado"]}'),

('Senderismo en Picos de Europa', 'Deportiva', 'Explora los senderos más espectaculares de los Picos de Europa con un guía de montaña experto.', 55.00, 'Asturias', 6, 12, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Guía de montaña, Seguro de actividad, Almuerzo de montaña, Transporte desde Oviedo', 'Calzado de montaña, Ropa técnica, Mochila', false, NULL, '{"type": "weekly", "days": ["Sábado", "Domingo"]}'),

('Paddle Surf en Marbella', 'Deportiva', 'Disfruta del paddle surf en las aguas cristalinas de Marbella. Actividad relajante y divertida para todos los niveles.', 40.00, 'Marbella', 2, 10, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Tabla y remo, Instructor, Chaleco salvavidas, Seguro de actividad, Fotos', 'Bañador, Toalla, Protector solar', false, NULL, '{"type": "weekly", "days": ["Martes", "Jueves", "Sábado", "Domingo"]}'),

-- Más Experiencias Turísticas
('Visita a Sagrada Familia', 'Actividad Turística', 'Descubre la obra maestra de Gaudí con acceso prioritario y guía experto. Conoce todos los detalles de esta maravilla arquitectónica.', 75.00, 'Barcelona', 2, 20, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Entrada prioritaria, Guía oficial, Auriculares, Acceso a torres, Historia detallada', 'Documento de identidad, Calzado cómodo', true, 'https://sagradafamilia.org', '{"type": "weekly", "days": ["Lunes", "Miércoles", "Viernes", "Sábado", "Domingo"]}'),

('Paseo en Barco por el Tajo', 'Actividad Turística', 'Navega por el río Tajo y disfruta de las mejores vistas de Toledo desde el agua. Experiencia única y relajante.', 35.00, 'Toledo', 1, 30, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Paseo en barco, Guía a bordo, Refrescos incluidos, Fotos del recorrido', 'Ropa cómoda, Cámara de fotos', false, NULL, '{"type": "weekly", "days": ["Martes", "Jueves", "Sábado", "Domingo"]}'),

('Ruta de Don Quijote', 'Actividad Turística', 'Sigue los pasos de Don Quijote por La Mancha. Visita molinos de viento, pueblos históricos y paisajes únicos.', 85.00, 'Ciudad Real', 8, 15, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Transporte desde Madrid, Guía experto, Almuerzo típico, Visitas a 4 pueblos, Degustación de productos', 'Ropa cómoda, Cámara de fotos', false, NULL, '{"type": "weekly", "days": ["Sábado"]}'),

('Visita Nocturna a la Mezquita', 'Actividad Turística', 'Explora la Mezquita-Catedral de Córdoba en una visita nocturna mágica. Luces especiales y ambiente único.', 50.00, 'Córdoba', 2, 25, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Entrada nocturna, Guía oficial, Auriculares, Iluminación especial, Historia detallada', 'Ropa elegante casual, Documento de identidad', true, 'https://mezquita-catedraldecordoba.es', '{"type": "weekly", "days": ["Viernes", "Sábado"]}'),

('Ruta de los Castillos', 'Actividad Turística', 'Recorre los castillos más impresionantes de España. Historia, arquitectura y paisajes espectaculares.', 120.00, 'Castilla y León', 10, 12, ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'], 'Transporte desde Madrid, Guía experto, Almuerzo, Visitas a 3 castillos, Entradas incluidas', 'Ropa cómoda, Calzado adecuado, Cámara de fotos', false, NULL, '{"type": "specific", "dates": ["2024-02-18", "2024-03-03", "2024-03-17"]}');

-- Actualizar algunas experiencias para que tengan fechas recurrentes más específicas
UPDATE experiences 
SET recurring_dates = '{"type": "weekly", "days": ["Lunes", "Miércoles", "Viernes", "Sábado"]}' 
WHERE name = 'Ruta de Tapas por el Casco Antiguo';

UPDATE experiences 
SET recurring_dates = '{"type": "specific", "dates": ["2024-02-15", "2024-02-22", "2024-03-01", "2024-03-08"]}' 
WHERE name = 'Clase de Paella Valenciana';

UPDATE experiences 
SET recurring_dates = '{"type": "weekly", "days": ["Martes", "Jueves", "Sábado"]}' 
WHERE name = 'Cata de Vinos en Bodega'; 
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const SimpleMapTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('🔍 Iniciando prueba de Google Maps...');
        
        const loader = new Loader({
          apiKey: 'AIzaSyBy4MuV_fOnPJF-WoxQbBlnKj8dMF6KuxM',
          version: 'weekly'
        });

        console.log('📡 Cargando Google Maps API...');
        const google = await loader.load();
        console.log('✅ Google Maps API cargada exitosamente');

        if (mapRef.current) {
          console.log('🗺️ Creando instancia del mapa...');
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 40.4168, lng: -3.7038 }, // Madrid
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          console.log('🎯 Mapa creado correctamente');
          
          // Agregar un marcador de prueba
          new google.maps.Marker({
            position: { lat: 40.4168, lng: -3.7038 },
            map: map,
            title: 'Madrid - Prueba'
          });

          console.log('📍 Marcador de prueba agregado');
        }
      } catch (error) {
        console.error('❌ Error en prueba de Google Maps:', error);
      }
    };

    initMap();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Prueba de Google Maps</h2>
      <div 
        ref={mapRef} 
        className="w-full h-96 bg-gray-200 rounded-lg border-2 border-dashed border-gray-400"
        style={{ minHeight: '400px' }}
      >
        <div className="h-full flex items-center justify-center text-gray-500">
          Cargando mapa de prueba...
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>🔍 Revisa la consola del navegador para ver los logs</p>
        <p>🗺️ Si funciona, deberías ver un mapa de Madrid con un marcador</p>
      </div>
    </div>
  );
};

export default SimpleMapTest;

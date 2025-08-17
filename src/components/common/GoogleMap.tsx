import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  location: string;
  className?: string;
  height?: string;
  zoom?: number;
  showMarker?: boolean;
  showInfoWindow?: boolean;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  location,
  className = "h-96",
  height = "h-96",
  zoom = 14,
  showMarker = true,
  showInfoWindow = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Inicializar el loader de Google Maps
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
          libraries: ['places']
        });

        // Cargar la API de Google Maps
        const google = await loader.load();

        if (!mapRef.current) return;

        // Crear el mapa
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 }, // Centro temporal
          zoom: zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(newMap);

        // Geocodificar la ubicación
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const place = results[0];
            const position = place.geometry.location;

            // Centrar el mapa en la ubicación
            newMap.setCenter(position);

            // Crear marcador si está habilitado
            if (showMarker) {
              const newMarker = new google.maps.Marker({
                position: position,
                map: newMap,
                title: location,
                animation: google.maps.Animation.DROP,
                icon: {
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="#3B82F6"/>
                      <circle cx="16" cy="16" r="8" fill="white"/>
                      <circle cx="16" cy="16" r="4" fill="#3B82F6"/>
                    </svg>
                  `),
                  scaledSize: new google.maps.Size(32, 32),
                  anchor: new google.maps.Point(16, 32)
                }
              });

              setMarker(newMarker);

              // Crear ventana de información si está habilitada
              if (showInfoWindow) {
                const newInfoWindow = new google.maps.InfoWindow({
                  content: `
                    <div class="p-3">
                      <h3 class="font-semibold text-gray-900 mb-1">${location}</h3>
                      <p class="text-sm text-gray-600">Ubicación de la experiencia</p>
                    </div>
                  `
                });

                setInfoWindow(newInfoWindow);

                // Mostrar ventana de información al hacer clic en el marcador
                newMarker.addListener('click', () => {
                  newInfoWindow.open(newMap, newMarker);
                });

                // Mostrar ventana de información automáticamente
                setTimeout(() => {
                  newInfoWindow.open(newMap, newMarker);
                }, 1000);
              }
            }

            // Ajustar zoom para mostrar el área completa
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(position);
            newMap.fitBounds(bounds);

            // Ajustar zoom si es muy amplio
            google.maps.event.addListenerOnce(newMap, 'bounds_changed', () => {
              const currentZoom = newMap.getZoom();
              if (currentZoom && currentZoom > 16) {
                newMap.setZoom(16);
              }
            });

          } else {
            console.error('Geocoding failed:', status);
            setError('No se pudo encontrar la ubicación en el mapa');
          }
        });

      } catch (err) {
        console.error('Error initializing Google Maps:', err);
        setError('Error al cargar el mapa');
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      initMap();
    }
  }, [location, zoom, showMarker, showInfoWindow]);

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (infoWindow) {
        infoWindow.close();
      }
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [infoWindow, marker]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Error al cargar el mapa</p>
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700`}>
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            📍 {location}
          </p>
        </div>
      </div>
      <div ref={mapRef} className={`${height} w-full`} />
    </div>
  );
};

export default GoogleMap;

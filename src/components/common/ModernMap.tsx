import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, OverlayView } from '@react-google-maps/api';
import { Property, Experience } from '../../types';
import { MapPin } from 'lucide-react';
import Minicard from './Minicard';

// Hook personalizado para cargar Google Maps una sola vez
const useGoogleMapsScript = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setLoadError(new Error('API Key no configurada'));
      return;
    }

    // Verificar si ya está cargado
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Cargar el script solo si no existe
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError(new Error('Error al cargar Google Maps'));
    };

    document.head.appendChild(script);

    return () => {
      // No remover el script para evitar recargas
    };
  }, [apiKey]);

  return { isLoaded, loadError };
};

interface ModernMapProps {
  properties: Property[];
  experiences: Experience[];
  onPropertyClick?: (property: Property) => void;
  onExperienceClick?: (experience: Experience) => void;
  className?: string;
}

const ModernMap: React.FC<ModernMapProps> = ({
  properties,
  experiences,
  onPropertyClick,
  onExperienceClick,
  className = ''
}) => {
  const [selectedItem, setSelectedItem] = useState<Property | Experience | null>(null);


  // Obtener API key desde variables de entorno
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Usar hook personalizado para cargar Google Maps
  const { isLoaded, loadError } = useGoogleMapsScript(GOOGLE_MAPS_API_KEY || '');

  // Coordenadas por defecto (centro de España)
  const defaultCenter = { lat: 40.4168, lng: -3.7038 };

  // Coordenadas hardcodeadas para ciudades españolas principales
  const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'madrid': { lat: 40.4168, lng: -3.7038 },
    'barcelona': { lat: 41.3851, lng: 2.1734 },
    'valencia': { lat: 39.4699, lng: -0.3763 },
    'sevilla': { lat: 37.3891, lng: -5.9845 },
    'bilbao': { lat: 43.2627, lng: -2.9253 },
    'malaga': { lat: 36.7213, lng: -4.4217 },
    'granada': { lat: 37.1765, lng: -3.5976 },
    'alicante': { lat: 38.3452, lng: -0.4815 },
    'cordoba': { lat: 37.8882, lng: -4.7794 },
    'valladolid': { lat: 41.6528, lng: -4.7236 },
    'vigo': { lat: 42.2406, lng: -8.7207 },
    'gijon': { lat: 43.5453, lng: -5.6619 },
    'oviedo': { lat: 43.3623, lng: -5.8493 },
    'santander': { lat: 43.4623, lng: -3.8099 },
    'san sebastian': { lat: 43.3223, lng: -1.9839 },
    'pamplona': { lat: 42.8169, lng: -1.6442 },
    'zaragoza': { lat: 41.6488, lng: -0.8891 },
    'murcia': { lat: 37.9922, lng: -1.1307 },
    'palma': { lat: 39.5696, lng: 2.6502 },
    'las palmas': { lat: 28.1235, lng: -15.4366 },
    'tenerife': { lat: 28.2916, lng: -16.6291 },
    'ibiza': { lat: 38.9089, lng: 1.4328 },
    'menorca': { lat: 39.8883, lng: 4.2644 },
    'mallorca': { lat: 39.6213, lng: 2.9834 },
    'formentera': { lat: 38.7055, lng: 1.4328 },
    'lanzarote': { lat: 28.9631, lng: -13.5478 },
    'fuerteventura': { lat: 28.2916, lng: -14.0059 },
    'la gomera': { lat: 28.0916, lng: -17.1133 },
    'el hierro': { lat: 27.8066, lng: -17.9155 },
    'la palma': { lat: 28.6595, lng: -17.8596 },
    'ceuta': { lat: 35.8894, lng: -5.3213 },
    'melilla': { lat: 35.2923, lng: -2.9381 }
  };

  // Función para obtener coordenadas de una ubicación
  const getCoordinates = useCallback((location: string): { lat: number; lng: number } => {
    if (!location) return defaultCenter;
    
    const normalizedLocation = location.toLowerCase().trim();
    
    // Buscar coincidencias exactas
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (normalizedLocation.includes(city) || city.includes(normalizedLocation)) {
        return coords;
      }
    }
    
    // Buscar coincidencias parciales
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (normalizedLocation.includes(city.substring(0, 4)) || city.includes(normalizedLocation.substring(0, 4))) {
        return coords;
      }
    }
    
    return defaultCenter;
  }, []);

  // Preparar datos del mapa
  const mapData = useMemo(() => {
    const items: Array<{
      id: string;
      type: 'property' | 'experience';
      data: Property | Experience;
      coordinates: { lat: number; lng: number };
    }> = [];

    // Agregar propiedades
    properties.forEach(property => {
      const coords = getCoordinates(property.location || '');
      items.push({
        id: `property-${property.id}`,
        type: 'property',
        data: property,
        coordinates: coords
      });
    });

    // Agregar experiencias
    experiences.forEach(experience => {
      const coords = getCoordinates(experience.location || '');
      items.push({
        id: `experience-${experience.id}`,
        type: 'experience',
        data: experience,
        coordinates: coords
      });
    });

    return items;
  }, [properties, experiences, getCoordinates]);

  // Calcular bounds del mapa
  const mapBounds = useMemo(() => {
    if (mapData.length === 0) return null;

    const lats = mapData.map(item => item.coordinates.lat);
    const lngs = mapData.map(item => item.coordinates.lng);

    return {
      north: Math.max(...lats) + 0.1,
      south: Math.min(...lats) - 0.1,
      east: Math.max(...lngs) + 0.1,
      west: Math.min(...lngs) - 0.1
    };
  }, [mapData]);

  // AGREGADO: Obtener coordenadas del item seleccionado para posicionar la minicard
  const selectedItemCoordinates = useMemo(() => {
    if (!selectedItem) return null;
    // Buscamos el item en nuestros datos ya calculados para no recalcular
    const data = mapData.find(item => item.data === selectedItem);
    return data ? data.coordinates : null;
  }, [selectedItem, mapData]);

  // Opciones del mapa
  const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  // Manejar clic en marcador
  const handleMarkerClick = useCallback((item: Property | Experience) => {
    setSelectedItem(item);
  }, []);

  // Manejar clic en detalles
  const handleDetailsClick = useCallback((item: Property | Experience) => {
    if (item.hasOwnProperty('title')) {
      // Es una propiedad
      onPropertyClick?.(item as Property);
    } else {
      // Es una experiencia
      onExperienceClick?.(item as Experience);
    }
    setSelectedItem(null);
  }, [onPropertyClick, onExperienceClick]);

  // Debug logging
  console.log('ModernMap - API Key:', GOOGLE_MAPS_API_KEY ? 'Configurada' : 'No configurada');
  console.log('ModernMap - isLoaded:', isLoaded, 'loadError:', loadError);
  console.log('ModernMap - properties:', properties.length, 'experiences:', experiences.length);

  // Verificar si la API key está configurada
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`${className} bg-white rounded-lg shadow-lg p-6 text-center`}>
        <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          API Key de Google Maps no configurada
        </h3>
        <p className="text-gray-600 mb-4">
          Para mostrar el mapa interactivo, necesitas configurar la variable de entorno VITE_GOOGLE_MAPS_API_KEY
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-yellow-800">
            💡 <strong>Configuración necesaria:</strong><br/>
            Asegúrate de que tu archivo .env contenga:<br/>
            <code className="bg-gray-100 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui</code>
          </p>
        </div>
      </div>
    );
  }

  // Mostrar error de carga
  if (loadError) {
    return (
      <div className={`${className} bg-white rounded-lg shadow-lg p-6 text-center`}>
        <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error al cargar Google Maps
        </h3>
        <p className="text-gray-600">
          No se pudo cargar la API de Google Maps. Verifica tu conexión a internet y la API key.
        </p>
      </div>
    );
  }

  // Mostrar loading
  if (!isLoaded) {
    return (
      <div className={`${className} bg-white rounded-lg shadow-lg p-6 text-center`}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Cargando mapa...
        </h3>
        <p className="text-gray-600">
          Inicializando Google Maps
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Mapa Interactivo
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Propiedades ({properties.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Experiencias ({experiences.length})</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Haz clic en los marcadores para ver detalles
        </p>
      </div>

      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <GoogleMap
          center={defaultCenter}
          zoom={6}
          options={mapOptions}

          onLoad={(map) => {
            if (mapBounds) {
              map.fitBounds(mapBounds);
              map.setZoom(Math.min(map.getZoom() || 10, 15));
            }
          }}
        >
          {mapData.map(item => (
            <Marker
              key={item.id}
              position={item.coordinates}
              onClick={() => handleMarkerClick(item.data)}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="${item.type === 'property' ? '#3B82F6' : '#8B5CF6'}" stroke="white" stroke-width="2"/>
                    <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">
                      ${item.type === 'property' ? '🏠' : '⭐'}
                    </text>
                  </svg>
                `)}`,
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20)
              }}
            />
          ))}
          
          {/* CAMBIO: Reemplazamos InfoWindow por OverlayView */}
          {selectedItem && selectedItemCoordinates && (
            <OverlayView
              position={selectedItemCoordinates}
              // Esto nos permite controlar cómo se renderiza el Overlay
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              // Ajuste para centrar la minicard sobre el marcador
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -(height + 45), // Posiciona la card 45px arriba del marcador
              })}
            >
              <Minicard
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onDetailsClick={handleDetailsClick}
              />
            </OverlayView>
          )}
        </GoogleMap>
      </div>

      {mapData.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay ubicaciones disponibles
          </h3>
          <p className="text-gray-600">
            Las propiedades y experiencias aparecerán en el mapa cuando tengan ubicaciones configuradas.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModernMap;
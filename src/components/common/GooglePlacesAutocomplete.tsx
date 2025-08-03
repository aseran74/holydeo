import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "¿Dónde quieres ir?",
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    // Verificar si ya está cargado
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Verificar si ya existe el script
    const existingScript = document.getElementById('google-places-script');
    if (existingScript) {
      // Si el script existe pero no está cargado, esperar
      if (!window.google || !window.google.maps) {
        existingScript.addEventListener('load', () => {
          setIsLoaded(true);
          setIsLoading(false);
        });
        setIsLoading(true);
      } else {
        setIsLoaded(true);
      }
      return;
    }

    // Cargar Google Places API
    setIsLoading(true);
    setError(null);

    const script = document.createElement('script');
    script.id = 'google-places-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.addEventListener('load', () => {
      console.log('Google Places API cargada exitosamente');
      setIsLoaded(true);
      setIsLoading(false);
    });

    script.addEventListener('error', () => {
      console.error('Error cargando Google Places API');
      setError('Error cargando Google Places API');
      setIsLoading(false);
    });

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      console.log('Inicializando Google Places Autocomplete...');
      
      // Limpiar autocompletado anterior si existe
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }

      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'], // Solo ciudades, no mezclar con geocode
        componentRestrictions: { country: 'es' },
        fields: ['formatted_address', 'geometry', 'name'],
      });

      // Escuchar cambios en la selección
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        console.log('Lugar seleccionado:', place);
        
        if (place.formatted_address) {
          onChange(place.formatted_address);
        }
      });

      console.log('Google Places Autocomplete inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando Google Places:', error);
      setError('Error inicializando Google Places');
    }
  }, [isLoaded, onChange]);

  // Debug: Mostrar estado en consola
  useEffect(() => {
    console.log('Estado del componente:', { isLoaded, isLoading, error });
    console.log('API Key configurada:', !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
  }, [isLoaded, isLoading, error]);

  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        ref={inputRef}
        type="text"
        placeholder={isLoading ? "Cargando Google Places..." : placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="absolute -bottom-6 left-0 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete; 
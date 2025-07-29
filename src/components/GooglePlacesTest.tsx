import React, { useState } from 'react';
import GooglePlacesAutocomplete from './common/GooglePlacesAutocomplete';

const GooglePlacesTest: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [location, setLocation] = useState('');

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place);
    console.log('Lugar seleccionado en test:', place);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Prueba de Google Places API</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Buscar Dirección</h2>
        <GooglePlacesAutocomplete
          value={location}
          onChange={setLocation}
          onPlaceSelect={handlePlaceSelect}
          placeholder="Escribe una dirección para probar..."
          className="w-full"
        />
      </div>

      {selectedPlace && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            ✅ Lugar Seleccionado
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Información Básica</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Place ID:</strong> {selectedPlace.place_id}</div>
                <div><strong>Dirección:</strong> {selectedPlace.formatted_address}</div>
                {selectedPlace.name && <div><strong>Nombre:</strong> {selectedPlace.name}</div>}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Coordenadas</h4>
              <div className="space-y-1 text-sm">
                {selectedPlace.geometry?.location && (
                  <>
                    <div><strong>Latitud:</strong> {selectedPlace.geometry.location.lat()}</div>
                    <div><strong>Longitud:</strong> {selectedPlace.geometry.location.lng()}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {selectedPlace.address_components && (
            <div className="mt-4">
              <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Componentes de Dirección</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                {selectedPlace.address_components.map((component: any, index: number) => (
                  <div key={index} className="p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="font-medium">{component.long_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {component.types.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
          📋 Instrucciones de Prueba
        </h3>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li>• Escribe al menos 3 caracteres para activar la búsqueda</li>
          <li>• Usa las flechas del teclado para navegar por las opciones</li>
          <li>• Presiona Enter para seleccionar</li>
          <li>• Presiona Escape para cerrar el dropdown</li>
          <li>• Haz clic fuera para cerrar el dropdown</li>
        </ul>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
          ⚠️ Verificaciones
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
          <li>• Verifica que la API key esté configurada en .env</li>
          <li>• Verifica que la API key tenga permisos para Places API</li>
          <li>• Verifica que no haya errores en la consola del navegador</li>
          <li>• Verifica que las predicciones aparezcan al escribir</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            setSelectedPlace(null);
            setLocation('');
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Limpiar Prueba
        </button>
      </div>
    </div>
  );
};

export default GooglePlacesTest; 
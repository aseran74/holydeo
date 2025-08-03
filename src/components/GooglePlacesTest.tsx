import React, { useState } from 'react';
import GooglePlacesAutocomplete from './common/GooglePlacesAutocomplete';

const GooglePlacesTest: React.FC = () => {
  const [location, setLocation] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState('');

  // Verificar API Key
  React.useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      setApiKeyStatus(`✅ API Key configurada: ${apiKey.substring(0, 10)}...`);
    } else {
      setApiKeyStatus('❌ API Key no configurada');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🗺️ Test de Google Places Autocomplete
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          
          {/* Estado de la API Key */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              🔑 Estado de la API Key
            </h2>
            <p className="text-blue-700">{apiKeyStatus}</p>
          </div>

          {/* Test del componente */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              🧪 Test del Autocompletado
            </h2>
            <p className="text-gray-600">
              Escribe en el campo de abajo para probar el autocompletado de Google Places:
            </p>
            
            <GooglePlacesAutocomplete
              value={location}
              onChange={setLocation}
              placeholder="Escribe una ciudad española..."
              className="w-full"
            />
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">📍 Ubicación seleccionada:</h3>
              <p className="text-gray-700">
                {location || 'Ninguna ubicación seleccionada'}
              </p>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              📋 Instrucciones de Prueba
            </h2>
            <ul className="text-green-700 space-y-1">
              <li>• Escribe "Madrid" para ver sugerencias</li>
              <li>• Escribe "Barcelona" para ver más opciones</li>
              <li>• Escribe "Valencia" para probar otra ciudad</li>
              <li>• Revisa la consola del navegador para logs de debug</li>
            </ul>
          </div>

          {/* Debug Info */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">
              🔍 Información de Debug
            </h2>
            <p className="text-yellow-700 text-sm">
              Abre la consola del navegador (F12) para ver los logs de debug del componente.
              Esto te ayudará a identificar si hay problemas con la carga de la API.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GooglePlacesTest; 
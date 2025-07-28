import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function DebugSupabase() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function debugSupabase() {
      try {
        setLoading(true);
        
        // Verificar configuración
        const config = {
          url: import.meta.env.VITE_SUPABASE_URL,
          hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          anonKeyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
        };

        // Probar conexión básica
        const { data: testData, error: testError } = await supabase
          .from('properties')
          .select('count', { count: 'exact', head: true });

        // Obtener algunas propiedades
        const { data: properties, error: propertiesError } = await supabase
          .from('properties')
          .select('id, title, location, price')
          .limit(3);

        // Obtener información de la tabla
        const { data: tableInfo, error: tableError } = await supabase
          .from('properties')
          .select('*')
          .limit(1);

        setDebugInfo({
          config,
          testConnection: {
            success: !testError,
            error: testError?.message,
            count: testData
          },
          properties: {
            success: !propertiesError,
            error: propertiesError?.message,
            data: properties,
            count: properties?.length || 0
          },
          tableInfo: {
            success: !tableError,
            error: tableError?.message,
            hasData: !!tableInfo && tableInfo.length > 0,
            sampleData: tableInfo?.[0]
          }
        });

      } catch (err) {
        setDebugInfo({
          error: `Error inesperado: ${err}`
        });
      } finally {
        setLoading(false);
      }
    }

    debugSupabase();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p>Debuggeando conexión Supabase...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="font-bold mb-4">Debug Supabase</h3>
      
      {/* Configuración */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Configuración:</h4>
        <div className="text-sm space-y-1">
          <div>URL: {debugInfo.config?.url || 'No configurada'}</div>
          <div>Clave anónima: {debugInfo.config?.hasAnonKey ? '✅ Configurada' : '❌ No configurada'}</div>
          <div>Longitud clave: {debugInfo.config?.anonKeyLength} caracteres</div>
        </div>
      </div>

      {/* Prueba de conexión */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Prueba de Conexión:</h4>
        <div className="text-sm">
          {debugInfo.testConnection?.success ? (
            <div className="text-green-600">✅ Conexión exitosa - {debugInfo.testConnection.count} propiedades</div>
          ) : (
            <div className="text-red-600">❌ Error: {debugInfo.testConnection?.error}</div>
          )}
        </div>
      </div>

      {/* Propiedades */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Propiedades:</h4>
        <div className="text-sm">
          {debugInfo.properties?.success ? (
            <div>
              <div className="text-green-600">✅ Datos obtenidos - {debugInfo.properties.count} propiedades</div>
              {debugInfo.properties.data && debugInfo.properties.data.length > 0 && (
                <div className="mt-2">
                  <div className="font-medium">Primeras propiedades:</div>
                  <ul className="list-disc list-inside">
                    {debugInfo.properties.data.map((prop: any) => (
                      <li key={prop.id}>
                        {prop.title} - {prop.location} - €{prop.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">❌ Error: {debugInfo.properties?.error}</div>
          )}
        </div>
      </div>

      {/* Información de tabla */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Información de Tabla:</h4>
        <div className="text-sm">
          {debugInfo.tableInfo?.success ? (
            <div>
              <div className="text-green-600">✅ Tabla accesible</div>
              <div>¿Tiene datos?: {debugInfo.tableInfo.hasData ? '✅ Sí' : '❌ No'}</div>
              {debugInfo.tableInfo.sampleData && (
                <div className="mt-2">
                  <div className="font-medium">Datos de ejemplo:</div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(debugInfo.tableInfo.sampleData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-600">❌ Error: {debugInfo.tableInfo?.error}</div>
          )}
        </div>
      </div>

      {/* Error general */}
      {debugInfo.error && (
        <div className="text-red-600">
          <strong>Error general:</strong> {debugInfo.error}
        </div>
      )}
    </div>
  );
} 
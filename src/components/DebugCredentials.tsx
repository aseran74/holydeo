import { useEffect, useState } from 'react';

export default function DebugCredentials() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    setDebugInfo({
      url,
      key,
      keyLength: key?.length || 0,
      keyStart: key?.substring(0, 20) || 'No key',
      keyEnd: key?.substring(key?.length - 10) || 'No key',
      isCorrectUrl: url?.includes('wnevxdjytvbelknmtglf'),
      isOldUrl: url?.includes('mhfegdmspiwnyinknlhm'),
      hasKey: !!key,
    });

    // Test the connection
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const response = await fetch(`${url}/rest/v1/properties?select=count`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({ success: true, data });
      } else {
        const errorData = await response.json();
        setTestResult({ success: false, error: errorData, status: response.status });
      }
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold mb-4 text-yellow-800">🔧 Debug Detallado de Credenciales</h3>
      
      <div className="space-y-4">
        {/* URL Info */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🌐 URL de Supabase:</h4>
          <div className="text-sm space-y-1">
            <div><strong>URL actual:</strong> <code className="text-xs">{debugInfo.url || 'No configurada'}</code></div>
            <div className={`p-2 rounded ${debugInfo.isCorrectUrl ? 'bg-green-100 text-green-800' : debugInfo.isOldUrl ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {debugInfo.isCorrectUrl ? '✅ URL CORRECTA' : debugInfo.isOldUrl ? '❌ URL INCORRECTA (proyecto anterior)' : '⚠️ URL DESCONOCIDA'}
            </div>
          </div>
        </div>

        {/* Key Info */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🔑 Clave Anónima:</h4>
          <div className="text-sm space-y-1">
            <div><strong>Configurada:</strong> <span className={debugInfo.hasKey ? 'text-green-600' : 'text-red-600'}>{debugInfo.hasKey ? '✅ Sí' : '❌ No'}</span></div>
            <div><strong>Longitud:</strong> {debugInfo.keyLength} caracteres</div>
            <div><strong>Inicio:</strong> <code className="text-xs">{debugInfo.keyStart}...</code></div>
            <div><strong>Final:</strong> <code className="text-xs">...{debugInfo.keyEnd}</code></div>
          </div>
        </div>

        {/* Test Result */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🧪 Prueba de Conexión:</h4>
          <div className="text-sm">
            {testResult ? (
              <div className={`p-2 rounded ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {testResult.success ? (
                  <div>
                    <div className="font-medium">✅ CONEXIÓN EXITOSA</div>
                    <div className="text-xs mt-1">Respuesta: {JSON.stringify(testResult.data)}</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium">❌ ERROR DE CONEXIÓN</div>
                    <div className="text-xs mt-1">Status: {testResult.status}</div>
                    <div className="text-xs">Error: {JSON.stringify(testResult.error)}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-600">Cargando prueba...</div>
            )}
          </div>
          <button 
            onClick={testConnection}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            🔄 Probar de nuevo
          </button>
        </div>

        {/* Instructions */}
        {(!debugInfo.isCorrectUrl || !debugInfo.hasKey || (testResult && !testResult.success)) && (
          <div className="p-3 bg-red-100 border border-red-300 rounded">
            <h4 className="font-semibold text-red-800 mb-2">🚨 ACCIÓN REQUERIDA:</h4>
            <div className="text-sm text-red-700 space-y-2">
              <div>1. Abre tu archivo <code>.env</code> en la raíz del proyecto</div>
              <div>2. Asegúrate de que tenga estas líneas EXACTAS:</div>
              <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                VITE_SUPABASE_URL=https://wnevxdjytvbelknmtglf.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZXZ4ZGp5dHZiZWxrbm10Z2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzQxMjksImV4cCI6MjA2NzcxMDEyOX0.akA0n6yo5CbgB71dOTZBIEsityuohWegUpTTwQXdDA0
              </div>
              <div>3. Guarda el archivo</div>
              <div>4. Reinicia completamente el servidor: <code>Ctrl+C</code> y luego <code>npm run dev</code></div>
              <div>5. Recarga la página</div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {debugInfo.isCorrectUrl && debugInfo.hasKey && testResult?.success && (
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <h4 className="font-semibold text-green-800 mb-2">✅ TODO CORRECTO:</h4>
            <div className="text-sm text-green-700">
              Las credenciales están configuradas correctamente y la conexión funciona.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
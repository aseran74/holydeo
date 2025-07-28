import { useEffect, useState } from 'react';

export default function EnvChecker() {
  const [envInfo, setEnvInfo] = useState<any>({});

  useEffect(() => {
    setEnvInfo({
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });
  }, []);

  const isCorrectProject = envInfo.supabaseUrl?.includes('wnevxdjytvbelknmtglf');
  const isOldProject = envInfo.supabaseUrl?.includes('mhfegdmspiwnyinknlhm');

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="font-bold mb-4 text-red-800">🔍 Verificación de Credenciales</h3>
      
      <div className="space-y-3">
        {/* Supabase URL */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🗄️ Supabase URL:</h4>
          <div className="text-sm">
            <div className="mb-2">
              <strong>URL actual:</strong> 
              <span className={`ml-2 ${isCorrectProject ? 'text-green-600' : isOldProject ? 'text-red-600' : 'text-yellow-600'}`}>
                {envInfo.supabaseUrl || 'No configurada'}
              </span>
            </div>
            
            {isOldProject && (
              <div className="p-2 bg-red-100 border border-red-300 rounded">
                <div className="text-red-800 font-medium">❌ PROBLEMA DETECTADO:</div>
                <div className="text-red-700 text-sm">
                  Estás usando el proyecto INACTIVO: <code>mhfegdmspiwnyinknlhm</code>
                </div>
                <div className="text-red-700 text-sm mt-1">
                  Deberías usar: <code>wnevxdjytvbelknmtglf</code>
                </div>
              </div>
            )}
            
            {isCorrectProject && (
              <div className="p-2 bg-green-100 border border-green-300 rounded">
                <div className="text-green-800 font-medium">✅ CORRECTO:</div>
                <div className="text-green-700 text-sm">
                  Estás usando el proyecto ACTIVO: <code>wnevxdjytvbelknmtglf</code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Supabase Anon Key */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🔑 Supabase Anon Key:</h4>
          <div className="text-sm">
            <div>Configurada: <span className={envInfo.supabaseAnonKey ? 'text-green-600' : 'text-red-600'}>
              {envInfo.supabaseAnonKey ? '✅ Sí' : '❌ No'}
            </span></div>
            {envInfo.supabaseAnonKey && (
              <div className="mt-1">
                <div>Longitud: {envInfo.supabaseAnonKey.length} caracteres</div>
                <div className="text-xs text-gray-600 mt-1">
                  Inicio: {envInfo.supabaseAnonKey.substring(0, 20)}...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clerk Key */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🔐 Clerk Key:</h4>
          <div className="text-sm">
            <div>Configurada: <span className={envInfo.clerkKey ? 'text-green-600' : 'text-red-600'}>
              {envInfo.clerkKey ? '✅ Sí' : '❌ No'}
            </span></div>
            {envInfo.clerkKey && (
              <div className="text-xs text-gray-600 mt-1">
                Inicio: {envInfo.clerkKey.substring(0, 20)}...
              </div>
            )}
          </div>
        </div>

        {/* Action Required */}
        {isOldProject && (
          <div className="p-3 bg-red-100 border border-red-300 rounded">
            <h4 className="font-semibold text-red-800 mb-2">🚨 ACCIÓN REQUERIDA:</h4>
            <div className="text-sm text-red-700 space-y-2">
              <div>1. Abre tu archivo <code>.env</code></div>
              <div>2. Reemplaza la URL de Supabase con:</div>
              <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                VITE_SUPABASE_URL=https://wnevxdjytvbelknmtglf.supabase.co
              </div>
              <div>3. Reemplaza la clave anónima con:</div>
              <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">
                VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZXZ4ZGp5dHZiZWxrbm10Z2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzQxMjksImV4cCI6MjA2NzcxMDEyOX0.akA0n6yo5CbgB71dOTZBIEsityuohWegUpTTwQXdDA0
              </div>
              <div>4. Guarda el archivo y reinicia el servidor</div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isCorrectProject && (
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <h4 className="font-semibold text-green-800 mb-2">✅ TODO CORRECTO:</h4>
            <div className="text-sm text-green-700">
              Las credenciales están configuradas correctamente. Si sigues viendo errores, 
              intenta reiniciar el servidor de desarrollo.
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
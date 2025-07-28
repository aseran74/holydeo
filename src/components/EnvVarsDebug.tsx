export default function EnvVarsDebug() {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold mb-4">Variables de Entorno</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>VITE_SUPABASE_URL:</strong> 
          <span className={envVars.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
            {envVars.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}
          </span>
          {envVars.VITE_SUPABASE_URL && (
            <div className="text-xs text-gray-600 mt-1">
              {envVars.VITE_SUPABASE_URL.substring(0, 30)}...
            </div>
          )}
        </div>
        
        <div>
          <strong>VITE_SUPABASE_ANON_KEY:</strong> 
          <span className={envVars.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
            {envVars.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}
          </span>
          {envVars.VITE_SUPABASE_ANON_KEY && (
            <div className="text-xs text-gray-600 mt-1">
              Longitud: {envVars.VITE_SUPABASE_ANON_KEY.length} caracteres
            </div>
          )}
        </div>
        
        <div>
          <strong>VITE_CLERK_PUBLISHABLE_KEY:</strong> 
          <span className={envVars.VITE_CLERK_PUBLISHABLE_KEY ? 'text-green-600' : 'text-red-600'}>
            {envVars.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Configurada' : '❌ No configurada'}
          </span>
        </div>
        
        <div>
          <strong>VITE_GOOGLE_MAPS_API_KEY:</strong> 
          <span className={envVars.VITE_GOOGLE_MAPS_API_KEY ? 'text-green-600' : 'text-red-600'}>
            {envVars.VITE_GOOGLE_MAPS_API_KEY ? '✅ Configurada' : '❌ No configurada'}
          </span>
        </div>
      </div>
    </div>
  );
} 
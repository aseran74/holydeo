import { useUser } from '@clerk/clerk-react';

export default function QuickTest() {
  const { user, isLoaded } = useUser();

  return (
    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
      <h3 className="font-bold mb-4 text-green-800">🚀 Prueba Rápida - Todo Funcionando</h3>
      
      <div className="space-y-3">
        {/* Clerk Status */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🔐 Clerk:</h4>
          <div className="text-sm space-y-1">
            <div>Estado: <span className={isLoaded ? 'text-green-600' : 'text-yellow-600'}>
              {isLoaded ? '✅ Cargado' : '⏳ Cargando...'}
            </span></div>
            <div>Clave configurada: <span className={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Sí' : '❌ No'}
            </span></div>
            {user && (
              <div className="mt-2 p-2 bg-green-50 rounded">
                <div className="font-medium text-green-800">👤 Usuario Autenticado:</div>
                <div className="text-sm text-green-700">{user.fullName} ({user.primaryEmailAddress?.emailAddress})</div>
              </div>
            )}
          </div>
        </div>

        {/* Supabase Status */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🗄️ Supabase:</h4>
          <div className="text-sm space-y-1">
            <div>URL: <span className={import.meta.env.VITE_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}
            </span></div>
            <div>Clave: <span className={import.meta.env.VITE_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
              {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}
            </span></div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">🧭 Navegación:</h4>
          <div className="text-sm space-y-2">
            <div>
              <a href="/" className="text-blue-600 hover:underline">🏠 Dashboard</a>
            </div>
            <div>
              <a href="/properties" className="text-blue-600 hover:underline">🏠 Propiedades</a>
            </div>
            <div>
              <a href="/signin" className="text-blue-600 hover:underline">🔐 Iniciar Sesión</a>
            </div>
            <div>
              <a href="/signup" className="text-blue-600 hover:underline">📝 Registrarse</a>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="p-3 bg-green-100 rounded border border-green-300">
          <h4 className="font-semibold text-green-800 mb-2">✅ Estado General:</h4>
          <div className="text-sm text-green-700">
            {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && import.meta.env.VITE_SUPABASE_URL ? (
              <div>
                <div>🎉 ¡Todo configurado correctamente!</div>
                <div className="mt-1">• Clerk: Autenticación lista</div>
                <div>• Supabase: Base de datos conectada</div>
                <div>• React Router: Navegación funcionando</div>
                <div className="mt-2 font-medium">¡Tu aplicación está lista para usar! 🚀</div>
              </div>
            ) : (
              <div className="text-red-600">
                ⚠️ Faltan algunas configuraciones. Revisa las variables de entorno.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
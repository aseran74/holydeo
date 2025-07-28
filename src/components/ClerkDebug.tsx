import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';

export default function ClerkDebug() {
  const { user, isLoaded } = useUser();

  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <h3 className="font-bold mb-4">Debug Clerk</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Estado de carga:</strong> 
          <span className={isLoaded ? 'text-green-600' : 'text-yellow-600'}>
            {isLoaded ? '✅ Cargado' : '⏳ Cargando...'}
          </span>
        </div>
        
        <div>
          <strong>Clave de Clerk configurada:</strong> 
          <span className={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 'text-green-600' : 'text-red-600'}>
            {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? '✅ Sí' : '❌ No'}
          </span>
        </div>
        
        <div>
          <strong>Clave de Clerk:</strong> 
          <span className="text-xs text-gray-600">
            {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? 
              `${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.substring(0, 20)}...` : 
              'No configurada'
            }
          </span>
        </div>
      </div>

      <SignedIn>
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800 mb-2">✅ Usuario Autenticado</h4>
          <div className="text-sm space-y-1">
            <div><strong>ID:</strong> {user?.id}</div>
            <div><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</div>
            <div><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</div>
            <div><strong>Nombre completo:</strong> {user?.fullName}</div>
            <div><strong>Imagen:</strong> {user?.imageUrl ? '✅ Sí' : '❌ No'}</div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Usuario No Autenticado</h4>
          <div className="text-sm">
            <p>No hay usuario autenticado. Ve a <a href="/signin" className="text-blue-600 underline">Iniciar Sesión</a></p>
          </div>
        </div>
      </SignedOut>
    </div>
  );
} 
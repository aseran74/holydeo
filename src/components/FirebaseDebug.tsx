import { useAuth } from '../context/AuthContext';

export default function FirebaseDebug() {
  const { currentUser, loading } = useAuth();

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold mb-4">Debug Firebase Auth</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Estado de carga:</strong> 
          <span className={!loading ? 'text-green-600' : 'text-yellow-600'}>
            {!loading ? '✅ Cargado' : '⏳ Cargando...'}
          </span>
        </div>
        
        <div>
          <strong>Firebase configurado:</strong> 
          <span className="text-green-600">✅ Sí</span>
        </div>
        
        <div>
          <strong>Usuario autenticado:</strong> 
          <span className={currentUser ? 'text-green-600' : 'text-red-600'}>
            {currentUser ? '✅ Sí' : '❌ No'}
          </span>
        </div>
      </div>

      {currentUser && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800 mb-2">✅ Usuario Autenticado</h4>
          <div className="text-sm space-y-1">
            <div><strong>Email:</strong> {currentUser.email}</div>
            <div><strong>ID:</strong> {currentUser.uid}</div>
            <div><strong>Proveedor:</strong> {currentUser.providerData[0]?.providerId || 'Email'}</div>
            <div><strong>Verificado:</strong> {currentUser.emailVerified ? '✅ Sí' : '❌ No'}</div>
          </div>
        </div>
      )}

      {!currentUser && !loading && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Usuario No Autenticado</h4>
          <div className="text-sm">
            <p>No hay usuario autenticado. Ve a <a href="/login" className="text-blue-600 underline">Iniciar Sesión</a></p>
          </div>
        </div>
      )}
    </div>
  );
} 
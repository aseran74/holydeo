import { useAuth } from '../../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export default function UserDropdown() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  // Debug temporal para ver los datos del usuario
  console.log('Usuario actual:', {
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    uid: currentUser.uid,
    providerData: currentUser.providerData,
    // Información adicional para debug
    isAnonymous: currentUser.isAnonymous,
    emailVerified: currentUser.emailVerified,
    phoneNumber: currentUser.phoneNumber
  });

  // Obtener el avatar de Google si está disponible
  const userAvatar = currentUser.photoURL;
  const userDisplayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario';
  
  // Debug adicional para la foto
  console.log('Avatar del usuario:', {
    userAvatar,
    hasPhotoURL: !!currentUser.photoURL,
    photoURLType: typeof currentUser.photoURL,
    providerData: currentUser.providerData?.map(p => ({
      providerId: p.providerId,
      photoURL: p.photoURL,
      displayName: p.displayName
    }))
  });

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {userAvatar ? (
          <img 
            src={userAvatar} 
            alt={userDisplayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            onError={(e) => {
              console.error('Error cargando imagen del perfil:', e);
              // Ocultar la imagen si hay error
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Imagen del perfil cargada exitosamente');
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {userDisplayName}
          </p>
          {currentUser.email && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser.email}
            </p>
          )}
          {/* Debug visual */}
          <div className="text-xs text-gray-400 mt-1">
            {currentUser.providerData?.[0]?.providerId === 'google.com' ? (
              <span className="text-green-600">🔗 Google</span>
            ) : (
              <span className="text-blue-600">📧 Email</span>
            )}
            {currentUser.photoURL && (
              <span className="ml-2 text-green-600">📸 Foto disponible</span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-700 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        title="Cerrar sesión"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:block text-sm">Cerrar</span>
      </button>
    </div>
  );
}

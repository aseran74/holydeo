import React, { useState } from 'react';
import { useUserSync } from '../../hooks/useUserSync';
import { useAuth } from '../../context/AuthContext';
import { User, Save, RefreshCw } from 'lucide-react';

const UserProfileSync: React.FC = () => {
  const { currentUser } = useAuth();
  const { supabaseUser, loading, error, updateUserProfile, refreshUser } = useUserSync();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // Inicializar displayName cuando se carga el usuario
  React.useEffect(() => {
    if (supabaseUser?.display_name) {
      setDisplayName(supabaseUser.display_name);
    }
  }, [supabaseUser]);

  const handleSave = async () => {
    if (await updateUserProfile({ display_name: displayName })) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(supabaseUser?.display_name || '');
    setIsEditing(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Perfil de Usuario
        </h3>
        <button
          onClick={refreshUser}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          title="Refrescar datos"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Información de Firebase */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Información de Firebase
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">
              {currentUser.displayName || 'Sin nombre'}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {currentUser.email}
          </div>
          {currentUser.photoURL && (
            <img
              src={currentUser.photoURL}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Información de Supabase */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Información de Supabase
        </h4>
        {loading ? (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sincronizando...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        ) : supabaseUser ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                />
              ) : (
                <span className="text-gray-700 dark:text-gray-300">
                  {supabaseUser.display_name || 'Sin nombre'}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rol:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                supabaseUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                supabaseUser.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                supabaseUser.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {supabaseUser.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estado:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                supabaseUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {supabaseUser.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Último acceso:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {supabaseUser.last_sign_in ? new Date(supabaseUser.last_sign_in).toLocaleString('es-ES') : 'Nunca'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No sincronizado
          </div>
        )}
      </div>

      {/* Botones de acción */}
      {supabaseUser && (
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Editar Nombre
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileSync;

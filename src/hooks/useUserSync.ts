import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserService, SupabaseUser } from '../services/userService';

export const useUserSync = () => {
  const { currentUser } = useAuth();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar usuario cuando cambie el usuario de Firebase
  useEffect(() => {
    if (currentUser) {
      syncUser();
    } else {
      setSupabaseUser(null);
    }
  }, [currentUser]);

  const syncUser = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      // Verificar si el usuario ya existe en Supabase
      let user = await UserService.getUserByEmail(currentUser.email || '');
      
      if (!user) {
        // Usuario nuevo - crear en Supabase
        user = await UserService.createUser({
          firebase_uid: currentUser.uid,
          email: currentUser.email || '',
          display_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario',
          photo_url: currentUser.photoURL,
          provider: currentUser.providerData[0]?.providerId || 'email',
          role: 'guest' // Rol por defecto
        });
      } else {
        // Usuario existente - actualizar información
        user = await UserService.updateUser(currentUser.email || '', {
          display_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario',
          photo_url: currentUser.photoURL
        });

        // Actualizar último inicio de sesión
        await UserService.updateLastSignIn(currentUser.email || '');
      }

      if (user) {
        setSupabaseUser(user);
        console.log('Usuario sincronizado exitosamente:', user);
      } else {
        setError('Error al sincronizar usuario');
      }
    } catch (err) {
      console.error('Error en sincronización:', err);
      setError('Error al sincronizar usuario con Supabase');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updateData: {
    display_name?: string;
    photo_url?: string;
  }) => {
    if (!currentUser || !supabaseUser) return false;

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await UserService.updateUser(currentUser.email || '', updateData);
      
      if (updatedUser) {
        setSupabaseUser(updatedUser);
        return true;
      } else {
        setError('Error al actualizar perfil');
        return false;
      }
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError('Error al actualizar perfil');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (currentUser) {
      await syncUser();
    }
  };

  return {
    supabaseUser,
    loading,
    error,
    syncUser,
    updateUserProfile,
    refreshUser
  };
};

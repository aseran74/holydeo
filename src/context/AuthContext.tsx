import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Actualizar el displayName si se proporciona
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserRole(null);
    setIsAdmin(false);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
    // Solicitar permisos específicos
    provider.addScope('profile');
    provider.addScope('email');
    
    // Configurar para solicitar siempre la selección de cuenta
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Login con Google exitoso:', {
        user: result.user,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        email: result.user.email,
        providerData: result.user.providerData
      });
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  };

  // Función para sincronizar usuario de Firebase con Supabase
  const syncUserWithSupabase = async (firebaseUser: User) => {
    try {
      console.log('🔍 Sincronizando usuario:', firebaseUser.email);
      
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', firebaseUser.email)
        .single();

      console.log('📋 Usuario existente:', existingUser);
      console.log('❌ Error fetch:', fetchError);

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error verificando usuario existente:', fetchError);
        return null;
      }

      const userData = {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
        photo_url: firebaseUser.photoURL,
        provider: firebaseUser.providerData[0]?.providerId || 'email',
        last_sign_in: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📝 Datos del usuario a sincronizar:', userData);

      if (!existingUser) {
        // Usuario nuevo - crear en Supabase
        console.log('🆕 Creando usuario nuevo en Supabase...');
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            ...userData,
            role: 'guest', // Rol por defecto
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creando usuario en Supabase:', insertError);
          return null;
        }

        console.log('✅ Usuario creado en Supabase:', newUser);
        return newUser;
      } else {
        // Usuario existente - actualizar en Supabase
        console.log('🔄 Actualizando usuario existente en Supabase...');
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            display_name: userData.display_name,
            photo_url: userData.photo_url,
            last_sign_in: userData.last_sign_in,
            updated_at: userData.updated_at
          })
          .eq('email', firebaseUser.email)
          .eq('firebase_uid', firebaseUser.uid)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error actualizando usuario en Supabase:', updateError);
          return existingUser;
        }

        console.log('✅ Usuario actualizado en Supabase:', updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error('💥 Error sincronizando usuario con Supabase:', error);
      return null;
    }
  };

  // Función para obtener el rol del usuario desde Supabase
  const getUserRole = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error obteniendo rol:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Error obteniendo rol:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔥 Firebase auth state changed:', user?.email);
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log('🔄 Iniciando sincronización con Supabase...');
          // Sincronizar usuario con Supabase
          const supabaseUser = await syncUserWithSupabase(user);
          
          if (supabaseUser) {
            console.log('✅ Usuario sincronizado:', supabaseUser);
            // Obtener rol del usuario desde Supabase
            const role = supabaseUser.role || await getUserRole(user.email || '');
            console.log('👑 Rol del usuario:', role);
            setUserRole(role);
            setIsAdmin(role === 'admin');
          } else {
            console.log('⚠️ Fallback: obteniendo rol directamente...');
            // Fallback: intentar obtener rol directamente
            const role = await getUserRole(user.email || '');
            console.log('👑 Rol obtenido directamente:', role);
            setUserRole(role);
            setIsAdmin(role === 'admin');
          }
        } catch (error) {
          console.error('💥 Error en sincronización:', error);
          // Fallback: intentar obtener rol directamente
          const role = await getUserRole(user.email || '');
          console.log('👑 Rol obtenido en fallback:', role);
          setUserRole(role);
          setIsAdmin(role === 'admin');
        }
      } else {
        console.log('🚪 Usuario no autenticado');
        setUserRole(null);
        setIsAdmin(false);
      }
      
      console.log('🏁 Finalizando sincronización, loading = false');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    isAdmin,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
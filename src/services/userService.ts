import { supabase } from '../supabaseClient';

export interface SupabaseUser {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  full_name?: string | null;
  photo_url: string | null;
  provider: string;
  role: 'guest' | 'agent' | 'owner' | 'admin';
  is_active: boolean;
  last_sign_in: string | null;
  created_at: string;
  updated_at: string;
  agency_id?: string | null;
}

// Alias para compatibilidad con componentes existentes
export type User = SupabaseUser;

export interface CreateUserData {
  firebase_uid: string;
  email: string;
  display_name?: string;
  full_name?: string;
  photo_url?: string;
  provider?: string;
  role?: 'guest' | 'agent' | 'owner' | 'admin';
  agency_id?: string;
}

export interface UpdateUserData {
  display_name?: string;
  full_name?: string;
  photo_url?: string;
  role?: 'guest' | 'agent' | 'owner' | 'admin';
  is_active?: boolean;
  agency_id?: string;
}

export class UserService {
  // Obtener usuario por email
  static async getUserByEmail(email: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuario no encontrado
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error);
      return null;
    }
  }

  // Obtener usuario por Firebase UID
  static async getUserByFirebaseUid(firebaseUid: string): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUid)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuario no encontrado
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo usuario por Firebase UID:', error);
      return null;
    }
  }

  // Crear nuevo usuario
  static async createUser(userData: CreateUserData): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...userData,
          role: userData.role || 'guest',
          is_active: true,
          last_sign_in: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creando usuario:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      return null;
    }
  }

  // Actualizar usuario existente
  static async updateUser(email: string, updateData: UpdateUserData): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando usuario:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return null;
    }
  }

  // Actualizar usuario por ID (para el modal de edición)
  static async updateUserById(userId: string, updateData: UpdateUserData): Promise<SupabaseUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando usuario por ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error actualizando usuario por ID:', error);
      return null;
    }
  }

  // Actualizar último inicio de sesión
  static async updateLastSignIn(email: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          last_sign_in: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Error actualizando último inicio de sesión:', error);
      }
    } catch (error) {
      console.error('Error actualizando último inicio de sesión:', error);
    }
  }

  // Obtener todos los usuarios (solo para admins)
  static async getAllUsers(): Promise<SupabaseUser[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo usuarios:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  // Cambiar rol de usuario (solo para admins)
  static async changeUserRole(email: string, newRole: 'guest' | 'agent' | 'owner' | 'admin'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Error cambiando rol de usuario:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error cambiando rol de usuario:', error);
      return false;
    }
  }

  // Desactivar/activar usuario (solo para admins)
  static async toggleUserStatus(email: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Error cambiando estado de usuario:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error cambiando estado de usuario:', error);
      return false;
    }
  }

  // Obtener estadísticas de usuarios (solo para admins)
  static async getUserStats(): Promise<{ total: number; active: number; inactive: number }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_active');

      if (error) {
        console.error('Error obteniendo estadísticas de usuarios:', error);
        return { total: 0, active: 0, inactive: 0 };
      }

      const total = data?.length || 0;
      const active = data?.filter(user => user.is_active).length || 0;
      const inactive = total - active;

      return { total, active, inactive };
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuarios:', error);
      return { total: 0, active: 0, inactive: 0 };
    }
  }

  // Eliminar usuario (solo para admins)
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error eliminando usuario:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return false;
    }
  }

  // Obtener agencias (para asignar agentes)
  static async getAgencies(): Promise<{ id: string; name: string }[]> {
    try {
      // Por ahora retornamos un array vacío, puedes implementar la lógica real después
      return [];
    } catch (error) {
      console.error('Error obteniendo agencias:', error);
      return [];
    }
  }
}

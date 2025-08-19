import { supabase } from '../supabaseClient';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'agency' | 'agent' | 'owner' | 'guest';
  agency_id: string | null;
  created_at: string;
}

export interface CreateUserData {
  email: string;
  full_name: string;
  role: 'admin' | 'agency' | 'agent' | 'owner' | 'guest';
  agency_id?: string;
}

export interface UpdateUserData {
  full_name?: string;
  role?: 'admin' | 'agency' | 'agent' | 'owner' | 'guest';
  agency_id?: string;
}

export class UserService {
  // Obtener todos los usuarios
  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          role,
          agency_id,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo usuarios:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  }

  // Obtener usuario por ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          role,
          agency_id,
          created_at
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error obteniendo usuario:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  }

  // Crear nuevo usuario
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creando usuario:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en createUser:', error);
      throw error;
    }
  }

  // Actualizar usuario
  static async updateUser(id: string, updateData: UpdateUserData): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando usuario:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en updateUser:', error);
      throw error;
    }
  }

  // Eliminar usuario
  static async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando usuario:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error en deleteUser:', error);
      throw error;
    }
  }

  // Cambiar rol de usuario
  static async changeUserRole(id: string, newRole: 'admin' | 'agency' | 'agent' | 'owner' | 'guest'): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error cambiando rol:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en changeUserRole:', error);
      throw error;
    }
  }

  // Obtener usuarios por rol
  static async getUsersByRole(role: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          role,
          agency_id,
          created_at
        `)
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo usuarios por rol:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getUsersByRole:', error);
      throw error;
    }
  }

  // Buscar usuarios por email o nombre
  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          role,
          agency_id,
          created_at
        `)
        .or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error buscando usuarios:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en searchUsers:', error);
      throw error;
    }
  }

  // Obtener estadísticas de usuarios
  static async getUserStats(): Promise<{ total: number; byRole: Record<string, number> }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role');

      if (error) {
        console.error('Error obteniendo estadísticas:', error);
        throw error;
      }

      const total = data?.length || 0;
      const byRole: Record<string, number> = {};

      data?.forEach(user => {
        byRole[user.role] = (byRole[user.role] || 0) + 1;
      });

      return { total, byRole };
    } catch (error) {
      console.error('Error en getUserStats:', error);
      throw error;
    }
  }

  // Verificar si un email ya existe
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error verificando email:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error en checkEmailExists:', error);
      throw error;
    }
  }

  // Obtener agencias disponibles (para asignar a usuarios)
  static async getAgencies(): Promise<{ id: string; name: string }[]> {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error obteniendo agencias:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getAgencies:', error);
      throw error;
    }
  }
}

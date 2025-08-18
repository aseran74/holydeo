import { supabase } from '../supabaseClient';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export class ProfileService {
  /**
   * Obtener el perfil de un usuario por ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in getUserProfile:', error);
      return null;
    }
  }

  /**
   * Crear o actualizar un perfil de usuario
   */
  static async upsertUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in upsertUserProfile:', error);
      return null;
    }
  }

  /**
   * Crear perfiles para usuarios existentes basándose en auth.users
   */
  static async createProfileFromAuth(userId: string): Promise<UserProfile | null> {
    try {
      // Obtener información básica del usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Error getting auth user:', authError);
        return null;
      }

      // Crear perfil básico
      const profile: Partial<UserProfile> = {
        id: userId,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
        email: user.email || '',
        role: 'guest'
      };

      return await this.upsertUserProfile(profile);
    } catch (error) {
      console.error('Exception in createProfileFromAuth:', error);
      return null;
    }
  }

  /**
   * Obtener todos los perfiles (para admin)
   */
  static async getAllProfiles(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all profiles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getAllProfiles:', error);
      return [];
    }
  }

  /**
   * Obtener perfiles por rol
   */
  static async getProfilesByRole(role: string): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles by role:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getProfilesByRole:', error);
      return [];
    }
  }
}

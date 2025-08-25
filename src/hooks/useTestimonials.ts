import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los testimonios
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTestimonials(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo testimonio
  const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          ...testimonial,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTestimonials(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating testimonial:', err);
      throw err;
    }
  };

  // Actualizar testimonio existente
  const updateTestimonial = async (id: number, updates: Partial<Testimonial>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === id ? data : testimonial
        )
      );
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error updating testimonial:', err);
      throw err;
    }
  };

  // Eliminar testimonio
  const deleteTestimonial = async (id: number) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error deleting testimonial:', err);
      throw err;
    }
  };

  // Subir avatar
  const uploadAvatar = async (file: File, fileName?: string) => {
    try {
      const finalFileName = fileName || `testimonials/${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(finalFileName, file);

      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(finalFileName);
      
      return urlData.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error uploading avatar:', err);
      throw err;
    }
  };

  // Obtener testimonios para la landing page (máximo 3)
  const getLandingTestimonials = () => {
    return testimonials.slice(0, 3);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    uploadAvatar,
    getLandingTestimonials
  };
};

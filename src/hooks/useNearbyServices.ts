import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface NearbyService {
  id: string;
  property_id: string;
  service_type: string;
  name: string;
  distance_minutes: number;
  description?: string;
  icon_name?: string;
  color?: string;
  external_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useNearbyServices = (propertyId?: string) => {
  const [nearbyServices, setNearbyServices] = useState<NearbyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener servicios cercanos de una propiedad
  const fetchNearbyServices = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const targetId = id || propertyId;
      if (!targetId) return;
      
      const { data, error } = await supabase
        .from('nearby_services')
        .select('*')
        .eq('property_id', targetId)
        .eq('is_active', true)
        .order('distance_minutes', { ascending: true });

      if (error) throw error;
      
      setNearbyServices(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching nearby services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo servicio cercano
  const createNearbyService = async (service: Omit<NearbyService, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('nearby_services')
        .insert([{
          ...service,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setNearbyServices(prev => [...prev, data]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating nearby service:', err);
      throw err;
    }
  };

  // Actualizar servicio cercano existente
  const updateNearbyService = async (id: string, updates: Partial<NearbyService>) => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('nearby_services')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setNearbyServices(prev => 
        prev.map(service => 
          service.id === id ? data : service
        )
      );
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error updating nearby service:', err);
      throw err;
    }
  };

  // Eliminar servicio cercano
  const deleteNearbyService = async (id: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('nearby_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNearbyServices(prev => prev.filter(service => service.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error deleting nearby service:', err);
      throw err;
    }
  };

  // Obtener tipos de servicios disponibles
  const getServiceTypes = () => {
    return [
      { value: 'restaurant', label: 'Restaurante', icon: 'UtensilsCrossed', color: '#F97316' },
      { value: 'supermarket', label: 'Supermercado', icon: 'ShoppingBag', color: '#10B981' },
      { value: 'pharmacy', label: 'Farmacia', icon: 'HeartPulse', color: '#EF4444' },
      { value: 'transport', label: 'Transporte', icon: 'Car', color: '#8B5CF6' },
      { value: 'beach', label: 'Playa', icon: 'Waves', color: '#0EA5E9' },
      { value: 'park', label: 'Parque', icon: 'TreePine', color: '#22C55E' },
      { value: 'shopping', label: 'Compras', icon: 'ShoppingCart', color: '#F59E0B' },
      { value: 'historic', label: 'Histórico', icon: 'Landmark', color: '#F59E0B' },
      { value: 'entertainment', label: 'Entretenimiento', icon: 'Gamepad2', color: '#EC4899' },
      { value: 'sports', label: 'Deportes', icon: 'Trophy', color: '#06B6D4' },
      { value: 'health', label: 'Salud', icon: 'Stethoscope', color: '#84CC16' },
      { value: 'education', label: 'Educación', icon: 'GraduationCap', color: '#6366F1' }
    ];
  };

  useEffect(() => {
    if (propertyId) {
      fetchNearbyServices();
    }
  }, [propertyId]);

  return {
    nearbyServices,
    loading,
    error,
    fetchNearbyServices,
    createNearbyService,
    updateNearbyService,
    deleteNearbyService,
    getServiceTypes
  };
};

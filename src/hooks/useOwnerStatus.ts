import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useOwnerStatus = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  useEffect(() => {
    checkOwnerStatus();
  }, []);

  const checkOwnerStatus = async () => {
    try {
      setLoading(true);
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsOwner(false);
        setOwnerId(null);
        setLoading(false);
        return;
      }

      // Verificar si el usuario es propietario de alguna propiedad
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error verificando estado de propietario:', error);
        setIsOwner(false);
        setOwnerId(null);
      } else {
        const hasProperties = properties && properties.length > 0;
        setIsOwner(hasProperties);
        setOwnerId(hasProperties ? user.id : null);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsOwner(false);
      setOwnerId(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    isOwner,
    ownerId,
    loading,
    refetch: checkOwnerStatus
  };
};

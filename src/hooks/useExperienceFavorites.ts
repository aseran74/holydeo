import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export const useExperienceFavorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar favoritos del usuario
  const loadFavorites = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('experience_favorites')
        .select('experience_id')
        .eq('user_id', currentUser.uid);

      if (error) {
        console.error('Error loading favorites:', error);
        return;
      }

      const favoriteIds = data.map(fav => fav.experience_id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar experiencia a favoritos
  const addToFavorites = async (experienceId: string) => {
    if (!currentUser) return false;
    
    try {
      const { error } = await supabase
        .from('experience_favorites')
        .insert({
          user_id: currentUser.uid,
          experience_id: experienceId
        });

      if (error) {
        console.error('Error adding to favorites:', error);
        return false;
      }

      setFavorites(prev => [...prev, experienceId]);
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  // Remover experiencia de favoritos
  const removeFromFavorites = async (experienceId: string) => {
    if (!currentUser) return false;
    
    try {
      const { error } = await supabase
        .from('experience_favorites')
        .delete()
        .eq('user_id', currentUser.uid)
        .eq('experience_id', experienceId);

      if (error) {
        console.error('Error removing from favorites:', error);
        return false;
      }

      setFavorites(prev => prev.filter(id => id !== experienceId));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  // Toggle favorito
  const toggleFavorite = async (experienceId: string) => {
    if (favorites.includes(experienceId)) {
      return await removeFromFavorites(experienceId);
    } else {
      return await addToFavorites(experienceId);
    }
  };

  // Verificar si una experiencia es favorita
  const isFavorite = (experienceId: string) => {
    return favorites.includes(experienceId);
  };

  // Cargar favoritos cuando cambie el usuario
  useEffect(() => {
    if (currentUser) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [currentUser]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    loadFavorites
  };
};

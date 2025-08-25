import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export const usePropertyFavorites = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('property_favorites')
        .select('property_id')
        .eq('user_id', currentUser.uid);

      if (error) {
        console.error('Error loading property favorites:', error);
        return;
      }

      const favoriteIds = data?.map(fav => fav.property_id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading property favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (propertyId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('property_favorites')
        .insert({
          user_id: currentUser.uid,
          property_id: propertyId
        });

      if (error) {
        console.error('Error adding property to favorites:', error);
        return false;
      }

      setFavorites(prev => [...prev, propertyId]);
      return true;
    } catch (error) {
      console.error('Error adding property to favorites:', error);
      return false;
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('property_favorites')
        .delete()
        .eq('user_id', currentUser.uid)
        .eq('property_id', propertyId);

      if (error) {
        console.error('Error removing property from favorites:', error);
        return false;
      }

      setFavorites(prev => prev.filter(id => id !== propertyId));
      return true;
    } catch (error) {
      console.error('Error removing property from favorites:', error);
      return false;
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (favorites.includes(propertyId)) {
      return await removeFromFavorites(propertyId);
    } else {
      return await addToFavorites(propertyId);
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

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
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loadFavorites
  };
};

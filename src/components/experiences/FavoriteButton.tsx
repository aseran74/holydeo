import React from 'react';
import { Heart } from 'lucide-react';
import { useExperienceFavorites } from '../../hooks/useExperienceFavorites';
import useToast from '../../hooks/useToast';

interface FavoriteButtonProps {
  experienceId: string;
  experienceName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  experienceId,
  experienceName,
  className = '',
  size = 'md'
}) => {
  const { isFavorite, toggleFavorite, loading } = useExperienceFavorites();
  const toast = useToast();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleToggleFavorite = async () => {
    try {
      const success = await toggleFavorite(experienceId);
      
      if (success) {
        if (isFavorite(experienceId)) {
          toast.success('Removido de favoritos', `${experienceName} ha sido removido de tus favoritos`);
        } else {
          toast.success('Agregado a favoritos', `${experienceName} ha sido agregado a tus favoritos`);
        }
      } else {
        toast.error('Error', 'No se pudo actualizar tus favoritos');
      }
    } catch (error) {
      toast.error('Error', 'Ocurrió un error al actualizar tus favoritos');
    }
  };

  const isFavorited = isFavorite(experienceId);

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full transition-all duration-200
        ${isFavorited 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isFavorited ? 'Remover de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorited ? 'fill-current' : ''}`} 
      />
    </button>
  );
};

export default FavoriteButton;

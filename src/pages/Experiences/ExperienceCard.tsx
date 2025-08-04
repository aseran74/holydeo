import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Euro, Eye } from 'lucide-react';

import { Experience } from '../../types';

interface ExperienceCardProps {
  experience: Experience;
  onEdit: () => void;
  onEditForm: () => void;
  onDelete: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onEdit, onEditForm, onDelete }) => {
  const [imageUrl, setImageUrl] = useState<string>('/images/cards/card-01.jpg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      setIsLoading(true);
      let finalUrl: string | null = null;

      if (experience.photos && experience.photos.length > 0) {
        // Usar la primera imagen disponible
        finalUrl = experience.photos[0];
      }

      setImageUrl(finalUrl || '/images/cards/card-01.jpg');
      setIsLoading(false);
    };

    fetchImageUrl();
  }, [experience.photos]);

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return 'Precio no especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (!duration || duration <= 0) return 'Duración no especificada';
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  };

  return (
    <div className="block rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl">
      <div className="relative h-56">
        <Link to={`/experiences/${experience.id}`} className="block w-full h-full group">
          {isLoading && <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>}
          
          <img
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer ${isLoading ? 'hidden' : 'block'}`}
            src={imageUrl}
            alt={experience.title || 'Experiencia'}
            onError={() => {
              setImageUrl('/images/cards/card-01.jpg');
            }}
            onLoad={() => setIsLoading(false)}
          />
          
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white bg-opacity-95 px-4 py-2 rounded-lg font-medium shadow-lg">
              <Eye className="w-4 h-4 inline mr-2" />
              Ver detalles
            </div>
          </div>
        </Link>
        
        {experience.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">
            Destacada
          </div>
        )}
        
        <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
          <span className="flex items-center">
            <Euro className="w-4 h-4 mr-1" />
            {formatPrice(experience.price)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/experiences/${experience.id}`} className="block">
          <h3 className="text-xl font-bold mb-2 truncate text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
            {experience.title || 'Sin título'}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{experience.location || 'Ubicación no especificada'}</span>
        </p>
        
        <div className="flex justify-between items-center text-gray-700 dark:text-gray-300 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-sm">
              <Clock className="w-5 h-5 mr-1 text-primary" />
              {formatDuration(experience.duration)}
            </span>
            <span className="flex items-center text-sm">
              <Users className="w-5 h-5 mr-1 text-primary" />
              {experience.max_participants}
            </span>
          </div>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {experience.category || 'Sin categoría'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Editar (Modal)
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onEditForm();
            }}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Editar (Form)
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard; 
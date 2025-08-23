import React from 'react';
import { Tag, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import PriceTag from '../common/PriceTag';
import { useAuth } from '../../context/AuthContext';
import { PencilIcon, TrashBinIcon } from '../../icons';

interface ExperienceCardProps {
  experience: {
    id: string;
    name: string;
    category?: string;
    photos?: string[];
    price?: number;
    // Asumimos que la location podría ser parte de la data, si no, se puede omitir o cambiar.
    location?: string; 
  };
  onEdit?: (experience: any) => void;
  onDelete?: (experienceId: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const getImageUrl = (photos: string[] | undefined) => {
    if (!photos || photos.length === 0) {
      return '/images/cards/card-02.jpg';
    }
    
    const firstPhoto = photos[0];
    
    // Check if it's an external URL (starts with http/https)
    if (firstPhoto.startsWith('http://') || firstPhoto.startsWith('https://')) {
      return firstPhoto;
    } else {
      // It's a Supabase storage path, get the public URL
      const { data } = supabase.storage
        .from('experience')
        .getPublicUrl(firstPhoto);
      return data.publicUrl || '/images/cards/card-02.jpg';
    }
  };

  const imageUrl = getImageUrl(experience.photos);

  return (
    <div className="block rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-56">
        <img className="w-full h-full object-cover" src={imageUrl} alt={experience.name} />
        {experience.price && (
          <PriceTag 
            price={experience.price} 
            size="sm" 
            className="absolute top-3 right-3"
            showPerDay={experience.category !== 'greenfees'}
          />
        )}
        
        {/* Botones de acción para administradores */}
        {isAdmin && onEdit && onDelete && (
          <div className="absolute top-3 left-3 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(experience);
              }}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title="Editar experiencia"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(experience.id);
              }}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Eliminar experiencia"
            >
              <TrashBinIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <Link to={`/experiences/${experience.id}`} className="block p-4">
        {experience.category && (
          <p className="text-sm text-primary font-semibold mb-1 flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              {experience.category}
          </p>
        )}
        <h3 className="text-xl font-bold mb-2 truncate text-gray-900 dark:text-white">{experience.name}</h3>
        {/* Ejemplo de cómo mostrar una ubicación si estuviera disponible */}
        {experience.location && (
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{experience.location}</span>
          </p>
        )}
        {/* Podríamos añadir un botón o más info aquí */}
      </Link>
    </div>
  );
};

export default ExperienceCard; 
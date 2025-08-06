import React from 'react';
import { Tag, Euro, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

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
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const imageUrl = experience.photos && experience.photos.length > 0 ? experience.photos[0] : '/public/images/cards/card-02.jpg';

  return (
    <Link to={`/experiencias/${experience.id}`} className="block rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-56">
        <img className="w-full h-full object-cover" src={imageUrl} alt={experience.name} />
        {experience.price && (
          <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
            <span className="flex items-center">
              <Euro className="w-4 h-4 mr-1" />
              {experience.price}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
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
      </div>
    </Link>
  );
};

export default ExperienceCard; 
import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Users, MapPin, Euro, Calendar } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    image_paths?: string[];
    precio_entresemana?: number;
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    location: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  const imageUrl = property.image_paths && property.image_paths.length > 0 ? property.image_paths[0] : '/public/images/cards/card-01.jpg';

  return (
    <div className="block rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300">
      <div className="relative h-56">
        <img className="w-full h-full object-cover" src={imageUrl} alt={property.title} />
        <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
          <span className="flex items-center">
            <Euro className="w-4 h-4 mr-1" />
            {property.precio_entresemana} / noche
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 truncate text-gray-900 dark:text-white">{property.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{property.location}</span>
        </p>
        <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-sm"><BedDouble className="w-5 h-5 mr-1 text-primary" /> {property.bedrooms || 0}</span>
            <span className="flex items-center text-sm"><Bath className="w-5 h-5 mr-1 text-primary" /> {property.bathrooms || 0}</span>
            <span className="flex items-center text-sm"><Users className="w-5 h-5 mr-1 text-primary" /> {property.toilets || 0}</span>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/calendar-management/${property.id}`}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" />
              Calendario
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit();
              }}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Editar
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
    </div>
  );
};

export default PropertyCard; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Users, MapPin, Euro, Calendar, Eye } from 'lucide-react';
import { getImageUrlWithFallback, getAllImageUrls } from '../../lib/supabaseStorage';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onEdit: () => void;
  onDelete: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  // 1. Estado para almacenar la URL de la imagen. Inicia con un placeholder.
  const [imageUrl, setImageUrl] = useState<string>('/images/cards/card-01.jpg');
  const [isLoading, setIsLoading] = useState(true);

  // 2. useEffect para buscar la URL de la imagen de forma asíncrona.
  useEffect(() => {
    const fetchImageUrl = async () => {
      setIsLoading(true);
      let finalUrl: string | null = null;

      // Unir la imagen principal y las secundarias para buscar la primera que sea válida
      const imagePaths = [
        property.main_image_path,
        ...(property.image_paths || [])
      ].filter(Boolean) as string[]; // Filtra valores nulos o undefined

      if (imagePaths.length > 0) {
        // Usar la misma lógica que PropertyDetails
        const allImageUrls = getAllImageUrls(property.image_paths);
        const mainImageUrl = property.main_image_path ? getImageUrlWithFallback([property.main_image_path]) : null;
        
        // Usar la primera imagen disponible
        finalUrl = mainImageUrl || (allImageUrls.length > 0 ? allImageUrls[0] : null);
      }

      // 3. Actualizar el estado con la URL obtenida o mantener el placeholder si no se encuentra ninguna
      setImageUrl(finalUrl || '/images/cards/card-01.jpg');
      setIsLoading(false);
    };

    fetchImageUrl();
  }, [property.main_image_path, property.image_paths]); // Se ejecuta si las imágenes de la propiedad cambian

  return (
    <div className="block rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl">
      <div className="relative h-56">
        <Link to={`/properties/${property.id}`} className="block w-full h-full group">
          {/* Muestra un esqueleto de carga mientras se obtiene la imagen */}
          {isLoading && <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>}
          
          <img
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer ${isLoading ? 'hidden' : 'block'}`}
            src={imageUrl}
            alt={property.title}
            // 4. El onError ahora es un último recurso por si la URL de Supabase falla
            onError={() => {
              setImageUrl('/images/cards/card-01.jpg');
            }}
            onLoad={() => setIsLoading(false)} // Opcional: oculta el esqueleto cuando la imagen carga
          />
          
          {/* Overlay que cambia su propia opacidad en hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white bg-opacity-95 px-4 py-2 rounded-lg font-medium shadow-lg">
              <Eye className="w-4 h-4 inline mr-2" />
              Ver detalles
            </div>
          </div>
        </Link>
        <div className="absolute top-2 right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
          <span className="flex items-center">
            <Euro className="w-4 h-4 mr-1" />
            {property.precio_entresemana || 0} / noche
          </span>
        </div>
      </div>
      <div className="p-4">
        <Link to={`/properties/${property.id}`} className="block">
          <h3 className="text-xl font-bold mb-2 truncate text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">{property.title}</h3>
        </Link>
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
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
        <Link to={`/property/${property.id}`} className="block w-full h-full group">
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
        {/* Badge de precio mensual destacado */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-base font-bold px-4 py-2 rounded-xl shadow-lg border-2 border-white/20">
          <span className="flex items-center">
            <Euro className="w-5 h-5 mr-1" />
            {property.precio_mes || 0} / mes
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/property/${property.id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer truncate">
              {property.title}
            </h3>
          </Link>
          
          {/* Botones de acción */}
          <div className="flex gap-2 ml-2">
            <button
              onClick={onEdit}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Eliminar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{property.location}</span>
        </p>
        
        {/* Información de la propiedad */}
        <div className="flex justify-between items-center text-gray-700 dark:text-gray-300 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-sm">
              <BedDouble className="w-5 h-5 mr-1 text-blue-600" /> 
              {property.bedrooms || 0}
            </span>
            <span className="flex items-center text-sm">
              <Bath className="w-5 h-5 mr-1 text-blue-600" /> 
              {property.bathrooms || 0}
            </span>
            <span className="flex items-center text-sm">
              <Users className="w-5 h-5 mr-1 text-blue-600" /> 
              {property.toilets || 0}
            </span>
          </div>
        </div>
        
        {/* Precio por día */}
        <div className="flex justify-between items-center text-sm mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-gray-600">Precio por día:</span>
          <span className="font-semibold text-blue-600">
            {property.precio_dia || property.precio_entresemana || 0}€
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 
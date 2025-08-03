import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Users, MapPin, Euro, Calendar } from 'lucide-react';
import { getImageUrlWithFallback, getAllImageUrls } from '../../lib/supabaseStorage';
import { Property } from '../../types';

interface PublicPropertyCardProps {
  property: Property;
}

const PublicPropertyCard: React.FC<PublicPropertyCardProps> = ({ property }) => {
  const [imageUrl, setImageUrl] = useState<string>('/images/cards/card-01.jpg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      setIsLoading(true);
      let finalUrl: string | null = null;

      const imagePaths = [
        property.main_image_path,
        ...(property.image_paths || [])
      ].filter(Boolean) as string[];

      if (imagePaths.length > 0) {
        const allImageUrls = getAllImageUrls(property.image_paths);
        const mainImageUrl = property.main_image_path ? getImageUrlWithFallback([property.main_image_path]) : null;
        
        finalUrl = mainImageUrl || (allImageUrls.length > 0 ? allImageUrls[0] : null);
      }

      setImageUrl(finalUrl || '/images/cards/card-01.jpg');
      setIsLoading(false);
    };

    fetchImageUrl();
  }, [property.main_image_path, property.image_paths]);

  const formatPrice = (price: number | undefined) => {
    if (!price) return '0';
    return new Intl.NumberFormat('es-ES').format(price);
  };

  const getSeasonLabel = (seasonKey: string) => {
    const seasonLabels: { [key: string]: string } = {
      'sep_may': 'Sep-May',
      'sep_jun': 'Sep-Jun',
      'oct_jul': 'Oct-Jul',
      'nov_aug': 'Nov-Ago',
      'dec_sep': 'Dic-Sep',
      'jan_oct': 'Ene-Oct',
      'feb_nov': 'Feb-Nov',
      'mar_dec': 'Mar-Dic',
      'apr_jan': 'Abr-Ene',
      'may_feb': 'May-Feb',
      'jun_mar': 'Jun-Mar',
      'jul_apr': 'Jul-Abr',
      'aug_may': 'Ago-May'
    };
    return seasonLabels[seasonKey] || seasonKey;
  };

  return (
    <div className="block rounded-lg shadow-lg overflow-hidden bg-white dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl">
      <div className="relative h-56">
        <Link to={`/properties/${property.id}`} className="block w-full h-full group">
          {isLoading && <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>}
          
          <img
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer ${isLoading ? 'hidden' : 'block'}`}
            src={imageUrl}
            alt={property.title}
            onError={() => {
              setImageUrl('/images/cards/card-01.jpg');
            }}
            onLoad={() => setIsLoading(false)}
          />
          
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white bg-opacity-95 px-4 py-2 rounded-lg font-medium shadow-lg">
              <Calendar className="w-4 h-4 inline mr-2" />
              Ver detalles
            </div>
          </div>
        </Link>
        
        {/* Badge de precio por día */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          <span className="flex items-center">
            <Euro className="w-4 h-4 mr-1" />
            {formatPrice(property.precio_dia || property.precio_entresemana)} / día
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/properties/${property.id}`} className="block">
          <h3 className="text-xl font-bold mb-2 truncate text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {property.title}
          </h3>
        </Link>
        
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
        
        {/* Precios */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Precio mensual:</span>
            <span className="font-semibold text-green-600">
              {formatPrice(property.precio_mes)}€
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Entre semana:</span>
            <span className="font-semibold text-blue-600">
              {formatPrice(property.precio_entresemana)}€
            </span>
          </div>
          {property.precio_fin_de_semana && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Fin de semana:</span>
              <span className="font-semibold text-purple-600">
                {formatPrice(property.precio_fin_de_semana)}€
              </span>
            </div>
          )}
        </div>
        
        {/* Temporadas disponibles */}
        {property.meses_temporada && property.meses_temporada.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Temporadas disponibles:</p>
            <div className="flex flex-wrap gap-1">
              {property.meses_temporada.slice(0, 3).map((season, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {getSeasonLabel(season)}
                </span>
              ))}
              {property.meses_temporada.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{property.meses_temporada.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPropertyCard; 
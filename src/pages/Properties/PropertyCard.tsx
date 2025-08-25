import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Bath, Users, MapPin, Euro, Eye, Heart, Star, Calendar, Clock, ExternalLink } from 'lucide-react';
import { getImageUrlWithFallback, getAllImageUrls } from '../../lib/supabaseStorage';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onEdit: () => void;
  onDelete: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onEdit, onDelete }) => {
  const [imageUrl, setImageUrl] = useState<string>('/images/cards/card-01.jpg');
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

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
      'sep_may': 'Septiembre a Mayo',
      'sep_jun': 'Septiembre a Junio',
      'sep_jul': 'Septiembre a Julio',
      'oct_may': 'Octubre a Mayo',
      'oct_jun': 'Octubre a Junio',
      'oct_jul': 'Octubre a Julio',
      'nov_aug': 'Noviembre a Agosto',
      'dec_sep': 'Diciembre a Septiembre',
      'jan_oct': 'Enero a Octubre',
      'feb_nov': 'Febrero a Noviembre',
      'mar_dec': 'Marzo a Diciembre',
      'apr_jan': 'Abril a Enero',
      'may_feb': 'Mayo a Febrero',
      'jun_mar': 'Junio a Marzo',
      'jul_apr': 'Julio a Abril',
      'aug_may': 'Agosto a Mayo'
    };
    return seasonLabels[seasonKey] || seasonKey;
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-700">
      {/* Imagen principal */}
      <div className="relative h-64 overflow-hidden">
        <Link to={`/property/${property.id}`} className="block w-full h-full">
          {/* Esqueleto de carga */}
          {isLoading && (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse"></div>
          )}
          
          <img
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isLoading ? 'hidden' : 'block'}`}
            src={imageUrl}
            alt={property.title}
            onError={() => {
              setImageUrl('/images/cards/card-01.jpg');
            }}
            onLoad={() => setIsLoading(false)}
          />
          
          {/* Overlay con información */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
                  <Eye size={16} />
                  Ver detalles
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Badge destacada */}
        {property.destacada && (
          <div className="absolute top-3 left-3">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Star size={12} className="fill-current" />
              Destacada
            </div>
          </div>
        )}

        {/* Badge de precio mensual */}
        <div className="absolute top-3 right-3">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-xl shadow-lg border-2 border-white/20">
            <div className="flex items-center gap-1 text-sm font-bold">
              <Euro size={16} />
              {formatPrice(property.precio_mes)}
            </div>
            <div className="text-xs opacity-90">/ mes</div>
          </div>
        </div>

        {/* Botón de favorito - Esquina inferior derecha */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
        </button>

        {/* Botón de Idealista - Esquina inferior izquierda */}
        {property.url_idealista && (
          <a
            href={property.url_idealista}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg"
            title="Ver en Idealista"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      {/* Contenido de la card */}
      <div className="p-5">
        {/* Título y botones de acción */}
        <div className="flex justify-between items-start mb-3">
          <Link to={`/property/${property.id}`} className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer line-clamp-2 leading-tight">
              {property.title}
            </h3>
          </Link>
          
          {/* Botones de acción */}
          <div className="flex gap-1 ml-3">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 transform hover:scale-110"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 transform hover:scale-110"
              title="Eliminar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Ubicación */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <MapPin size={16} className="text-blue-500" />
          <span className="text-sm font-medium truncate">{property.location}</span>
        </div>
        
         {/* Características principales - Solo iconos y números */}
         <div className="grid grid-cols-3 gap-3 mb-4">
           <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
             <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center mx-auto mb-1">
               <BedDouble size={16} className="text-blue-600" />
             </div>
             <p className="text-sm font-bold text-gray-900 dark:text-white">{property.bedrooms || 0}</p>
           </div>
           
           <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
             <div className="w-6 h-6 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center mx-auto mb-1">
               <Bath size={16} className="text-green-600" />
             </div>
             <p className="text-sm font-bold text-gray-900 dark:text-white">{property.bathrooms || 0}</p>
           </div>
           
           <div className="text-center p-2 bg-purple-50 dark:bg-purple-800 rounded-xl">
             <div className="w-6 h-6 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center mx-auto mb-1">
               <Users size={16} className="text-purple-600" />
             </div>
             <p className="text-sm font-bold text-gray-900 dark:text-white">{property.toilets || 0}</p>
           </div>
         </div>
         

        
                 {/* Precios combinados en una fila */}
         <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200 dark:border-gray-600 mb-4">
           <div className="grid grid-cols-2 gap-4">
             {/* Precio mensual */}
             <div className="text-center">
               <div className="flex items-center justify-center gap-1 mb-1">
                 <Euro size={16} className="text-green-600" />
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensual:</span>
               </div>
               <div className="text-xl font-bold text-green-600">
                 {formatPrice(property.precio_mes)}€
               </div>
               <div className="text-xs text-green-600 opacity-80">(90 días mínimo)</div>
             </div>
             
             {/* Precio por día */}
             <div className="text-center">
               <div className="flex items-center justify-center gap-1 mb-1">
                 <Calendar size={16} className="text-blue-600" />
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Por día:</span>
               </div>
               <div className="text-xl font-bold text-blue-600">
                 {formatPrice(property.precio_dia || property.precio_entresemana || 0)}€
               </div>
               <div className="text-xs text-blue-600 opacity-80">(15-90 días)</div>
             </div>
           </div>
         </div>

        {/* Temporadas disponibles */}
        {property.meses_temporada && Array.isArray(property.meses_temporada) && property.meses_temporada.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temporadas disponibles:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {property.meses_temporada.slice(0, 4).map((season, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {getSeasonLabel(season)}
                </span>
              ))}
              {property.meses_temporada.length > 4 && (
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full font-medium">
                  +{property.meses_temporada.length - 4} más
                </span>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default PropertyCard; 
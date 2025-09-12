import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, BedDouble, Bath, Users, Star, Filter, SortAsc, SortDesc } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { usePropertyFavorites } from '../../hooks/usePropertyFavorites';
import { Property } from '../../types';

interface FavoriteProperty extends Property {
  favorite_id: string;
}

type SortOption = 'date' | 'price' | 'name';
type SortOrder = 'asc' | 'desc';

const FavoriteProperties: React.FC = () => {
  const [favoriteProperties, setFavoriteProperties] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const { favorites, removeFromFavorites } = usePropertyFavorites();

  useEffect(() => {
    if (favorites.length > 0) {
      fetchFavoriteProperties();
    } else {
      setFavoriteProperties([]);
      setLoading(false);
    }
  }, [favorites]);

  const fetchFavoriteProperties = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          location,
          main_image_path,
          image_paths,
          precio_mes,
          precio_entresemana,
          bedrooms,
          bathrooms,
          toilets,
          destacada,
          created_at
        `)
        .in('id', favorites)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorite properties:', error);
        return;
      }

      // Agregar el ID del favorito a cada propiedad
      const propertiesWithFavoriteId = data?.map(property => ({
        ...property,
        favorite_id: favorites.find(favId => favId === property.id) || ''
      })) || [];

      setFavoriteProperties(propertiesWithFavoriteId);
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    const success = await removeFromFavorites(propertyId);
    if (success) {
      setFavoriteProperties(prev => prev.filter(prop => prop.id !== propertyId));
    }
  };

  const getImageUrl = (mainImagePath: string | null | undefined, imagePaths: string[] | null | undefined) => {
    if (mainImagePath) {
      if (mainImagePath.startsWith('http://') || mainImagePath.startsWith('https://')) {
        return mainImagePath;
      }
      const { data } = supabase.storage
        .from('properties')
        .getPublicUrl(mainImagePath);
      return data.publicUrl;
    }
    
    if (imagePaths && imagePaths.length > 0) {
      const firstImage = imagePaths[0];
      if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
        return firstImage;
      }
      const { data } = supabase.storage
        .from('properties')
        .getPublicUrl(firstImage);
      return data.publicUrl;
    }
    
    return '/images/cards/card-01.jpg';
  };

  const formatPrice = (price: number | undefined) => {
    if (!price) return '0';
    return new Intl.NumberFormat('es-ES').format(price);
  };

  const sortProperties = (properties: FavoriteProperty[]) => {
    return [...properties].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'price':
          aValue = a.precio_mes || 0;
          bValue = b.precio_mes || 0;
          break;
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.created_at || '');
          bValue = new Date(b.created_at || '');
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filteredAndSortedProperties = sortProperties(
    favoriteProperties.filter(property => {
      const price = property.precio_mes || 0;
      return price >= priceRange.min && price <= priceRange.max;
    })
  );

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Mis Propiedades Favoritas
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredAndSortedProperties.length} favorita{filteredAndSortedProperties.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Filtros"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filtros y Ordenamiento */}
      <div className={`mb-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          {/* Ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="date">Fecha</option>
              <option value="price">Precio</option>
              <option value="name">Nombre</option>
            </select>
          </div>

          {/* Dirección del ordenamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orden
            </label>
            <button
              onClick={toggleSortOrder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center gap-2"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>
          </div>

          {/* Rango de precios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rango de precio mensual
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {filteredAndSortedProperties.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Heart className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">No tienes propiedades favoritas</p>
          <p className="text-sm text-gray-400 mb-4">¡Explora nuestras propiedades y marca tus favoritas!</p>
          <Link
            to="/search?type=properties"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Explorar Propiedades
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedProperties.map((property) => (
            <div key={property.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="flex">
                {/* Imagen */}
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                  <img
                    src={getImageUrl(property.main_image_path, property.image_paths)}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/cards/card-01.jpg';
                    }}
                  />
                </div>
                
                {/* Contenido */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>
                    
                    {/* Botón de quitar favorito */}
                    <button
                      onClick={() => handleRemoveFavorite(property.id)}
                      className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                      title="Quitar de favoritos"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  
                  {/* Características */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <BedDouble className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms || 0}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathrooms || 0}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{property.toilets || 0}</span>
                    </div>
                  </div>
                  
                  {/* Precios */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {property.precio_mes && (
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Mensual:</span>
                          <span className="ml-1 font-semibold text-green-600">
                            €{formatPrice(property.precio_mes)}
                          </span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Diario:</span>
                        <span className="ml-1 font-semibold text-blue-600">
                          €{formatPrice(property.precio_dia)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Badge destacada */}
                    {property.destacada && (
                      <div className="flex items-center text-xs text-yellow-600">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Destacada
                      </div>
                    )}
                  </div>
                  
                  {/* Botón de ver detalles */}
                  <div className="mt-3">
                    <Link
                      to={`/property/${property.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteProperties;

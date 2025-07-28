import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getImageUrlWithFallback, getAllImageUrls, getSupabasePublicUrl } from '../lib/supabaseStorage';

interface Property {
  id: string;
  title: string;
  main_image_path?: string | null;
  image_paths?: string[] | null;
  location: string;
  precio_entresemana?: number;
}

const PropertyImageTest: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, main_image_path, image_paths, location, precio_entresemana')
        .limit(10);

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      setProperties(data || []);
      console.log('Properties loaded:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testImageUrl = (property: Property) => {
    const fallbackUrl = getImageUrlWithFallback(property.image_paths, property.main_image_path);
    const allUrls = getAllImageUrls(property.image_paths);
    
    console.log('Testing property:', property.title);
    console.log('Main image path:', property.main_image_path);
    console.log('Image paths:', property.image_paths);
    console.log('Fallback URL:', fallbackUrl);
    console.log('All URLs:', allUrls);
    
    return { fallbackUrl, allUrls };
  };

  if (loading) {
    return <div className="p-4">Cargando propiedades...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Prueba de Imágenes de Propiedades</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const { fallbackUrl, allUrls } = testImageUrl(property);
          
          return (
            <div key={property.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{property.location}</p>
              
              {/* Imagen principal */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Imagen Principal:</h4>
                <img 
                  src={fallbackUrl} 
                  alt={property.title}
                  className="w-full h-48 object-cover rounded"
                  onError={(e) => {
                    console.log(`Error loading main image for ${property.title}:`, fallbackUrl);
                    e.currentTarget.src = '/images/cards/card-01.jpg';
                  }}
                  onLoad={() => {
                    console.log(`Main image loaded for ${property.title}:`, fallbackUrl);
                  }}
                />
                <p className="text-xs mt-1 text-gray-500 truncate">{fallbackUrl}</p>
              </div>

              {/* Información de debugging */}
              <div className="text-xs space-y-1">
                <p><strong>Main Image Path:</strong> {property.main_image_path || 'null'}</p>
                <p><strong>Image Paths:</strong> {property.image_paths ? property.image_paths.length : 0} items</p>
                <p><strong>All URLs:</strong> {allUrls.length} valid URLs</p>
                {property.image_paths && property.image_paths.length > 0 && (
                  <div>
                    <p><strong>First Image Path:</strong> {property.image_paths[0]}</p>
                    <p><strong>First URL:</strong> {getSupabasePublicUrl(property.image_paths[0])}</p>
                  </div>
                )}
              </div>

              {/* Galería de todas las imágenes */}
              {allUrls.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Galería ({allUrls.length} imágenes):</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {allUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={url} 
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                          onError={(e) => {
                            console.log(`Error loading gallery image ${index + 1} for ${property.title}:`, url);
                            e.currentTarget.src = '/images/cards/card-01.jpg';
                          }}
                          onLoad={() => {
                            console.log(`Gallery image ${index + 1} loaded for ${property.title}:`, url);
                          }}
                        />
                        <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para seleccionar */}
              <button 
                onClick={() => setSelectedProperty(property)}
                className="mt-4 w-full btn btn-primary btn-sm"
              >
                Ver Detalles
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal para detalles */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedProperty.title}</h2>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="btn btn-sm btn-outline"
              >
                Cerrar
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Información de la Propiedad:</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
                  {JSON.stringify(selectedProperty, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">URLs Generadas:</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto">
                  {JSON.stringify(testImageUrl(selectedProperty), null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageTest; 
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getImageUrlWithFallback, getAllImageUrls, getSupabasePublicUrl } from '../lib/supabaseStorage';

interface ImageDebuggerProps {
  propertyId?: string;
}

const ImageDebugger: React.FC<ImageDebuggerProps> = ({ propertyId }) => {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});

  const fetchProperty = async () => {
    if (!propertyId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        return;
      }

      setProperty(data);
      
      // Debug info
      const debug = {
        propertyId,
        mainImagePath: data.main_image_path,
        imagePaths: data.image_paths,
        mainImageUrl: data.main_image_path ? getSupabasePublicUrl(data.main_image_path) : null,
        firstImageUrl: data.image_paths && data.image_paths.length > 0 
          ? getSupabasePublicUrl(data.image_paths[0]) 
          : null,
        allImageUrls: getAllImageUrls(data.image_paths),
        fallbackUrl: getImageUrlWithFallback(data.image_paths, data.main_image_path)
      };
      
      setDebugInfo(debug);
      console.log('Debug info:', debug);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (!property) {
    return <div className="p-4">No se encontró la propiedad</div>;
  }

  return (
    <div className="p-6 border rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4">Debug de Imágenes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de la propiedad */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Información de la Propiedad</h3>
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {property.id}</p>
            <p><strong>Título:</strong> {property.title}</p>
            <p><strong>Main Image Path:</strong> {property.main_image_path || 'No definido'}</p>
            <p><strong>Image Paths:</strong> {property.image_paths ? property.image_paths.length : 0} imágenes</p>
          </div>
        </div>

        {/* URLs generadas */}
        <div>
          <h3 className="text-lg font-semibold mb-3">URLs Generadas</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Main Image URL:</strong> {debugInfo.mainImageUrl || 'No disponible'}</p>
            <p><strong>First Image URL:</strong> {debugInfo.firstImageUrl || 'No disponible'}</p>
            <p><strong>Fallback URL:</strong> {debugInfo.fallbackUrl}</p>
            <p><strong>Total URLs:</strong> {debugInfo.allImageUrls?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Vista previa de imágenes */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Vista Previa de Imágenes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {debugInfo.allImageUrls?.map((url: string, index: number) => (
            <div key={index} className="border rounded-lg p-2">
              <img 
                src={url} 
                alt={`Imagen ${index + 1}`}
                className="w-full h-24 object-cover rounded"
                onError={(e) => {
                  console.log(`Error loading image ${index + 1}:`, url);
                                        e.currentTarget.src = '/images/cards/card-01.jpg';
                }}
                onLoad={() => {
                  console.log(`Image ${index + 1} loaded successfully:`, url);
                }}
              />
              <p className="text-xs mt-1 truncate">{url}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Imagen principal */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Imagen Principal (Fallback)</h3>
        <div className="border rounded-lg p-4">
          <img 
            src={debugInfo.fallbackUrl} 
            alt="Imagen principal"
            className="w-full max-w-md h-48 object-cover rounded"
            onError={(e) => {
              console.log('Error loading main image:', debugInfo.fallbackUrl);
                                  e.currentTarget.src = '/images/cards/card-01.jpg';
            }}
            onLoad={() => {
              console.log('Main image loaded successfully:', debugInfo.fallbackUrl);
            }}
          />
          <p className="text-sm mt-2">{debugInfo.fallbackUrl}</p>
        </div>
      </div>

      {/* Botón para recargar */}
      <div className="mt-6">
        <button 
          onClick={fetchProperty}
          className="btn btn-primary"
        >
          Recargar Datos
        </button>
      </div>
    </div>
  );
};

export default ImageDebugger; 
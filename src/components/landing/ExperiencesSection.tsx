import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

interface Experience {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  photos: string[];
  featured: boolean;
}

const ExperiencesSection = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get proper image URL for experiences
  const getExperienceImageUrl = (photos: string[] | undefined) => {
    if (!photos || photos.length === 0) {
      return "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible";
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
      return data.publicUrl || "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible";
    }
  };

  useEffect(() => {
    const fetchFeaturedExperiences = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .limit(6);

        if (error) {
          console.error('Error fetching featured experiences:', error);
        } else {
          console.log('Featured experiences data:', data);
          setFeaturedExperiences(data || []);
        }
      } catch (error) {
        console.error('Error fetching featured experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedExperiences();
  }, []);

  const formatPrice = (price: number) => {
    console.log('Formatting price:', price);
    if (!price || price <= 0) return 'Precio no especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };



  if (loading) {
    return (
      <section id="experiences" className="py-20 px-4 md:px-8 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Experiencias Únicas Fuera de Temporada
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="experiences" className="py-20 px-4 md:px-8 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
        Experiencias Únicas Fuera de Temporada
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {featuredExperiences.map((experience) => (
          <div key={experience.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative">
              <img
                src={getExperienceImageUrl(experience.photos)}
                alt={experience.name || 'Experiencia'}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible";
                }}
              />
              {experience.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-sm font-bold px-3 py-2 rounded-full shadow-lg border-2 border-yellow-300">
                  ⭐ Destacada
                </div>
              )}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg border-2 border-white">
                {formatPrice(experience.price || 0)}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {experience.name || 'Sin título'}
              </h3>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {experience.description || 'Descripción no disponible'}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{experience.location || 'Ubicación no especificada'}</span>
              </div>
              
              {/* Precio destacado en la parte inferior */}
              <div className="mb-4 text-center">
                <div className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold px-6 py-3 rounded-lg shadow-lg border-2 border-green-400">
                  {formatPrice(experience.price || 0)}
                </div>
              </div>
              
              <Link to={`/experiences/${experience.id}`}>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
                  Ver Detalles
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {featuredExperiences.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No hay experiencias destacadas disponibles</p>
          <Link to="/experiences">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              Ver Todas las Experiencias
            </button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default ExperiencesSection; 
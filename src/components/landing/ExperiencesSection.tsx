import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Experience } from '../../types';

const ExperiencesSection = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedExperiences = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('featured', true)
          .limit(6);

        if (error) {
          console.error('Error fetching featured experiences:', error);
        } else {
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
    if (!price || price <= 0) return 'Precio no especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (!duration || duration <= 0) return 'Duración no especificada';
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
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
                src={experience.photos && experience.photos.length > 0 ? experience.photos[0] : "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible"}
                alt={experience.name || 'Experiencia'}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible";
                }}
              />
              {experience.featured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">
                  Destacada
                </div>
              )}
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
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
                <span>{formatDuration(experience.duration_hours || 0)}</span>
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
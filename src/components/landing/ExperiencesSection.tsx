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
          console.log('=== DEBUG: Experiencias obtenidas ===');
          console.log('Total experiencias:', data?.length || 0);
          data?.forEach((exp, index) => {
            console.log(`Experiencia ${index + 1}:`, {
              id: exp.id,
              name: exp.name,
              price: exp.price,
              priceType: typeof exp.price,
              featured: exp.featured
            });
          });
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
    console.log('=== DEBUG: formatPrice llamado ===');
    console.log('Precio recibido:', price);
    console.log('Tipo de precio:', typeof price);
    console.log('¿Es válido?', price && price > 0);
    
    if (!price || price <= 0) return 'Consultar'; // Changed for better UX
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
      
      {/* DEBUG INFO TEMPORAL */}
      <div className="max-w-6xl mx-auto mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">🔍 DEBUG INFO:</h3>
        <p className="text-yellow-700">Total experiencias: {featuredExperiences.length}</p>
        <p className="text-yellow-700">Experiencias con precio: {featuredExperiences.filter(exp => exp.price && exp.price > 0).length}</p>
        <p className="text-yellow-700">Experiencias destacadas: {featuredExperiences.filter(exp => exp.featured).length}</p>
        <div className="mt-2">
          {featuredExperiences.map((exp, index) => (
            <div key={exp.id} className="text-sm text-yellow-600">
              {index + 1}. {exp.name} - Precio: {exp.price || 'N/A'} - Destacada: {exp.featured ? 'Sí' : 'No'}
            </div>
          ))}
        </div>
      </div>
      
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
              
              {/* --- ETIQUETA DE DESTACADO --- */}
              {experience.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  ⭐ Destacada
                </div>
              )}

              {/* --- PRECIO CON NUEVO FONDO --- */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-lg">
                {formatPrice(experience.price || 0)}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {experience.name || 'Sin título'}
              </h3>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {experience.description || 'Descripción no disponible'}
              </p>
              
              <div className="flex items-center text-sm text-gray-600 mb-4 mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{experience.location || 'Ubicación no especificada'}</span>
              </div>
              
              <Link to={`/experiences/${experience.id}`} className="mt-2">
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold">
                  Ver Detalles
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {featuredExperiences.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No hay experiencias destacadas disponibles en este momento.</p>
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
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Button from '../../components/ui/button/Button';
import { Experience, Property } from '../../types';
import { MapPinIcon, CalendarIcon, ExternalLinkIcon } from '../../icons';
import PublicPropertyCard from '../common/PublicPropertyCard';
import ExperienceCard from '../experiences/ExperienceCard';
import SimpleMap from '../common/SimpleMap';

const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [nearbyExperiences, setNearbyExperiences] = useState<Experience[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching experience:', error);
      } else {
        setExperience(data);
        // Una vez que tenemos la experiencia, buscamos las cercanas
        if (data) {
          fetchNearbyItems(data);
        }
      }
      setLoading(false);
    };

    fetchExperience();
  }, [id]);

  const fetchNearbyItems = async (currentExperience: Experience) => {
    setLoadingNearby(true);
    
    try {
      // Buscar experiencias cercanas (misma categoría o ubicación similar)
      const { data: experiencesData } = await supabase
        .from('experiences')
        .select('*')
        .neq('id', currentExperience.id)
        .eq('category', currentExperience.category)
        .limit(6);

      if (experiencesData) {
        setNearbyExperiences(experiencesData);
      }

      // Buscar propiedades cercanas (misma zona)
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .limit(6);

      if (propertiesData) {
        setNearbyProperties(propertiesData);
      }
    } catch (error) {
      console.error('Error fetching nearby items:', error);
    } finally {
      setLoadingNearby(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Función formatDuration eliminada

  // Helper function to get proper image URL for experiences
  const getExperienceImageUrl = (photos: string[] | undefined, index: number = 0) => {
    if (!photos || photos.length === 0 || !photos[index]) {
      return null;
    }
    
    const photo = photos[index];
    
    // Check if it's an external URL (starts with http/https)
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    } else {
      // It's a Supabase storage path, get the public URL
      const { data } = supabase.storage
        .from('experience')
        .getPublicUrl(photo);
      return data.publicUrl || null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Experiencia no encontrada</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">La experiencia que buscas no existe o ha sido eliminada.</p>
            <Link to="/experiences">
              <Button>Volver a Experiencias</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = getExperienceImageUrl(experience.photos, selectedImage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con navegación */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ChisReact
            </Link>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Inicio
              </Link>
              <Link to="/experiences" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Experiencias
              </Link>
              <Link to="/properties" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Propiedades
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Imágenes */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Imagen principal */}
            <div className="lg:col-span-2">
              <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={experience.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-lg">Sin imagen</span>
                  </div>
                )}
                {experience.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Destacada
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {experience.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Información principal */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {experience.name}
                </h1>

                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                  {formatPrice(experience.price || 0)}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPinIcon className="w-5 h-5 mr-3" />
                    <span>{experience.location}</span>
                  </div>
                  {/* Duración y participantes eliminados */}
                </div>

                <div className="space-y-4">
                  <Button className="w-full">
                    Reservar Experiencia
                  </Button>
                  {experience.external_url && (
                    <a
                      href={experience.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ExternalLinkIcon className="w-4 h-4 mr-2" />
                      Ver en sitio web
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Galería de imágenes */}
          {experience.photos && experience.photos.length > 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Galería de imágenes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {experience.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500' 
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={getExperienceImageUrl(experience.photos, index) || "https://placehold.co/600x400/DDDDDD/333333?text=Imagen+No+Disponible"}
                      alt={`${experience.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Descripción</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {experience.description}
          </p>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Lo que incluye */}
          {experience.what_is_included && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lo que incluye</h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: experience.what_is_included }} />
              </div>
            </div>
          )}

          {/* Lo que necesitas */}
          {experience.what_is_needed && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lo que necesitas</h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: experience.what_is_needed }} />
              </div>
            </div>
          )}
        </div>

        {/* Fechas recurrentes */}
        {experience.recurring_dates && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Fechas disponibles
            </h3>
            <div className="space-y-2">
              {experience.recurring_dates.dates && experience.recurring_dates.dates.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fechas específicas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.recurring_dates.dates.map((date, index) => (
                      <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        {new Date(date).toLocaleDateString('es-ES')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {experience.recurring_dates.days && experience.recurring_dates.days.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Días de la semana:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.recurring_dates.days.map((day, index) => (
                      <span key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2" />
            Ubicación
          </h3>
          <SimpleMap location={experience.location || 'Ubicación no especificada'} />
        </div>

        {/* Experiencias cercanas */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Experiencias similares
          </h3>
          {loadingNearby ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : nearbyExperiences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyExperiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No hay experiencias similares disponibles en este momento.
            </p>
          )}
        </div>

        {/* Propiedades cercanas */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Propiedades cercanas
          </h3>
          {loadingNearby ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : nearbyProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyProperties.map((property) => (
                <PublicPropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No hay propiedades cercanas disponibles en este momento.
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center">
          <Link to="/experiences">
            <Button variant="outline">
              Volver a Experiencias
            </Button>
          </Link>
          <div className="flex space-x-4">
            <Button variant="outline">
              Compartir
            </Button>
            <Button>
              Reservar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;

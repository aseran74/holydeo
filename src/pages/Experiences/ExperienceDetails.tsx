import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Button from '../../components/ui/button/Button';
import { Experience } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  price?: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  square_meters: number;
  main_image_path?: string | null;
  image_paths?: string[] | null;
  amenities?: string[] | null;
  precio_mes: number;
  tipo?: string;
  region?: string;
}
import { MapPinIcon, CalendarIcon, ExternalLinkIcon, ChevronLeftIcon, StarIcon, PaperPlaneIcon, PencilIcon } from '../../icons';
import GoogleMap from '../../components/common/GoogleMap';
import ExperienceCard from '../../components/experiences/ExperienceCard';
import PublicPropertyCard from '../../components/common/PublicPropertyCard';
import ExperienceBookingForm from '../../components/experiences/ExperienceBookingForm';

const ExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [nearbyExperiences, setNearbyExperiences] = useState<Experience[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNearbyItems = async (currentExperience: Experience) => {
    setLoadingNearby(true);
    try {
      // Obtener experiencias de la misma categoría
      const { data: experiencesData } = await supabase
        .from('experiences')
        .select('*')
        .neq('id', currentExperience.id)
        .eq('category', currentExperience.category)
        .limit(6);
      
      if (experiencesData) {
        setNearbyExperiences(experiencesData);
      }

      // Obtener propiedades generales
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

  // Función para refrescar los datos de la experiencia
  const refreshExperienceData = async () => {
    console.log('Refrescando datos de la experiencia...');
    setIsRefreshing(true);
    
    try {
      // Forzar la actualización de los datos
      setRefreshKey(prev => prev + 1);
      
      // También podemos forzar una nueva consulta a la base de datos
      if (id) {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error al refrescar experiencia:', error);
        } else {
          console.log('Experiencia refrescada:', data);
          setExperience(data);
          // Resetear la imagen seleccionada si es necesario
          if (data.photos && data.photos.length > 0 && selectedImage >= data.photos.length) {
            setSelectedImage(0);
          }
        }
      }
    } catch (error) {
      console.error('Error en refreshExperienceData:', error);
    } finally {
      // Esperar un poco para que se complete la actualización
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      console.log('Fetching experience con ID:', id, 'RefreshKey:', refreshKey);
      setLoading(true);
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching experience:', error);
      } else {
        console.log('Experiencia obtenida:', data);
        setExperience(data);
        // Obtener elementos cercanos después de obtener la experiencia
        fetchNearbyItems(data);
      }
      setLoading(false);
    };

    fetchExperience();
  }, [id, refreshKey]);

  // Listener para cambios en tiempo real en la experiencia
  useEffect(() => {
    if (!id) return;

    console.log('Configurando listener para experiencia:', id);

    const channel = supabase
      .channel(`experience-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'experiences',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('Cambio detectado en la experiencia:', payload);
          // Refrescar los datos cuando se detecte un cambio
          refreshExperienceData();
        }
      )
      .subscribe((status) => {
        console.log('Estado del canal:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Canal suscrito exitosamente para experiencia:', id);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error en el canal para experiencia:', id);
        }
      });

    return () => {
      console.log('Limpiando canal para experiencia:', id);
      supabase.removeChannel(channel);
    };
  }, [id]);
  
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
      console.log('No hay fotos disponibles para el índice:', index, 'Fotos:', photos);
      return null;
    }
    
    const photo = photos[index];
    console.log('Procesando foto:', photo, 'Índice:', index, 'RefreshKey:', refreshKey);
    
    // Check if it's an external URL (starts with http/https)
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      console.log('URL externa detectada:', photo);
      return photo;
    } else {
      // It's a Supabase storage path, get the public URL
      const { data } = supabase.storage
        .from('experience')
        .getPublicUrl(photo);
      // Agregar timestamp para evitar cache del navegador
      const url = data.publicUrl || null;
      const finalUrl = url ? `${url}?t=${refreshKey}` : null;
      console.log('URL de Supabase generada:', finalUrl);
      return finalUrl;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experiencia no encontrada</h2>
          <p className="text-gray-600 mb-6">La experiencia que buscas no existe o ha sido eliminada.</p>
          <Link to="/experiences">
            <Button>Volver a Experiencias</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = getExperienceImageUrl(experience.photos, selectedImage);

  return (
    <>
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header con botones de acción */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-sm"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Volver
            </button>
            
            <div className="flex gap-2">
              {/* Botón de edición para administradores */}
              {isAdmin && (
                <Link to={`/experiences/${experience.id}/edit`}>
                  <button className="btn btn-primary btn-sm">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                </Link>
              )}
              
              <button 
                onClick={refreshExperienceData}
                disabled={isRefreshing}
                className={`btn btn-outline btn-sm ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Refrescar datos"
              >
                {isRefreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {isRefreshing ? 'Refrescando...' : 'Refrescar'}
              </button>
              <button className="btn btn-outline btn-sm">
                <StarIcon className="w-4 h-4 mr-2" />
                Favorito
              </button>
              <button className="btn btn-outline btn-sm">
                <PaperPlaneIcon className="w-4 h-4 mr-2" />
                Compartir
              </button>
            </div>
          </div>

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
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-lg">Sin imagen</span>
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
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {experience.name}
                    </h1>

                    <div className="text-2xl font-bold text-blue-600 mb-6">
                      {formatPrice(experience.price || 0)}
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="w-5 h-5 mr-3" />
                        <span>{experience.location}</span>
                      </div>
                      {/* Duración y participantes eliminados */}
                    </div>

                    <div className="space-y-4">
                      <ExperienceBookingForm
                        experienceId={experience.id}
                        experienceName={experience.name}
                        experiencePrice={experience.price}
                        onSuccess={(bookingData) => {
                          console.log('Reserva de experiencia completada:', bookingData);
                        }}
                      />
                      {experience.external_url && (
                        <a
                          href={experience.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Galería de imágenes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {experience.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index 
                            ? 'border-blue-500' 
                            : 'border-transparent hover:border-gray-300'
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Ubicación
              </h3>
              <GoogleMap 
          location={experience.location || 'Ubicación no especificada'} 
          height="h-96"
          zoom={15}
          showMarker={true}
          showInfoWindow={true}
        />
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lo que incluye */}
              {experience.what_is_included && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Lo que incluye</h3>
                  <div className="prose prose-gray max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: experience.what_is_included }} />
                  </div>
                </div>
              )}

              {/* Lo que necesitas */}
              {experience.what_is_needed && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Lo que necesitas</h3>
                  <div className="prose prose-gray max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: experience.what_is_needed }} />
                  </div>
                </div>
              )}
            </div>

            {/* Fechas recurrentes */}
            {experience.recurring_dates && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Fechas disponibles
                </h3>
                <div className="space-y-2">
                  {experience.recurring_dates.dates && experience.recurring_dates.dates.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fechas específicas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.recurring_dates.dates.map((date, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {new Date(date).toLocaleDateString('es-ES')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {experience.recurring_dates.days && experience.recurring_dates.days.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Días de la semana:</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.recurring_dates.days.map((day, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experiencias similares */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Experiencias similares</h3>
              {loadingNearby ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 rounded w-2/3"></div>
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
                <p className="text-gray-500 text-center py-8">No hay experiencias similares disponibles</p>
              )}
            </div>

            {/* Propiedades cercanas */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Propiedades cercanas</h3>
              {loadingNearby ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-3 rounded w-2/3"></div>
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
                <p className="text-gray-500 text-center py-8">No hay propiedades cercanas disponibles</p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between items-center mt-8">
              <Link to="/experiences">
                <Button variant="outline">
                  Volver a Experiencias
                </Button>
              </Link>
              <div className="flex space-x-4">
                <Button variant="outline">
                  Compartir
                </Button>
                <ExperienceBookingForm
                  experienceId={experience.id}
                  experienceName={experience.name}
                  experiencePrice={experience.price}
                  onSuccess={(bookingData) => {
                    console.log('Reserva de experiencia completada:', bookingData);
                  }}
                  className="w-auto"
                />
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperienceDetails; 
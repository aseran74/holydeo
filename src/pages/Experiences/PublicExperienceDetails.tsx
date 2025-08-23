import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Button from '../../components/ui/button/Button';
import { Experience } from '../../types';
import LandingNavbar from '../../components/landing/LandingNavbar';
import { useAuth } from '../../context/AuthContext';
import { MapPinIcon, ExternalLinkIcon, ChevronLeftIcon, StarIcon, PaperPlaneIcon, PencilIcon } from '../../icons';
import { Map, MapPin } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import ExperienceCard from '../../components/experiences/ExperienceCard';
import PublicPropertyCard from '../../components/common/PublicPropertyCard';
import ExperienceBookingForm from '../../components/experiences/ExperienceBookingForm';
import FavoriteButton from '../../components/experiences/FavoriteButton';
import ShareButton from '../../components/experiences/ShareButton';

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

const PublicExperienceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [nearbyExperiences, setNearbyExperiences] = useState<Experience[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Configuración de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  const fetchNearbyItems = async (currentExperience: Experience) => {
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
    }
  };

  // Función para obtener coordenadas de la ubicación
  const getCoordinates = async (location: string) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({ address: location });
      
      if (result.results.length > 0) {
        const { lat, lng } = result.results[0].geometry.location;
        setCoordinates({ lat: lat(), lng: lng() });
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching experience:', error);
          return;
        }

        setExperience(data);
        if (data) {
          fetchNearbyItems(data);
          // Obtener coordenadas si hay ubicación
          if (data.location && isLoaded) {
            getCoordinates(data.location);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id, isLoaded]);

  const getExperienceImageUrl = (photos: string[] | undefined, index: number) => {
    if (!photos || photos.length === 0) {
      return '/images/cards/card-02.jpg';
    }
    
    const photo = photos[index] || photos[0];
    
    // Check if it's an external URL (starts with http/https)
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    } else {
      // It's a Supabase storage path, get the public URL
      const { data } = supabase.storage
        .from('experience')
        .getPublicUrl(photo);
      return data.publicUrl || '/images/cards/card-02.jpg';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <LandingNavbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <LandingNavbar />
        <div className="p-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experiencia no encontrada</h2>
            <p className="text-gray-600 mb-6">La experiencia que buscas no existe o ha sido eliminada.</p>
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
    <>
      {/* Navbar del landing page */}
      <LandingNavbar />

      <div className="p-4 mt-16">
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
              
              <FavoriteButton
                experienceId={experience.id}
                experienceName={experience.name}
                size="sm"
              />
              <ShareButton
                experienceId={experience.id}
                experienceName={experience.name}
                experienceDescription={experience.description || ''}
                size="sm"
              />
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

                {/* Galería de imágenes */}
                {experience.photos && experience.photos.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {experience.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={getExperienceImageUrl(experience.photos, index)}
                          alt={`${experience.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
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
                        className="btn btn-outline w-full"
                      >
                        <ExternalLinkIcon className="w-4 h-4 mr-2" />
                        Ver en sitio web
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">
                {experience.description || 'No hay descripción disponible para esta experiencia.'}
              </p>
            </div>
          </div>

          {/* Información adicional */}
          {(experience.what_is_included || experience.what_is_needed) && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {experience.what_is_included && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué incluye?</h3>
                  <p className="text-gray-700">{experience.what_is_included}</p>
                </div>
              )}
              
              {experience.what_is_needed && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué necesitas?</h3>
                  <p className="text-gray-700">{experience.what_is_needed}</p>
                </div>
              )}
            </div>
          )}

          {/* Mapa */}
          {experience.location && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Map size={24} className="text-primary-500" />
                Ubicación en el Mapa
              </h2>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 h-80">
                {loadError && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-red-500">
                      <MapPin size={48} className="mx-auto mb-2" />
                      <p>Error al cargar el mapa</p>
                      <p className="text-sm mt-1">Verifica tu API key de Google Maps</p>
                    </div>
                  </div>
                )}
                
                {!isLoaded ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
                      <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
                    </div>
                  </div>
                ) : coordinates ? (
                  <GoogleMap
                    mapContainerClassName="w-full h-full rounded-lg"
                    center={coordinates}
                    zoom={15}
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    <Marker
                      position={coordinates}
                      title={experience.name}
                    />
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <MapPin size={48} className="mx-auto mb-2" />
                      <p>Ubicación no disponible en el mapa</p>
                      <p className="text-sm mt-1">Esta experiencia no tiene coordenadas configuradas</p>
                    </div>
                  </div>
                )}
                
                {coordinates && (
                  <div className="mt-3 text-center">
                    <a
                      href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLinkIcon className="w-4 h-4 mr-1" />
                      Ver en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experiencias relacionadas */}
          {nearbyExperiences.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experiencias similares</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyExperiences.slice(0, 3).map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            </div>
          )}

          {/* Propiedades relacionadas */}
          {nearbyProperties.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Propiedades cercanas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyProperties.slice(0, 3).map((property) => (
                  <PublicPropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicExperienceDetails;

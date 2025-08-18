import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Camera, 
  MapPin, 
  Users, 
  Bath, 
  Wifi, 
  Car, 
  Phone, 
  Mail, 
  ExternalLink,
  Star,
  Building,
  BedDouble,
  Building2,

  Waves,
  Snowflake,
  UtensilsCrossed,
  ParkingSquare,
  Tv,
  TreePine,
  Sun,
  Moon,
  Mountain,
  MapPinIcon,
  Coffee,
  Dumbbell,
  Map,
  Compass,
  Clock,
  Tag,
} from 'lucide-react';
import { getImageUrlWithFallback, getAllImageUrls } from '../../lib/supabaseStorage';
import PageMeta from '../../components/common/PageMeta';
import BookingCalendar from '../../components/common/BookingCalendar';
import SeasonRentalForm from '../../components/common/SeasonRentalForm';
import LandingNavbar from '../../components/landing/LandingNavbar';

// Mapeo de amenities a iconos
const amenityIcons: { [key: string]: React.ReactElement } = {
  "Piscina": <Waves size={20} className="text-blue-500" />,
  "Wi-Fi": <Wifi size={20} className="text-green-500" />,
  "Aire Acondicionado": <Snowflake size={20} className="text-blue-400" />,
  "Cocina": <UtensilsCrossed size={20} className="text-orange-500" />,
  "Garaje": <ParkingSquare size={20} className="text-gray-600" />,
  "Vistas al mar": <Waves size={20} className="text-blue-600" />,
  "TV": <Tv size={20} className="text-purple-500" />,
  "Cafetera": <Coffee size={20} className="text-brown-500" />,
  "Gimnasio": <Dumbbell size={20} className="text-red-500" />,
  "Jardín": <TreePine size={20} className="text-green-600" />,
  "Terraza": <Sun size={20} className="text-yellow-500" />,
  "Balcón": <Moon size={20} className="text-indigo-500" />,
  "Estacionamiento": <Car size={20} className="text-gray-700" />,
  "Vistas a la montaña": <Mountain size={20} className="text-green-700" />,
};

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
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  main_image_path?: string | null;
  image_paths?: string[] | null;
  amenities?: string[] | null;
  precio_mes: number;
  precio_entresemana: number;
  precio_fin_de_semana: number;
  precio_dia?: number;
  alquila_temporada_completa?: boolean;
  meses_temporada?: string[] | null;
  lat?: number;
  lng?: number;
  url_idealista?: string;
  url_booking?: string;
  url_airbnb?: string;
  min_days?: number;
  max_days?: number;
  destacada?: boolean;
  created_at: string;
  owner_id?: string;
  agency_id?: string;
  tipo?: string;
  region?: string;
  // Campos para información del propietario y agencia
  owner?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
  agency?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
}

interface Experience {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  price?: number;
  duration?: string;
  location: string;
  category: string;
  rating?: number;
  distance?: number;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);

  // Configuración de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  useEffect(() => {
    if (property) {
      fetchExperiences();
    }
  }, [property]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching property with ID:', id);
      
      // Primero obtener la propiedad básica
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      console.log('Property data:', propertyData);
      console.log('Property error:', propertyError);

      if (propertyError) {
        console.error('Error fetching property:', propertyError);
        setError('No se pudo cargar la propiedad');
        return;
      }

      if (!propertyData) {
        console.error('No property data found');
        setError('Propiedad no encontrada');
        return;
      }

      // Si hay owner_id, obtener información del propietario
      let ownerData = null;
      if (propertyData.owner_id) {
        console.log('Fetching owner with ID:', propertyData.owner_id);
        
        try {
          // Primero obtener la información del owner desde la tabla owners
          const { data: ownerRecord, error: ownerError } = await supabase
            .from('owners')
            .select('*, users(*)')
            .eq('id', propertyData.owner_id)
            .single();
          
          console.log('Owner record from owners table:', { ownerRecord, ownerError });
          
          if (ownerRecord && !ownerError) {
            // Si encontramos el owner, obtener la información del usuario asociado
            if (ownerRecord.users) {
              ownerData = {
                id: ownerRecord.users.id,
                full_name: ownerRecord.users.full_name || 'Nombre no disponible',
                email: ownerRecord.users.email || 'Email no disponible',
                phone: ownerRecord.phone || null
              };
              console.log('Owner data from users table:', ownerData);
            }
          } else {
            console.log('No se encontró owner en owners table, intentando con users directamente...');
            
            // Si no encontramos en owners, intentar directamente en users
            const { data: userRecord, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', propertyData.owner_id)
              .single();
            
            console.log('User record from users table:', { userRecord, userError });
            
            if (userRecord && !userError) {
              ownerData = {
                id: userRecord.id,
                full_name: userRecord.full_name || 'Nombre no disponible',
                email: userRecord.email || 'Email no disponible',
                phone: null // No tenemos phone en users
              };
              console.log('Owner data from users table directly:', ownerData);
            }
          }
          
        } catch (ownerError) {
          console.error('Exception en consulta owner:', ownerError);
        }
      }

      // Si hay agency_id, obtener información de la agencia
      let agencyData = null;
      if (propertyData.agency_id) {
        console.log('Fetching agency with ID:', propertyData.agency_id);
        
        try {
          // Obtener información de la agencia desde la tabla agencies
          const { data: agencyRecord, error: agencyError } = await supabase
            .from('agencies')
            .select('*')
            .eq('id', propertyData.agency_id)
            .single();
          
          console.log('Agency record from agencies table:', { agencyRecord, agencyError });
          
          if (agencyRecord && !agencyError) {
            agencyData = {
              id: agencyRecord.id,
              full_name: agencyRecord.name || 'Nombre no disponible',
              email: agencyRecord.contact_email || 'Email no disponible',
              phone: agencyRecord.phone || null
            };
            console.log('Agency data from agencies table:', agencyData);
          } else {
            console.log('No se encontró agency en agencies table, intentando con users...');
            
            // Si no encontramos en agencies, intentar en users
            const { data: userRecord, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', propertyData.agency_id)
              .single();
            
            console.log('User record for agency from users table:', { userRecord, userError });
            
            if (userRecord && !userError) {
              agencyData = {
                id: userRecord.id,
                full_name: userRecord.full_name || 'Nombre no disponible',
                email: userRecord.email || 'Email no disponible',
                phone: null
              };
              console.log('Agency data from users table:', agencyData);
            }
          }
          
        } catch (agencyError) {
          console.error('Exception en consulta agency:', agencyError);
        }
      }

      // Combinar los datos
      const enrichedProperty = {
        ...propertyData,
        owner: ownerData,
        agency: agencyData
      };

      console.log('Final enriched property:', enrichedProperty);
      setProperty(enrichedProperty);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los detalles de la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    if (!property) return;
    
    try {
      setExperiencesLoading(true);
      
      // Simular experiencias cercanas basadas en la ubicación de la propiedad
      // En un caso real, esto vendría de una API o base de datos
      const mockExperiences: Experience[] = [
        {
          id: '1',
          title: 'Tour por el Casco Histórico',
          description: 'Descubre la historia y arquitectura del centro histórico',
          image_url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400&h=300&fit=crop',
          price: 25,
          duration: '2 horas',
          location: property.city || property.location,
          category: 'Cultural',
          rating: 4.8,
          distance: 0.5
        },
        {
          id: '2',
          title: 'Experiencia Gastronómica Local',
          description: 'Prueba los mejores platos de la región con un chef local',
          image_url: 'https://images.unsplash.com/photo-1414235077428-338989f2dcd0?w=400&h=300&fit=crop',
          price: 45,
          duration: '3 horas',
          location: property.city || property.location,
          category: 'Gastronomía',
          rating: 4.9,
          distance: 1.2
        },
        {
          id: '3',
          title: 'Aventura en la Naturaleza',
          description: 'Explora senderos y paisajes naturales de la zona',
          image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
          price: 35,
          duration: '4 horas',
          location: property.city || property.location,
          category: 'Aventura',
          rating: 4.7,
          distance: 2.1
        },
        {
          id: '4',
          title: 'Clase de Surf',
          description: 'Aprende a surfear con instructores certificados',
          image_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
          price: 60,
          duration: '2 horas',
          location: property.city || property.location,
          category: 'Deportes',
          rating: 4.6,
          distance: 3.5
        }
      ];

      setExperiences(mockExperiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setExperiencesLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getAmenityIcon = (amenity: string) => {
    return amenityIcons[amenity] || <Star size={20} className="text-gray-500" />;
  };

  const nextImage = () => {
    if (property?.image_paths && property.image_paths.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.image_paths!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.image_paths && property.image_paths.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.image_paths!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <MapPin size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Propiedad no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error || 'La propiedad que buscas no existe'}
        </p>
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ID de la propiedad: {id}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Error: {error}
          </p>
        </div>
        <Link
          to="/properties"
          className="btn btn-primary"
        >
          <ArrowLeft size={20} />
          Volver a Propiedades
        </Link>
      </div>
    );
  }

  // Obtener todas las URLs públicas de las imágenes
  const allImageUrls = getAllImageUrls(property.image_paths);
  const mainImageUrl = property.main_image_path ? getImageUrlWithFallback([property.main_image_path]) : null;
  
  // Combinar imágenes principales y adicionales
  const allImages = mainImageUrl 
    ? [mainImageUrl, ...allImageUrls]
    : allImageUrls;

  return (
    <>
      <PageMeta title={`${property.title} - Detalles`} description={`Detalles completos de la propiedad ${property.title}`} />

      {/* Navbar del landing page */}
      <LandingNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {/* Header con navegación */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm">
              <Heart size={16} />
              Favorito
            </button>
            <button className="btn btn-outline btn-sm">
              <Share2 size={16} />
              Compartir
            </button>
          </div>
        </div>
          {/* Galería de imágenes */}
          <div className="mb-8">
            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              {allImages.length > 0 ? (
              <>
                <img
                  src={allImages[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Controles de navegación */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      <ArrowLeft size={20} className="rotate-180" />
                    </button>
                    
                    {/* Indicadores */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Botón ver todas las imágenes */}
                {allImages.length > 1 && (
                  <button
                    onClick={() => setShowAllImages(!showAllImages)}
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm hover:bg-opacity-75 transition-all"
                  >
                    <Camera size={16} className="inline mr-1" />
                    {allImages.length} fotos
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Camera size={48} />
                <span className="ml-2">Sin imágenes</span>
              </div>
            )}
          </div>

          {/* Grid de imágenes pequeñas */}
          {showAllImages && allImages.length > 1 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-24 rounded-lg overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {/* Título y precio */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {property.title}
                </h1>
                {property.destacada && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Destacada
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{property.location}</span>
                </div>
                {property.city && (
                  <span>• {property.city}</span>
                )}
                {property.state && (
                  <span>• {property.state}</span>
                )}
              </div>

              <div className="text-3xl font-bold text-primary-600">
                {property.price ? formatPrice(property.price) : 'Precio no disponible'}
                <span className="text-lg font-normal text-gray-500">/mes</span>
              </div>
            </div>

            {/* Características principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <BedDouble size={20} className="text-primary-500" />
                <div>
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-500">Dormitorios</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Bath size={20} className="text-primary-500" />
                <div>
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-500">Baños</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Users size={20} className="text-primary-500" />
                <div>
                  <div className="font-semibold">{property.toilets}</div>
                  <div className="text-sm text-gray-500">Aseos</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Building size={20} className="text-primary-500" />
                <div>
                  <div className="font-semibold">{property.square_meters}m²</div>
                  <div className="text-sm text-gray-500">Superficie</div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Descripción</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {property.description || 'Sin descripción disponible.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ubicación */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                {property.street_address && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={16} className="text-gray-500" />
                    <span>{property.street_address}</span>
                  </div>
                )}
                {property.postal_code && (
                  <div>{property.postal_code}</div>
                )}
                {property.city && (
                  <div>{property.city}</div>
                )}
                {property.state && (
                  <div>{property.state}</div>
                )}
                {property.country && (
                  <div>{property.country}</div>
                )}
              </div>
            </div>

            {/* Mapa */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Map size={24} className="text-primary-500" />
                Ubicación en el Mapa
              </h3>
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
                ) : property.lat && property.lng ? (
                  <GoogleMap
                    mapContainerClassName="w-full h-full rounded-lg"
                    center={{ lat: property.lat, lng: property.lng }}
                    zoom={15}
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    <Marker
                      position={{ lat: property.lat, lng: property.lng }}
                      title={property.title}
                    />
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <MapPin size={48} className="mx-auto mb-2" />
                      <p>Ubicación no disponible en el mapa</p>
                      <p className="text-sm mt-1">Esta propiedad no tiene coordenadas configuradas</p>
                    </div>
                  </div>
                )}
                
                {property.lat && property.lng && (
                  <div className="mt-3 text-center">
                    <a
                      href={`https://www.google.com/maps?q=${property.lat},${property.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Ver en Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Experiencias Cercanas */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Compass size={24} className="text-primary-500" />
                Experiencias Cercanas
              </h3>
              
              {experiencesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : experiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {experiences.map((experience) => (
                    <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={experience.image_url}
                          alt={experience.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                          {experience.category}
                        </div>
                        {experience.rating && (
                          <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            <span>{experience.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {experience.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {experience.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{experience.duration}</span>
                          </div>
                          {experience.distance && (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{experience.distance} km</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {experience.price && (
                            <div className="font-semibold text-primary-600">
                              {formatPrice(experience.price)}
                            </div>
                          )}
                          <button className="btn btn-outline btn-sm">
                            <Tag size={14} className="mr-1" />
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Compass size={48} className="mx-auto mb-2" />
                  <p>No hay experiencias disponibles en esta zona</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de contacto */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>

              {property.owner && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Propietario</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <span className="font-medium">{property.owner.full_name}</span>
                    </div>
                    {property.owner.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{property.owner.email}</span>
                      </div>
                    )}
                    {property.owner.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{property.owner.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {property.agency && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Agencia</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-500" />
                      <span className="font-medium">{property.agency.full_name}</span>
                    </div>
                    {property.agency.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{property.agency.email}</span>
                      </div>
                    )}
                    {property.agency.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{property.agency.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mostrar IDs como fallback si no hay información completa */}
              {!property.owner && property.owner_id && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Propietario</h4>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">ID: {property.owner_id}</span>
                  </div>
                </div>
              )}

              {!property.agency && property.agency_id && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Agencia</h4>
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">ID: {property.agency_id}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button className="btn btn-primary flex-1">
                  <Phone size={16} />
                  Contactar
                </button>
                <button className="btn btn-outline">
                  <Mail size={16} />
                </button>
              </div>
            </div>

            {/* Precios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Precios</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Precio mensual:</span>
                  <span className="font-semibold">{formatPrice(property.precio_mes)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entre semana:</span>
                  <span className="font-semibold">{formatPrice(property.precio_entresemana)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fin de semana:</span>
                  <span className="font-semibold">{formatPrice(property.precio_fin_de_semana)}</span>
                </div>
                {property.precio_dia && (
                  <div className="flex justify-between">
                    <span>Por día:</span>
                    <span className="font-semibold">{formatPrice(property.precio_dia)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enlaces externos */}
            {(property.url_idealista || property.url_booking || property.url_airbnb) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                <h3 className="text-lg font-semibold mb-4">Ver en otras plataformas</h3>
                <div className="space-y-2">
                  {property.url_idealista && (
                    <a
                      href={property.url_idealista}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span>Idealista</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {property.url_booking && (
                    <a
                      href={property.url_booking}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span>Booking.com</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {property.url_airbnb && (
                    <a
                      href={property.url_airbnb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span>Airbnb</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Calendario de Reservas por Días Sueltos */}
            <BookingCalendar
              propertyId={property.id}
              precioDia={property.precio_dia || property.precio_entresemana}
              onBookingComplete={(bookingData) => {
                console.log('Reserva completada:', bookingData);
                // Aquí puedes manejar la reserva completada
              }}
            />

            {/* Formulario de Alquiler de Temporada Completa */}
            <SeasonRentalForm
              propertyId={property.id}
              propertyName={property.title}
              precioMes={property.precio_mes}
              alquilaTemporadaCompleta={property.alquila_temporada_completa}
              onSuccess={(rentalData) => {
                console.log('Alquiler de temporada solicitado:', rentalData);
                // Aquí puedes manejar la solicitud de alquiler
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails; 
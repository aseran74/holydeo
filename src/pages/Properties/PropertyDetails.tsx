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
  price: number;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  square_meters: number;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  main_image_path?: string;
  image_paths?: string[];
  amenities?: string[];
  precio_mes: number;
  precio_entresemana: number;
  precio_dia?: number;
  precio_fin_de_semana: number;
  alquila_temporada_completa?: boolean;
  meses_temporada?: string[];
  lat?: number;
  lng?: number;
  url_idealista?: string;
  url_booking?: string;
  url_airbnb?: string;
  min_days?: number;
  max_days?: number;
  destacada?: boolean;
  tipo?: string;
  region?: string;
  owner_id?: string;
  agency_id?: string;
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

  // Función para convertir claves de temporada en información visual atractiva
  const getSeasonDisplayInfo = (seasonKey: string) => {
    const seasonLabels: { [key: string]: { displayName: string; duration: number; months: string } } = {
      'sep_may': { displayName: 'Septiembre a Mayo', duration: 9, months: 'Sep a Mayo' },
      'sep_jun': { displayName: 'Septiembre a Junio', duration: 10, months: 'Sep a Junio' },
      'sep_jul': { displayName: 'Septiembre a Julio', duration: 11, months: 'Sep a Julio' },
      'oct_jun': { displayName: 'Octubre a Junio', duration: 9, months: 'Oct a Junio' },
      'oct_jul': { displayName: 'Octubre a Julio', duration: 10, months: 'Oct a Julio' },
      'oct_may': { displayName: 'Octubre a Mayo', duration: 8, months: 'Oct a Mayo' },
      'nov_aug': { displayName: 'Noviembre a Agosto', duration: 10, months: 'Nov a Agosto' },
      'dec_sep': { displayName: 'Diciembre a Septiembre', duration: 10, months: 'Dic a Sep' },
      'jan_oct': { displayName: 'Enero a Octubre', duration: 10, months: 'Ene a Oct' },
      'feb_nov': { displayName: 'Febrero a Noviembre', duration: 10, months: 'Feb a Nov' },
      'mar_dec': { displayName: 'Marzo a Diciembre', duration: 10, months: 'Mar a Dic' },
      'apr_jan': { displayName: 'Abril a Enero', duration: 10, months: 'Abr a Ene' },
      'may_feb': { displayName: 'Mayo a Febrero', duration: 10, months: 'Mayo a Feb' },
      'jun_mar': { displayName: 'Junio a Marzo', duration: 10, months: 'Junio a Mar' },
      'jul_apr': { displayName: 'Julio a Abril', duration: 10, months: 'Julio a Abr' },
      'aug_may': { displayName: 'Agosto a Mayo', duration: 10, months: 'Ago a Mayo' },
      'pct_mayo': { displayName: 'Octubre a Mayo', duration: 8, months: 'Oct a Mayo' },
      // Fallbacks para meses individuales
      'enero': { displayName: 'Enero', duration: 1, months: 'Enero' },
      'febrero': { displayName: 'Febrero', duration: 1, months: 'Febrero' },
      'marzo': { displayName: 'Marzo', duration: 1, months: 'Marzo' },
      'abril': { displayName: 'Abril', duration: 1, months: 'Abril' },
      'mayo': { displayName: 'Mayo', duration: 1, months: 'Mayo' },
      'junio': { displayName: 'Junio', duration: 1, months: 'Junio' },
      'julio': { displayName: 'Julio', duration: 1, months: 'Julio' },
      'agosto': { displayName: 'Agosto', duration: 1, months: 'Agosto' },
      'septiembre': { displayName: 'Septiembre', duration: 1, months: 'Septiembre' },
      'octubre': { displayName: 'Octubre', duration: 1, months: 'Octubre' },
      'noviembre': { displayName: 'Noviembre', duration: 1, months: 'Noviembre' },
      'diciembre': { displayName: 'Diciembre', duration: 1, months: 'Diciembre' }
    };
    
    // Si encontramos la temporada en nuestro mapeo, la devolvemos
    if (seasonLabels[seasonKey]) {
      return seasonLabels[seasonKey];
    }
    
    // Si no la encontramos, intentamos formatear la clave
    if (seasonKey.includes('_')) {
      const [start, end] = seasonKey.split('_');
      const monthNames: { [key: string]: string } = {
        'sep': 'Septiembre', 'oct': 'Octubre', 'nov': 'Noviembre', 'dec': 'Diciembre',
        'jan': 'Enero', 'feb': 'Febrero', 'mar': 'Marzo', 'apr': 'Abril',
        'may': 'Mayo', 'jun': 'Junio', 'jul': 'Julio', 'aug': 'Agosto'
      };
      
      const startMonth = monthNames[start] || start;
      const endMonth = monthNames[end] || end;
      
      return {
        displayName: `${startMonth} a ${endMonth}`,
        duration: 0,
        months: `${startMonth} a ${endMonth}`
      };
    }
    
    // Fallback final
    return { 
      displayName: seasonKey, 
      duration: 0, 
      months: seasonKey 
    };
  };

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

      <LandingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 mt-16">
        {/* SECCIÓN 1: Encabezado con Título, Ubicación y Acciones */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            {property.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              {property.destacada && (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                  <Star size={12} /> Destacada
                </span>
              )}
              <a href="#location-map" className="flex items-center gap-1 hover:underline">
                <MapPin size={16} />
                <span>{property.location}, {property.city}</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-sm gap-2">
                <Share2 size={16} /> Compartir
              </button>
              <button className="btn btn-ghost btn-sm gap-2">
                <Heart size={16} /> Favorito
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: Galería de Imágenes Optimizada */}
        {allImages.length > 0 ? (
          <div className="relative">
              {/* Grid para Desktop (estilo Airbnb) */}
              <div className="hidden lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-2 h-[55vh] rounded-xl overflow-hidden">
                  <div className="lg:col-span-2 lg:row-span-2">
                      <img src={allImages[0]} alt={property.title} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowAllImages(true)} />
                  </div>
                  {allImages.slice(1, 5).map((src, index) => (
                      <div key={index} className="hidden lg:block">
                          <img src={src} alt={`${property.title} - ${index + 2}`} className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowAllImages(true)} />
                      </div>
                  ))}
              </div>

              {/* Carrusel simple para móvil y tablet */}
              <div className="lg:hidden relative h-80 rounded-xl overflow-hidden">
                  <img src={allImages[currentImageIndex]} alt={property.title} className="w-full h-full object-cover" />
                  {allImages.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm">
                        <ArrowLeft size={16} />
                      </button>
                      <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm">
                        <ArrowLeft size={16} className="rotate-180" />
                      </button>
                    </>
                  )}
              </div>
              <button onClick={() => setShowAllImages(true)} className="absolute bottom-4 right-4 btn btn-sm bg-white/80 backdrop-blur-sm">
                <Camera size={16} /> Mostrar todas las fotos ({allImages.length})
              </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500">
              <Camera size={48} />
              <span className="ml-2">Sin imágenes disponibles</span>
          </div>
        )}

        {/* Modal para mostrar todas las fotos */}
        {showAllImages && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
              {/* Header del modal */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                <button
                  onClick={() => setShowAllImages(false)}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="text-white font-semibold text-lg">
                  {currentImageIndex + 1} de {allImages.length}
                </span>
              </div>

              {/* Imagen principal */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={allImages[currentImageIndex]}
                  alt={`${property.title} - Imagen ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Controles de navegación */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                  >
                    <ArrowLeft size={24} className="rotate-180" />
                  </button>
                </>
              )}

              {/* Thumbnails en la parte inferior */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-2">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-16 h-16 rounded-lg overflow-hidden transition-all ${
                          index === currentImageIndex 
                            ? 'ring-2 ring-white ring-offset-2' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${property.title} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN 3: Contenido Principal (Grid de 2 Columnas) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          
          {/* Columna Izquierda: Detalles de la Propiedad */}
          <div className="lg:col-span-7 lg:pr-12">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{property.tipo || 'Alojamiento'} en {property.city}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600 dark:text-gray-400 mt-1">
                  <span>{property.bedrooms} habs.</span>
                  <span>·</span>
                  <span>{property.bathrooms} baños</span>
                  <span>·</span>
                  <span>{property.square_meters} m²</span>
                </div>
              </div>
              {/* Info del anfitrión/agencia */}
              {(property.owner || property.agency) && (
                <div className="text-right">
                  <p className="font-semibold">{property.owner?.full_name || property.agency?.full_name}</p>
                  <p className="text-sm text-gray-500">{property.owner ? 'Propietario' : 'Agencia'}</p>
                </div>
              )}
            </div>
            
            <hr className="my-8 dark:border-gray-700" />
            
            {/* Descripción */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Sobre este lugar</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-prose">
                {property.description || 'Sin descripción disponible.'}
              </p>
            </div>

            <hr className="my-8 dark:border-gray-700" />
            
            {/* Comodidades */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Comodidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="my-8 dark:border-gray-700" />
            
            {/* Mapa */}
            <div id="location-map">
              <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
              <div className="h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                {!isLoaded ? (
                  <div className="flex items-center justify-center h-full">Cargando mapa...</div>
                ) : loadError ? (
                  <div className="flex items-center justify-center h-full text-red-500">Error al cargar el mapa.</div>
                ) : property.lat && property.lng ? (
                  <GoogleMap
                    mapContainerClassName="w-full h-full"
                    center={{ lat: property.lat, lng: property.lng }}
                    zoom={15}
                    options={{ gestureHandling: 'cooperative' }}
                  >
                    <Marker position={{ lat: property.lat, lng: property.lng }} />
                  </GoogleMap>
                ) : (
                  <div className="flex items-center justify-center h-full">Ubicación no disponible.</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Columna Derecha: Formulario de Reserva (Sticky) */}
          <aside className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-24 p-6 border rounded-xl shadow-lg bg-white dark:bg-gray-800">
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary-600">{formatPrice(property.precio_mes)}</span>
                <span className="text-gray-600 dark:text-gray-400"> / mes</span>
              </div>

              {/* Formulario de reservas por días sueltos (siempre visible) */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Reservar por días sueltos</h4>
                <BookingCalendar
                  propertyId={property.id}
                  precioDia={property.precio_dia || property.precio_entresemana}
                  onBookingComplete={(bookingData) => {
                    console.log('Reserva por días completada:', bookingData);
                    // Aquí puedes manejar la reserva completada
                  }}
                />
              </div>

              {/* Formulario de alquiler de temporada completa (si está disponible) */}
              {property.alquila_temporada_completa && (
                <div className="pt-4 border-t dark:border-gray-600">
                  <h4 className="font-semibold mb-3">¿Prefieres alquilar la temporada completa?</h4>
                  <SeasonRentalForm
                    propertyId={property.id}
                    propertyName={property.title}
                    precioMes={property.precio_mes}
                    alquilaTemporadaCompleta={property.alquila_temporada_completa}
                    mesesTemporada={property.meses_temporada}
                    onSuccess={(rentalData) => {
                      console.log('Alquiler de temporada solicitado:', rentalData);
                      // Aquí puedes manejar la solicitud de alquiler
                    }}
                  />
                </div>
              )}
              
              {/* Información de Contacto */}
              <div className="mt-6 pt-4 border-t dark:border-gray-600">
                  <h4 className="font-semibold mb-2">Contactar</h4>
                  {/* Puedes añadir aquí la lógica para mostrar el contacto del propietario o la agencia */}
                  <p className="text-sm text-gray-500">
                      ¿Tienes dudas? Contacta directamente con el anunciante.
                  </p>
                  <button className="btn btn-outline w-full mt-3">
                      <Phone size={16} /> Mostrar teléfono
                  </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default PropertyDetails; 
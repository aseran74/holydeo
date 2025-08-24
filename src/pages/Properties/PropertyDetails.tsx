import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Camera, 
  MapPin, 
  Wifi, 
  Car, 
  Phone, 
  Star,
  Waves,
  Snowflake,
  UtensilsCrossed,
  ParkingSquare,
  Tv,
  TreePine,
  Sun,
  Moon,
  Mountain,
  Coffee,
  Dumbbell,
  ShoppingBag,
  Landmark,
  Users,
  Shield,
  Lock,
  Flame,
  Flag,
  Plane,
  Sparkles,
  CircleDot,
  Target,
  Accessibility,
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
  "Cafetera": <Coffee size={20} className="text-amber-600" />,
  "Gimnasio": <Dumbbell size={20} className="text-red-500" />,
  "Jardín": <TreePine size={20} className="text-green-600" />,
  "Terraza": <Sun size={20} className="text-yellow-500" />,
  "Balcón": <Moon size={20} className="text-indigo-500" />,
  "Estacionamiento": <Car size={20} className="text-gray-700" />,
  "Vistas a la montaña": <Mountain size={20} className="text-green-700" />,
  "Calefacción": <Sun size={20} className="text-orange-400" />,
  "Lavadora": <Waves size={20} className="text-blue-400" />,
  "Secadora": <Waves size={20} className="text-blue-300" />,
  "Microondas": <UtensilsCrossed size={20} className="text-red-400" />,
  "Horno": <UtensilsCrossed size={20} className="text-red-500" />,
  "Nevera": <Snowflake size={20} className="text-cyan-500" />,
  "Lavavajillas": <Waves size={20} className="text-cyan-400" />,
  "Plancha": <UtensilsCrossed size={20} className="text-gray-500" />,
  "Secador de pelo": <Waves size={20} className="text-pink-400" />,
  "Toallas": <UtensilsCrossed size={20} className="text-blue-300" />,
  "Sábanas": <UtensilsCrossed size={20} className="text-blue-200" />,
  "Ascensor": <ArrowLeft size={20} className="text-gray-600 rotate-90" />,
  "Portero": <Users size={20} className="text-blue-600" />,
  "Seguridad 24h": <Shield size={20} className="text-green-500" />,
  "Caja fuerte": <Lock size={20} className="text-yellow-600" />,
  "Chimenea": <Flame size={20} className="text-orange-500" />,
  "Barbacoa": <Flame size={20} className="text-red-400" />,
  "Spa": <Waves size={20} className="text-purple-400" />,
  "Sauna": <Snowflake size={20} className="text-red-300" />,
  "Pista de tenis": <Target size={20} className="text-green-400" />,
  "Pista de pádel": <CircleDot size={20} className="text-blue-500" />,
  "Campo de golf": <Flag size={20} className="text-green-500" />,
  "Piscina infantil": <Waves size={20} className="text-cyan-400" />,
  "Parque infantil": <TreePine size={20} className="text-green-400" />,
  "Mascotas permitidas": <Heart size={20} className="text-pink-500" />,
  "Acceso para discapacitados": <Accessibility size={20} className="text-blue-600" />,
  "Parking gratuito": <ParkingSquare size={20} className="text-green-500" />,
  "Parking de pago": <ParkingSquare size={20} className="text-orange-500" />,
  "Traslado al aeropuerto": <Plane size={20} className="text-blue-500" />,
  "Servicio de limpieza": <Sparkles size={20} className="text-purple-500" />,
  "Desayuno incluido": <UtensilsCrossed size={20} className="text-yellow-500" />,
  "Media pensión": <UtensilsCrossed size={20} className="text-orange-500" />,
  "Pensión completa": <UtensilsCrossed size={20} className="text-red-500" />,
};

interface NearbyService {
  id: string;
  service_type: string;
  name: string;
  distance_minutes: number;
  description: string;
  icon_name: string;
  color: string;
  external_url?: string;
}

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
  // Servicios cercanos
  nearby_services?: NearbyService[];
}



const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [nearbyServices, setNearbyServices] = useState<NearbyService[]>([]);




  // Configuración de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
      fetchNearbyServices();
    }
  }, [id]);



  const fetchNearbyServices = async () => {
    try {
      if (!id) return;
      
      const { data: servicesData, error: servicesError } = await supabase
        .from("nearby_services")
        .select("*")
        .eq("property_id", id)
        .eq("is_active", true)
        .order("distance_minutes", { ascending: true });

      if (servicesError) {
        console.error('Error fetching nearby services:', servicesError);
        return;
      }

      setNearbyServices(servicesData || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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



  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getAmenityIcon = (amenity: string) => {
    return amenityIcons[amenity] || <Star size={20} className="text-emerald-500" />;
  };

  const getServiceIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      'Waves': <Waves size={20} />,
      'UtensilsCrossed': <UtensilsCrossed size={20} />,
      'ShoppingBag': <ShoppingBag size={20} />,
      'Car': <Car size={20} />,
      'Landmark': <Landmark size={20} />,
      'TreePine': <TreePine size={20} />,
      'Wifi': <Wifi size={20} />,
      'ParkingSquare': <ParkingSquare size={20} />,
      'Tv': <Tv size={20} />,
      'Coffee': <Coffee size={20} />,
      'Dumbbell': <Dumbbell size={20} />,
      'Sun': <Sun size={20} />,
      'Moon': <Moon size={20} />,
      'Mountain': <Mountain size={20} />,
      'Target': <Target size={20} />,
      'CircleDot': <CircleDot size={20} />,
      'Accessibility': <Accessibility size={20} />,
      'Plane': <Plane size={20} />,
      'Sparkles': <Sparkles size={20} />,
    };
    
    return iconMap[iconName] || <Star size={20} />;
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

             <hr className="my-8 dark:border-gray-700" />
             
             {/* Actividades Cercanas */}
             <div>
               <h3 className="text-xl font-semibold mb-4">Actividades Cercanas</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {/* Playa */}
                 <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                       <Waves size={20} className="text-white" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 dark:text-white">Playa</h4>
                       <p className="text-sm text-blue-600 dark:text-blue-400">A 5 min caminando</p>
                     </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Playa de arena blanca con aguas cristalinas</p>
                 </div>

                 {/* Restaurantes */}
                 <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                       <UtensilsCrossed size={20} className="text-white" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 dark:text-white">Restaurantes</h4>
                       <p className="text-sm text-orange-600 dark:text-orange-400">A 3 min caminando</p>
                     </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Variedad de restaurantes locales y internacionales</p>
                 </div>

                 {/* Supermercado */}
                 <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                       <ShoppingBag size={20} className="text-white" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 dark:text-white">Supermercado</h4>
                       <p className="text-sm text-green-600 dark:text-green-400">A 2 min caminando</p>
                     </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Todo lo necesario para tu estancia</p>
                 </div>

                 {/* Transporte */}
                 <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                       <Car size={20} className="text-white" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 dark:text-white">Transporte</h4>
                       <p className="text-sm text-purple-600 dark:text-purple-400">A 1 min caminando</p>
                     </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Parada de autobús y taxi cercana</p>
                 </div>

                 {/* Centro histórico */}
                 <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                       <Landmark size={20} className="text-white" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 dark:text-white">Centro Histórico</h4>
                       <p className="text-sm text-amber-600 dark:text-amber-400">A 10 min caminando</p>
                     </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Monumentos y arquitectura histórica</p>
                 </div>

                 {/* Parque */}
                 <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                       <TreePine size={20} className="text-white" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-gray-900 dark:text-white">Parque Natural</h4>
                       <p className="text-sm text-emerald-600 dark:text-emerald-400">A 15 min caminando</p>
                     </div>
                   </div>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Senderos y vistas panorámicas</p>
                 </div>
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
                  <button className="w-full mt-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <Phone size={16} className="inline mr-2" /> Mostrar teléfono
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
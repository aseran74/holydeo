import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
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
  CalendarDays,
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
  Dumbbell
} from 'lucide-react';
import { getImageUrlWithFallback, getAllImageUrls } from '../../lib/supabaseStorage';
import PageMeta from '../../components/common/PageMeta';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';

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
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching property with ID:', id);
      
      // Obtener detalles de la propiedad
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

      setProperty(propertyData);
      
      // Por ahora no cargamos propietario y agencia para evitar errores
      // TODO: Implementar carga de propietario y agencia cuando esté disponible

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
      <PageBreadCrumb pageTitle="Detalles de Propiedad" />

      <div className="max-w-7xl mx-auto px-4 py-8">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Información de contacto */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
              
              {property.owner_id && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Propietario</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <span>{`${property.owner_id}`}</span>
                    </div>
                    {/* TODO: Fetch owner details from supabase */}
                    {/* <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <span className="text-sm">{owner.email}</span>
                    </div>
                    {owner.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm">{owner.phone}</span>
                      </div>
                    )} */}
                  </div>
                </div>
              )}

              {property.agency_id && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Agencia</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-500" />
                      <span>{`${property.agency_id}`}</span>
                    </div>
                    {/* TODO: Fetch agency details from supabase */}
                    {/* <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      <span className="text-sm">{agency.contact_email}</span>
                    </div>
                    {agency.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-500" />
                        <span className="text-sm">{agency.phone}</span>
                      </div>
                    )} */}
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

            {/* Acciones */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
              <h3 className="text-lg font-semibold mb-4">Acciones</h3>
              <div className="space-y-3">
                <Link
                  to={`/calendar-management/${property.id}`}
                  className="btn btn-primary w-full"
                >
                  <CalendarDays size={16} />
                  Gestionar Calendario
                </Link>
                {/* Comentado hasta que se implemente la ruta de edición
                <Link
                  to={`/properties/edit/${property.id}`}
                  className="btn btn-outline w-full"
                >
                  <Building size={16} />
                  Editar Propiedad
                </Link>
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails; 
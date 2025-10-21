import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Property, Experience } from '../../types';
import SearchNavbar from '../../components/landing/SearchNavbar';
import RedirectNotification from '../../components/common/RedirectNotification';
import DateSearchForm from '../../components/common/DateSearchForm';
import EnhancedSearchFilters from '../../components/common/EnhancedSearchFilters';
import FiltersModal from '../../components/common/FiltersModal';
import PublicPropertyCard from '../../components/common/PublicPropertyCard';
import { Search, Grid, List, Map, Home, Star, Car, Waves, TreePine, Sun, Snowflake, Building2, Building, Filter, LayoutGrid, LayoutList, MapPin, Bed, Bath, Users } from 'lucide-react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [searchType, setSearchType] = useState<'properties' | 'experiences'>('properties');
  
  const [searchData, setSearchData] = useState({
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    zone: searchParams.get('zone') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
    priceRange: [0, 1000],
    category: '',
    // Filtros específicos de propiedades
    propertyType: '',
    bedrooms: 0,
    bathrooms: 0,
    amenities: [] as string[],
    // Filtros específicos de experiencias
    experienceType: '',
    duration: '',
    maxParticipants: '',
    // Filtros comunes
    pricePerDay: 500,
    pricePerMonth: 5000,
    seasons: [] as string[],
  });

  const [results, setResults] = useState<{
    properties: Property[];
    experiences: Experience[];
  }>({
    properties: [],
    experiences: []
  });

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [availabilityFilterApplied, setAvailabilityFilterApplied] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Hook para cargar Google Maps API con configuración optimizada
  const libraries = useMemo(() => ['places'], []);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries as any,
    preventGoogleFontsLoading: true, // Evita cargar fuentes de Google innecesarias
  });

  // Función para cargar el mapa y ajustar límites (optimizada con useCallback)
  const onLoadMap = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    const bounds = new window.google.maps.LatLngBounds();
    let hasMarkers = false;

    // Agregar propiedades o experiencias según el tipo de búsqueda
    if (searchType === 'properties' && results.properties.length > 0) {
      results.properties.forEach((property) => {
        if (property.lat && property.lng) {
          bounds.extend({ lat: property.lat, lng: property.lng });
          hasMarkers = true;
        }
      });
    } else if (searchType === 'experiences' && results.experiences.length > 0) {
      results.experiences.forEach((experience) => {
        if (experience.lat && experience.lng) {
          bounds.extend({ lat: experience.lat, lng: experience.lng });
          hasMarkers = true;
        }
      });
    }

    if (hasMarkers) {
      map.fitBounds(bounds);
    }
  }, [searchType, results.properties, results.experiences]);

  // Estilo del contenedor del mapa optimizado con useMemo
  const mapContainerStyle = useMemo(() => ({
    width: "100%",
    height: "100vh",
    minHeight: "100vh",
    maxWidth: "100%",
    overflow: "hidden"
  }), []);

  // Centro del mapa por defecto
  const defaultCenter = useMemo(() => ({ 
    lat: 40.4168, 
    lng: -3.7038 
  }), []);

  // Iconos de marcadores optimizados con useMemo
  const propertyMarkerIcon = useMemo(() => ({
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
        <path d="M9 22V12H15V22" fill="white"/>
      </svg>
    `)}`,
    scaledSize: new window.google.maps.Size(32, 32),
    anchor: new window.google.maps.Point(16, 32)
  }), []);

  const experienceMarkerIcon = useMemo(() => ({
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B" stroke="#D97706" stroke-width="2"/>
      </svg>
    `)}`,
    scaledSize: new window.google.maps.Size(32, 32),
    anchor: new window.google.maps.Point(16, 32)
  }), []);

  // Helper function to get proper image URL for experiences
  const getExperienceImageUrl = (photos: string[] | undefined) => {
    if (!photos || photos.length === 0) {
      return '/images/cards/card-01.jpg';
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
      return data.publicUrl || '/images/cards/card-01.jpg';
    }
  };

  // Componente de minitarjeta para el mapa (Propiedades)
  const MiniPropertyCard = ({ property }: { property: Property }) => {
    const imageUrl = property.main_image_path || property.image_paths?.[0] || "/images/cards/card-placeholder.svg";

    return (
      // 1. Interacción: La tarjeta entera es un link
      <Link to={`/property/${property.id}`} className="block">
        <div className="w-56 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-xl transition-transform hover:shadow-2xl hover:scale-[1.02] duration-300 overflow-hidden border border-gray-100">
          
          {/* IMAGEN Y PRECIO FLOTANTE */}
          <div className="relative">
            <img
              src={imageUrl}
              alt={property.title}
              // 4. Mejoras en la Imagen: Altura ajustada para mejor proporción
              className="w-full h-28 object-cover" 
            />
            {/* 2. Precio Clave: Etiqueta flotante */}
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-full shadow-lg">
              {property.precio_dia ? `€${property.precio_dia}/día` : 'N/D'}
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="p-3">
            {/* Título y Ubicación */}
            <h3 className="text-base font-bold text-gray-900 truncate mb-1">
              {property.title}
            </h3>
            {/* 5. Ubicación: Con icono para mejor claridad */}
            <p className="flex items-center text-gray-500 text-xs mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {property.location}
            </p>

            {/* Iconografía de Características */}
            <div className="flex items-center gap-4 mb-2 text-sm text-gray-700">
              {/* 6. Iconografía: Usando iconos SVG (ej. Lucide/Heroicons) */}
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4 text-gray-400" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4 text-gray-400" />
                  {property.bathrooms}
                </span>
              )}
              {property.square_meters && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  {property.square_meters}m²
                </span>
              )}
            </div>
            
            {/* CTA Opcional (Si la tarjeta entera es un link, este es redundante pero puede servir como foco) */}
            <div className="flex justify-end pt-1">
              <span className="text-blue-600 text-xs font-semibold">
                Ver detalles
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Componente de minitarjeta para el mapa (Experiencias)
  const MiniExperienceCard = ({ experience }: { experience: Experience }) => (
    <div className="p-3 w-56 bg-white rounded-lg shadow-lg">
      <img
        src={getExperienceImageUrl(experience.photos)}
        alt={experience.name || 'Experiencia'}
        className="w-full h-24 object-cover rounded-md mb-2"
      />
      <h3 className="text-sm font-semibold truncate mb-1">{experience.name || 'Experiencia'}</h3>
      <p className="text-gray-600 text-xs mb-2">{experience.location}</p>
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
        {experience.category && <span>⭐ {experience.category}</span>}
      </div>
      <p className="text-amber-600 font-semibold text-sm mb-2">
        €{experience.price || 0}
        <span className="text-xs text-gray-500 ml-1">
          {experience.category === 'greenfees' ? '/cuota' : '/día'}
        </span>
      </p>
      <Link
        to={`/experiences/${experience.id}`}
        className="text-amber-600 underline text-xs hover:text-amber-800"
      >
        Ver detalles
      </Link>
    </div>
  );

  // Detectar el tipo de búsqueda desde la URL
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'properties' || typeParam === 'experiences') {
      setSearchType(typeParam);
    }
  }, [searchParams]);

  // Búsqueda automática al cargar la página
  useEffect(() => {
    handleSearch();
  }, []); // Solo se ejecuta al montar el componente

  // Mostrar mensaje de redirección si viene de una ruta protegida
  useEffect(() => {
    if (location.state?.message) {
      setShowRedirectMessage(true);
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => setShowRedirectMessage(false), 5000);
    }
  }, [location.state]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    try {
      if (searchType === 'properties') {
        await searchProperties();
      } else {
        await searchExperiences();
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda automática cuando cambian los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [searchData, searchType]); // Se ejecuta cuando cambian los filtros o el tipo

  const searchProperties = async () => {
    let query = supabase
      .from('properties')
      .select('*');

    // Filtro por texto de búsqueda
    if (searchData.query) {
      query = query.or(`title.ilike.%${searchData.query}%,description.ilike.%${searchData.query}%`);
    }
    
    // Filtro por ubicación
    if (searchData.location) {
      query = query.ilike('location', `%${searchData.location}%`);
    }
    
    // Filtro por zona/región
    if (searchData.zone) {
      query = query.eq('region', searchData.zone);
    }
    
    // Filtro por tipo de propiedad
    if (searchData.propertyType) {
      query = query.eq('tipo', searchData.propertyType);
    }
    
    // Filtro por habitaciones
    if (searchData.bedrooms > 0) {
      query = query.gte('bedrooms', searchData.bedrooms);
    }
    
    // Filtro por baños
    if (searchData.bathrooms > 0) {
      query = query.gte('bathrooms', searchData.bathrooms);
    }
    
    // Filtro por precio máximo
    if (searchData.priceRange[1] < 1000) {
      query = query.lte('price', searchData.priceRange[1]);
    }
    
    // Filtro por precio por día (promedio entre semana y fin de semana)
    if (searchData.pricePerDay < 500) {
      // Filtrar por el promedio de precio_entresemana y precio_fin_de_semana
      query = query.or(`and(precio_entresemana.lte.${searchData.pricePerDay * 2},precio_fin_de_semana.lte.${searchData.pricePerDay * 2})`);
    }
    
    // Filtro por precio por mes
    if (searchData.pricePerMonth < 5000) {
      query = query.lte('precio_mes', searchData.pricePerMonth);
    }
    
    // Nota: El filtro de temporadas se aplicará después de obtener los resultados
    // para evitar problemas con múltiples filtros .contains en Supabase
    
    // Filtro por amenities
    if (searchData.amenities.length > 0) {
      // Para cada amenity seleccionado, verificar que esté en el array de amenities de la propiedad
      searchData.amenities.forEach(amenity => {
        query = query.contains('amenities', [amenity]);
      });
    }

    console.log('Buscando propiedades con filtros:', {
      query: searchData.query,
      location: searchData.location,
      zone: searchData.zone,
      propertyType: searchData.propertyType,
      bedrooms: searchData.bedrooms,
      bathrooms: searchData.bathrooms,
      priceRange: searchData.priceRange,
      pricePerDay: searchData.pricePerDay,
      pricePerMonth: searchData.pricePerMonth,
      seasons: searchData.seasons,
      amenities: searchData.amenities,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut
    });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error en búsqueda de propiedades:', error);
    }
    
    console.log('Resultados de propiedades antes del filtro de disponibilidad:', data?.length || 0);
    
    // Aplicar filtro de temporadas en JavaScript después de obtener los resultados
    let filteredProperties = data || [];
    if (searchData.seasons && searchData.seasons.length > 0) {
      filteredProperties = (data || []).filter(property => {
        // Verificar si la propiedad tiene al menos una de las temporadas seleccionadas
        if (property.meses_temporada && Array.isArray(property.meses_temporada)) {
          return searchData.seasons.some(selectedSeason => 
            property.meses_temporada.includes(selectedSeason)
          );
        }
        return false;
      });
      console.log('Propiedades después del filtro de temporadas:', filteredProperties.length);
    }
    
    // Filtrar propiedades por disponibilidad si hay fechas seleccionadas
    let availableProperties = filteredProperties;
    let filterApplied = false;
    
    if (searchData.checkIn && searchData.checkOut) {
      filterApplied = true;
      try {
        // Convertir fechas a formato ISO para la consulta
        const checkInDate = new Date(searchData.checkIn).toISOString();
        const checkOutDate = new Date(searchData.checkOut).toISOString();
        
        console.log('Verificando disponibilidad para fechas:', { checkInDate, checkOutDate });
        
        // Obtener las reservas que se solapan con las fechas seleccionadas
        // Una reserva se solapa si:
        // - La fecha de inicio de la reserva es anterior o igual a la fecha de salida de la búsqueda
        // - Y la fecha de fin de la reserva es posterior o igual a la fecha de llegada de la búsqueda
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('property_id, start_date, end_date, status')
          .or(`and(start_date.lte.${checkOutDate},end_date.gte.${checkInDate})`)
          .eq('status', 'confirmada');

        if (bookingsError) {
          console.error('Error obteniendo reservas:', bookingsError);
        }

        // Obtener días bloqueados que se solapan con las fechas seleccionadas
        const { data: blockedDates, error: blockedDatesError } = await supabase
          .from('blocked_dates')
          .select('property_id, date')
          .gte('date', searchData.checkIn)
          .lte('date', searchData.checkOut);

        if (blockedDatesError) {
          console.error('Error obteniendo días bloqueados:', blockedDatesError);
        }

        // Obtener IDs únicos de propiedades ocupadas (por reservas)
        const occupiedPropertyIds = [...new Set(bookings?.map(booking => booking.property_id) || [])];
        
        // Obtener IDs únicos de propiedades con días bloqueados
        const blockedPropertyIds = [...new Set(blockedDates?.map(blocked => blocked.property_id) || [])];
        
        // Combinar ambas listas de propiedades no disponibles
        const unavailablePropertyIds = [...new Set([...occupiedPropertyIds, ...blockedPropertyIds])];
        
        // Filtrar propiedades disponibles
        availableProperties = (data || []).filter(property => 
          !unavailablePropertyIds.includes(property.id)
        );
        
        console.log('Reservas encontradas:', bookings?.length || 0);
        console.log('Días bloqueados encontrados:', blockedDates?.length || 0);
        console.log('Propiedades ocupadas por reservas:', occupiedPropertyIds);
        console.log('Propiedades con días bloqueados:', blockedPropertyIds);
        console.log('Propiedades no disponibles total:', unavailablePropertyIds);
        console.log('Propiedades disponibles después del filtro:', availableProperties.length);
      } catch (error) {
        console.error('Error verificando disponibilidad:', error);
        // En caso de error, mostrar todas las propiedades
        availableProperties = data || [];
      }
    }
    
    setAvailabilityFilterApplied(filterApplied);
    setResults(prev => ({ ...prev, properties: availableProperties }));
  };

  const searchExperiences = async () => {
    let query = supabase
      .from('experiences')
      .select('*');

    // Filtro por texto de búsqueda
    if (searchData.query) {
      query = query.or(`name.ilike.%${searchData.query}%,description.ilike.%${searchData.query}%`);
    }
    
    // Filtro por ubicación
    if (searchData.location) {
      query = query.ilike('location', `%${searchData.location}%`);
    }
    
    // Filtro por zona/región
    if (searchData.zone) {
      query = query.eq('region', searchData.zone);
    }
    
    // Filtro por categoría
    if (searchData.category) {
      query = query.eq('category', searchData.category);
    }
    
    // Filtro por tipo de experiencia
    if (searchData.experienceType) {
      query = query.eq('category', searchData.experienceType);
    }
    
    // Filtros de duración y participantes eliminados
    
    // Filtro por precio máximo
    if (searchData.priceRange[1] < 1000) {
      query = query.lte('price', searchData.priceRange[1]);
    }

    console.log('Buscando experiencias con filtros:', {
      query: searchData.query,
      location: searchData.location,
      zone: searchData.zone,
      category: searchData.category,
      experienceType: searchData.experienceType,
      priceRange: searchData.priceRange
    });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error en búsqueda de experiencias:', error);
    }
    
    console.log('Resultados de experiencias:', data);
    setResults(prev => ({ ...prev, experiences: data || [] }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSearchData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const totalResults = searchType === 'properties' 
    ? results.properties.length 
    : results.experiences.length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };



  const amenities = [
    { id: 'piscina', name: 'Piscina', icon: Waves },
    { id: 'jardin', name: 'Jardín', icon: TreePine },
    { id: 'garaje', name: 'Garaje', icon: Car },
    { id: 'terraza', name: 'Terraza', icon: Sun },
    { id: 'aire_acondicionado', name: 'Aire Acondicionado', icon: Snowflake },
    { id: 'ascensor', name: 'Ascensor', icon: Building2 },
    { id: 'trastero', name: 'Trastero', icon: Building },
    { id: 'vistas_al_mar', name: 'Vistas al mar', icon: Waves },
    { id: 'accesible', name: 'Accesible', icon: Building },
    { id: 'lujo', name: 'Lujo', icon: Star },
    { id: 'obra_nueva', name: 'Obra nueva', icon: Building2 },
  ];

  const experienceTypes = [
    { value: "cultural", label: "Cultural" },
    { value: "adventure", label: "Aventura" },
    { value: "relaxation", label: "Relajación" },
    { value: "food", label: "Gastronomía" },
    { value: "nature", label: "Naturaleza" }
  ];

  const seasons = [
    { value: "sep_may", label: "Septiembre a Mayo" },
    { value: "sep_jun", label: "Septiembre a Junio" },
    { value: "sep_jul", label: "Septiembre a Julio" },
    { value: "oct_may", label: "Octubre a Mayo" },
    { value: "oct_jun", label: "Octubre a Junio" },
    { value: "oct_jul", label: "Octubre a Julio" }
  ];



  return (
    <div className="min-h-screen bg-gray-50">
      <SearchNavbar />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Mensaje de redirección */}
        {showRedirectMessage && (
          <RedirectNotification
            message={location.state?.message || 'Esta página solo es accesible desde la búsqueda'}
            redirectFrom={location.state?.redirectFrom}
            onClose={() => setShowRedirectMessage(false)}
          />
        )}
        
        <div className="mb-8">
          
          {/* Switch de tipo de búsqueda */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setSearchType('properties')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'properties'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4 inline mr-2" />
                Propiedades
              </button>
              <button
                onClick={() => setSearchType('experiences')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  searchType === 'experiences'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Star className="w-4 h-4 inline mr-2" />
                Experiencias
              </button>
            </div>
          </div>

          {/* Búsqueda principal con DateSearchForm */}
          <div className="max-w-4xl mx-auto mb-8">
                         <DateSearchForm 
               variant="search" 
               externalSearchData={{
                 location: searchData.location,
                 zone: searchData.zone,
                 checkIn: searchData.checkIn,
                 checkOut: searchData.checkOut,
                 pricePerDay: searchData.pricePerDay
               }}
               onSearchDataChange={(data) => {
                 setSearchData(prev => ({
                   ...prev,
                   location: data.location,
                   zone: data.zone || '',
                   checkIn: data.checkIn,
                   checkOut: data.checkOut,
                   pricePerDay: data.pricePerDay || 500
                 }));
               }}
               onSearch={handleSearch}
             />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
                     <EnhancedSearchFilters
             searchData={searchData}
             setSearchData={setSearchData}
             searchType={searchType}
             showFilters={showFilters}
             setShowFilters={setShowFilters}
             experienceTypes={experienceTypes.map(e => e.value)}
             seasons={seasons}
             amenities={amenities}
             handleAmenityToggle={handleAmenityToggle}
           />

          {/* Contenido principal */}
          <div className="flex-1 w-full">
            {/* Controles de vista */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {totalResults} resultados encontrados
                </h2>
                {loading && (
                  <p className="text-blue-600 text-sm mt-1">
                    🔍 Buscando...
                  </p>
                )}
                {!loading && searchData.query && (
                  <p className="text-gray-600 text-sm mt-1">
                    Resultados para "{searchData.query}"
                  </p>
                )}
                {/* Mostrar filtros activos */}
                {!loading && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchData.location && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        📍 {searchData.location}
                      </span>
                    )}
                    {searchData.propertyType && searchType === 'properties' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        🏠 {searchData.propertyType}
                      </span>
                    )}
                    {searchData.category && searchType === 'experiences' && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        ⭐ {searchData.category}
                      </span>
                    )}

                    {availabilityFilterApplied && searchType === 'properties' && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        ✅ Solo propiedades disponibles
                      </span>
                    )}
                    {searchData.amenities.length > 0 && searchType === 'properties' && (
                      <div className="flex flex-wrap gap-1">
                        {searchData.amenities.map(amenityId => {
                          const amenity = amenities.find(a => a.id === amenityId);
                          return amenity ? (
                            <span key={amenityId} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                              🏠 {amenity.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    {searchData.pricePerMonth < 5000 && searchType === 'properties' && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        💰 Hasta €{searchData.pricePerMonth}/mes
                      </span>
                    )}
                    {searchData.seasons && searchData.seasons.length > 0 && searchType === 'properties' && (
                      <div className="flex flex-wrap gap-1">
                        {searchData.seasons.map(season => {
                          const seasonLabel = seasons.find(s => s.value === season)?.label || season;
                          return (
                            <span key={season} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                              🌤️ {seasonLabel}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-lg text-gray-600">Buscando...</span>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-6">
                  {availabilityFilterApplied && searchType === 'properties' 
                    ? `No hay propiedades disponibles para las fechas seleccionadas (${searchData.checkIn} - ${searchData.checkOut}). Intenta con otras fechas o ajusta tus filtros de búsqueda.`
                    : 'Intenta ajustar tus filtros de búsqueda'
                  }
                </p>
                {availabilityFilterApplied && searchType === 'properties' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Consejo:</strong> Las propiedades ocupadas en las fechas seleccionadas no aparecen en los resultados. 
                      Prueba con fechas diferentes para ver más opciones.
                    </p>
                  </div>
                )}
              </div>
                         ) : viewMode === 'map' ? (
               // Vista del mapa
               <div className="mb-8 rounded-lg overflow-hidden shadow md:relative max-w-full">
                 {!isLoaded ? (
                   <div className="flex items-center justify-center h-96 md:h-[700px] min-h-screen md:min-h-0 bg-gray-100">
                     <div className="text-center">
                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                       <p className="text-gray-600">Cargando mapa...</p>
                     </div>
                   </div>
                 ) : loadError ? (
                   <div className="flex items-center justify-center h-96 md:h-[700px] min-h-screen md:min-h-0 bg-gray-100">
                     <div className="text-center text-red-600">
                       <p>Error al cargar el mapa</p>
                       <p className="text-sm">{loadError.message}</p>
                     </div>
                   </div>
                 ) : (
                   <>
                     <GoogleMap
                       mapContainerStyle={mapContainerStyle}
                       mapContainerClassName="md:!h-[700px] md:!min-h-0"
                       onLoad={onLoadMap}
                       center={defaultCenter}
                       zoom={6}
                       options={{
                         zoomControl: true,
                         streetViewControl: false,
                         mapTypeControl: false,
                         fullscreenControl: false,
                       }}
                     >
                       {searchType === 'properties' ? (
                         results.properties.map((property) =>
                           property.lat && property.lng ? (
                             <Marker
                               key={property.id}
                               position={{ lat: property.lat, lng: property.lng }}
                               onClick={() => setSelectedProperty(property)}
                               icon={propertyMarkerIcon}
                             />
                           ) : null
                         )
                       ) : (
                         results.experiences.map((experience) =>
                           experience.lat && experience.lng ? (
                             <Marker
                               key={experience.id}
                               position={{ lat: experience.lat, lng: experience.lng }}
                               onClick={() => setSelectedExperience(experience)}
                               icon={experienceMarkerIcon}
                             />
                           ) : null
                         )
                       )}

                       {/* InfoWindow para propiedades */}
                       {selectedProperty && selectedProperty.lat && selectedProperty.lng && (
                         <InfoWindow
                           position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
                           onCloseClick={() => setSelectedProperty(null)}
                         >
                           <MiniPropertyCard property={selectedProperty} />
                         </InfoWindow>
                       )}

                       {/* InfoWindow para experiencias */}
                       {selectedExperience && selectedExperience.lat && selectedExperience.lng && (
                         <InfoWindow
                           position={{ lat: selectedExperience.lat, lng: selectedExperience.lng }}
                           onCloseClick={() => setSelectedExperience(null)}
                         >
                           <MiniExperienceCard experience={selectedExperience} />
                         </InfoWindow>
                       )}
                     </GoogleMap>

                     {/* Botones flotantes para móvil */}
                     <div className="md:hidden fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                       {/* Botón de Filtros */}
                       <button
                         onClick={() => setShowFiltersModal(true)}
                         className="bg-white text-gray-700 p-4 rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 border border-gray-200"
                         aria-label="Filtros"
                         title="Filtros"
                       >
                         <Filter className="w-6 h-6" />
                       </button>

                       {/* Botón de Vista Grid/Card */}
                       <button
                         onClick={() => setViewMode('grid')}
                         className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
                         aria-label="Vista de tarjetas"
                         title="Vista de tarjetas"
                       >
                         <LayoutGrid className="w-6 h-6" />
                       </button>

                       {/* Botón de Vista Lista */}
                       <button
                         onClick={() => setViewMode('list')}
                         className="bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300"
                         aria-label="Vista de lista"
                         title="Vista de lista"
                       >
                         <LayoutList className="w-6 h-6" />
                       </button>
                     </div>
                   </>
                 )}
               </div>
            ) : (
              // Vista de grid o lista
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {searchType === 'properties' ? (
                  results.properties.map((property) => (
                    <PublicPropertyCard key={property.id} property={property} />
                  ))
                ) : (
                  results.experiences.map((experience) => (
                    <Link
                      key={experience.id}
                      to={`/experiences/${experience.id}`}
                      className={`block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'p-4' : ''
                      }`}
                    >
                      <div className={viewMode === 'grid' ? 'p-4' : 'flex items-center gap-4'}>
                        <div className={viewMode === 'grid' ? 'mb-4' : 'flex-shrink-0'}>
                          <img
                            src={getExperienceImageUrl(experience.photos)}
                            alt={experience.name || 'Experiencia'}
                            className={`rounded-lg object-cover ${
                              viewMode === 'grid' ? 'w-full h-48' : 'w-24 h-24'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {experience.name || 'Experiencia'}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {experience.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-semibold">
                              {formatPrice(experience.price || 0)}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {experience.category === 'greenfees' ? 'Cuota mensual/anual' : 'por día'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón flotante para mapa en móvil */}
      {viewMode !== 'map' && (
        <button
          onClick={() => setViewMode('map')}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 md:hidden"
          aria-label="Ver mapa"
        >
          <Map className="w-6 h-6" />
        </button>
      )}

      {/* Botón flotante para volver a vista normal desde mapa en móvil */}
      {viewMode === 'map' && (
        <button
          onClick={() => setViewMode('grid')}
          className="fixed bottom-6 right-6 z-50 bg-gray-600 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 md:hidden"
          aria-label="Volver a vista normal"
        >
          <Grid className="w-6 h-6" />
        </button>
      )}

      {/* Modal de Filtros para móvil */}
      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        searchData={searchData}
        setSearchData={setSearchData}
        searchType={searchType}
        experienceTypes={experienceTypes.map(e => e.value)}
        seasons={seasons}
        amenities={amenities}
        handleAmenityToggle={handleAmenityToggle}
      />
    </div>
  );
};

export default SearchPage; 
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Property, Experience } from '../../types';
import SearchNavbar from '../../components/landing/SearchNavbar';
import RedirectNotification from '../../components/common/RedirectNotification';
import DateSearchForm from '../../components/common/DateSearchForm';
import EnhancedSearchFilters from '../../components/common/EnhancedSearchFilters';
import PublicPropertyCard from '../../components/common/PublicPropertyCard';
import { Search, Grid, List, Home, Star, Car, Waves, TreePine, Sun, Snowflake, Building2, Building } from 'lucide-react';

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
    season: '',
    pricePerDay: 500,
    pricePerMonth: 5000,
  });

  const [results, setResults] = useState<{
    properties: Property[];
    experiences: Experience[];
  }>({
    properties: [],
    experiences: []
  });

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [availabilityFilterApplied, setAvailabilityFilterApplied] = useState(false);

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
    
    // Filtro por precio por día
    if (searchData.pricePerDay < 500) {
      query = query.lte('precio_dia', searchData.pricePerDay);
    }
    
    // Filtro por precio por mes
    if (searchData.pricePerMonth < 5000) {
      query = query.lte('precio_mes', searchData.pricePerMonth);
    }
    
    // Filtro por temporada
    if (searchData.season) {
      query = query.contains('meses_temporada', [searchData.season]);
    }

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
      season: searchData.season,
      amenities: searchData.amenities,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut
    });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error en búsqueda de propiedades:', error);
    }
    
    console.log('Resultados de propiedades antes del filtro de disponibilidad:', data?.length || 0);
    
    // Filtrar propiedades por disponibilidad si hay fechas seleccionadas
    let availableProperties = data || [];
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
    
    // Filtro por duración
    if (searchData.duration) {
      query = query.eq('duration_hours', parseInt(searchData.duration));
    }
    
    // Filtro por participantes máximos
    if (searchData.maxParticipants) {
      query = query.lte('max_participants', parseInt(searchData.maxParticipants));
    }
    
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
      duration: searchData.duration,
      maxParticipants: searchData.maxParticipants,
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
    { value: 'Septiembre a Mayo', label: 'Septiembre a Mayo' },
    { value: 'Septiembre a Junio', label: 'Septiembre a Junio' },
    { value: 'Septiembre a Julio', label: 'Septiembre a Julio' },
    { value: 'Octubre a Mayo', label: 'Octubre a Mayo' },
    { value: 'Octubre a Junio', label: 'Octubre a Junio' },
    { value: 'Octubre a Julio', label: 'Octubre a Julio' },
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
                 pricePerDay: searchData.pricePerDay,
                 pricePerMonth: searchData.pricePerMonth
               }}
               onSearchDataChange={(data) => {
                 setSearchData(prev => ({
                   ...prev,
                   location: data.location,
                   zone: data.zone || '',
                   checkIn: data.checkIn,
                   checkOut: data.checkOut,
                   pricePerDay: data.pricePerDay || 500,
                   pricePerMonth: data.pricePerMonth || 5000
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
             seasons={seasons.map(s => s.value)}
             experienceTypes={experienceTypes.map(e => e.value)}
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
                    {searchData.season && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        📅 {searchData.season}
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
            ) : (
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
                            src={experience.photos?.[0] || '/images/cards/card-01.jpg'}
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
                              {experience.duration_hours ? `${experience.duration_hours}h` : ''}
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
    </div>
  );
};

export default SearchPage; 
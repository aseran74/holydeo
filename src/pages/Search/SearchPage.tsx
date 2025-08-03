import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Property, Experience } from '../../types';
import SearchNavbar from '../../components/landing/SearchNavbar';
import RedirectNotification from '../../components/common/RedirectNotification';
import DateSearchForm from '../../components/common/DateSearchForm';
import PublicPropertyCard from '../../components/common/PublicPropertyCard';
import { Search, MapPin, Filter, Grid, List, Home, Star, Car, Waves, TreePine, Sun, Snowflake, Building2, Building } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [searchType, setSearchType] = useState<'properties' | 'experiences'>('properties');
  
  const [searchData, setSearchData] = useState({
    query: searchParams.get('query') || '',
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
    priceRange: [0, 1000],
    category: '',
    // Filtros específicos de propiedades
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    // Filtros específicos de experiencias
    experienceType: '',
    duration: '',
    maxParticipants: '',
    // Filtros comunes
    season: '',
    pricePerDay: [0, 500],
    pricePerMonth: [0, 5000],
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
    
    // Filtro por tipo de propiedad
    if (searchData.propertyType) {
      query = query.eq('tipo', searchData.propertyType);
    }
    
    // Filtro por habitaciones
    if (searchData.bedrooms) {
      query = query.gte('bedrooms', parseInt(searchData.bedrooms));
    }
    
    // Filtro por baños
    if (searchData.bathrooms) {
      query = query.gte('bathrooms', parseInt(searchData.bathrooms));
    }
    
    // Filtro por precio máximo
    if (searchData.priceRange[1] < 1000) {
      query = query.lte('price', searchData.priceRange[1]);
    }
    
    // Filtro por precio por día
    if (searchData.pricePerDay[1] < 500) {
      query = query.lte('precio_dia', searchData.pricePerDay[1]);
    }
    
    // Filtro por precio por mes
    if (searchData.pricePerMonth[1] < 5000) {
      query = query.lte('precio_mes', searchData.pricePerMonth[1]);
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
      propertyType: searchData.propertyType,
      bedrooms: searchData.bedrooms,
      bathrooms: searchData.bathrooms,
      priceRange: searchData.priceRange,
      pricePerDay: searchData.pricePerDay,
      pricePerMonth: searchData.pricePerMonth,
      season: searchData.season,
      amenities: searchData.amenities
    });

    const { data, error } = await query;
    
    if (error) {
      console.error('Error en búsqueda de propiedades:', error);
    }
    
    console.log('Resultados de propiedades:', data);
    setResults(prev => ({ ...prev, properties: data || [] }));
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

  const propertyTypes = [
    { value: 'Apartamento', label: 'Apartamento' },
    { value: 'Casa', label: 'Casa' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Cabaña', label: 'Cabaña' },
    { value: 'Estudio', label: 'Estudio' },
  ];

  const experienceTypes = [
    { value: 'Actividad Turística', label: 'Actividad Turística' },
    { value: 'Gastronómica', label: 'Gastronómica' },
    { value: 'Deportiva', label: 'Deportiva' },
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Búsqueda Avanzada</h1>
          
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

          {/* Búsqueda principal */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Buscar ${searchType === 'properties' ? 'propiedades' : 'experiencias'}...`}
                  value={searchData.query}
                  onChange={(e) => setSearchData(prev => ({ ...prev, query: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchData({
                    query: '',
                    location: '',
                    checkIn: '',
                    checkOut: '',
                    guests: 1,
                    priceRange: [0, 1000],
                    category: '',
                    propertyType: '',
                    bedrooms: '',
                    bathrooms: '',
                    amenities: [],
                    experienceType: '',
                    duration: '',
                    maxParticipants: '',
                    season: '',
                    pricePerDay: [0, 500],
                    pricePerMonth: [0, 5000],
                  });
                  // La búsqueda se ejecutará automáticamente por el useEffect
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Ver Todo
              </button>
            </div>
          </form>

          {/* Búsqueda por fechas */}
          <div className="max-w-4xl mx-auto mb-8">
            <DateSearchForm variant="search" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-500 hover:text-gray-700 lg:hidden"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="space-y-6">
                  {/* Ubicación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="¿Dónde quieres ir?"
                        value={searchData.location}
                        onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Llegada
                      </label>
                      <input
                        type="date"
                        value={searchData.checkIn}
                        onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salida
                      </label>
                      <input
                        type="date"
                        value={searchData.checkOut}
                        onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Huéspedes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Huéspedes
                    </label>
                    <select
                      value={searchData.guests}
                      onChange={(e) => setSearchData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'persona' : 'personas'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Temporada */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temporada
                    </label>
                    <select
                      value={searchData.season}
                      onChange={(e) => setSearchData(prev => ({ ...prev, season: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Todas las temporadas</option>
                      {seasons.map(season => (
                        <option key={season.value} value={season.value}>
                          {season.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtros específicos según el tipo */}
                  {searchType === 'properties' ? (
                    <>
                      {/* Tipo de propiedad */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de vivienda
                        </label>
                        <select
                          value={searchData.propertyType}
                          onChange={(e) => setSearchData(prev => ({ ...prev, propertyType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Todos los tipos</option>
                          {propertyTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Habitaciones */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Habitaciones
                          </label>
                          <select
                            value={searchData.bedrooms}
                            onChange={(e) => setSearchData(prev => ({ ...prev, bedrooms: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="">Cualquiera</option>
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <option key={num} value={num}>
                                {num}+ habitaciones
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Baños
                          </label>
                          <select
                            value={searchData.bathrooms}
                            onChange={(e) => setSearchData(prev => ({ ...prev, bathrooms: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            <option value="">Cualquiera</option>
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>
                                {num}+ baños
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Precio por día */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio por día (€)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Mín"
                            value={searchData.pricePerDay[0]}
                            onChange={(e) => setSearchData(prev => ({ 
                              ...prev, 
                              pricePerDay: [parseInt(e.target.value) || 0, prev.pricePerDay[1]] 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Máx"
                            value={searchData.pricePerDay[1]}
                            onChange={(e) => setSearchData(prev => ({ 
                              ...prev, 
                              pricePerDay: [prev.pricePerDay[0], parseInt(e.target.value) || 500] 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      {/* Precio por mes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Precio por mes (€)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Mín"
                            value={searchData.pricePerMonth[0]}
                            onChange={(e) => setSearchData(prev => ({ 
                              ...prev, 
                              pricePerMonth: [parseInt(e.target.value) || 0, prev.pricePerMonth[1]] 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Máx"
                            value={searchData.pricePerMonth[1]}
                            onChange={(e) => setSearchData(prev => ({ 
                              ...prev, 
                              pricePerMonth: [prev.pricePerMonth[0], parseInt(e.target.value) || 5000] 
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      {/* Complementos */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complementos
                        </label>
                        <div className="space-y-2">
                          {amenities.map(amenity => (
                            <label key={amenity.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={searchData.amenities.includes(amenity.id)}
                                onChange={() => handleAmenityToggle(amenity.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <amenity.icon className="w-4 h-4 ml-2 text-gray-500" />
                              <span className="ml-2 text-sm text-gray-700">{amenity.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Tipo de experiencia */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de experiencia
                        </label>
                        <select
                          value={searchData.experienceType}
                          onChange={(e) => setSearchData(prev => ({ ...prev, experienceType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Todos los tipos</option>
                          {experienceTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Duración */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duración
                        </label>
                        <select
                          value={searchData.duration}
                          onChange={(e) => setSearchData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Cualquier duración</option>
                          <option value="30">30 minutos</option>
                          <option value="60">1 hora</option>
                          <option value="120">2 horas</option>
                          <option value="180">3 horas</option>
                          <option value="240">4 horas</option>
                          <option value="480">8 horas</option>
                        </select>
                      </div>

                      {/* Participantes máximos */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Participantes máximos
                        </label>
                        <select
                          value={searchData.maxParticipants}
                          onChange={(e) => setSearchData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Cualquier número</option>
                          {[1, 2, 4, 6, 8, 10, 15, 20].map(num => (
                            <option key={num} value={num}>
                              Hasta {num} personas
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Precio general */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio máximo (€)
                    </label>
                    <input
                      type="number"
                      placeholder="Sin límite"
                      value={searchData.priceRange[1]}
                      onChange={(e) => setSearchData(prev => ({ 
                        ...prev, 
                        priceRange: [0, parseInt(e.target.value) || 1000] 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Botón limpiar filtros */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchData({
                        query: '',
                        location: '',
                        checkIn: '',
                        checkOut: '',
                        guests: 1,
                        priceRange: [0, 1000],
                        category: '',
                        propertyType: '',
                        bedrooms: '',
                        bathrooms: '',
                        amenities: [],
                        experienceType: '',
                        duration: '',
                        maxParticipants: '',
                        season: '',
                        pricePerDay: [0, 500],
                        pricePerMonth: [0, 5000],
                      });
                      // La búsqueda se ejecutará automáticamente por el useEffect
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                  Intenta ajustar tus filtros de búsqueda
                </p>
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
                            alt={experience.title || 'Experiencia'}
                            className={`rounded-lg object-cover ${
                              viewMode === 'grid' ? 'w-full h-48' : 'w-24 h-24'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {experience.title || 'Experiencia'}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {experience.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-600 font-semibold">
                              {formatPrice(experience.price)}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {experience.duration ? `${experience.duration}h` : ''}
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
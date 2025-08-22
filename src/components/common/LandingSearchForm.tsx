import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Home, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TailGridsDateRangePicker from './TailGridsDateRangePicker';
import PriceFilter from './PriceFilter';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';
import { supabase } from '../../supabaseClient';

interface LandingSearchFormProps {
  className?: string;
}

interface PropertyType {
  value: string;
  label: string;
}

interface Region {
  value: string;
  label: string;
}

const LandingSearchForm: React.FC<LandingSearchFormProps> = ({ 
  className = ''
}) => {
  const [showPriceFilters, setShowPriceFilters] = useState(false);
  const [showPropertyType, setShowPropertyType] = useState(false);
  const [showZoneSearch, setShowZoneSearch] = useState(false);
  // Datos estáticos como fallback
  const staticPropertyTypes = [
    "Piso o apartamento",
    "Ático", 
    "Bajo con Jardín",
    "Chalet Adosado",
    "Chalet Individual",
    "Casa Rural"
  ];

  const staticRegions = [
    "Andalucia",
    "Islas Baleares", 
    "Islas Canarias",
    "Costa de Levante",
    "Costa Catalana",
    "Euskadi",
    "Asturias",
    "Galicia"
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([
    { value: '', label: 'Cualquier tipo' }
  ]);
  const [regions, setRegions] = useState<Region[]>([
    { value: '', label: 'Cualquier zona' }
  ]);
  
  const [searchData, setSearchData] = useState({
    location: '',
    zone: '',
    checkIn: '',
    checkOut: '',
    propertyType: '',
    pricePerDay: 500,
    pricePerMonth: 5000
  });

  // Usar datos dinámicos si están disponibles, sino usar estáticos
  const availablePropertyTypes = propertyTypes.length > 1 ? propertyTypes : [
    { value: '', label: 'Cualquier tipo' },
    ...staticPropertyTypes.map(type => ({ value: type, label: type }))
  ];

  const availableRegions = regions.length > 1 ? regions : [
    { value: '', label: 'Cualquier zona' },
    ...staticRegions.map(region => ({ value: region, label: region }))
  ];
  
  const navigate = useNavigate();

  // Cargar datos de Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar tipos de vivienda
        const { data: tiposData, error: tiposError } = await supabase
          .from('properties')
          .select('tipo')
          .not('tipo', 'is', null)
          .neq('tipo', '');

        if (tiposError) {
          console.error('Error cargando tipos:', tiposError);
        } else {
          const tiposUnicos = [...new Set(tiposData?.map(item => item.tipo) || [])];
          const tiposFormateados = tiposUnicos.map(tipo => ({
            value: tipo,
            label: tipo
          }));
          setPropertyTypes([
            { value: '', label: 'Cualquier tipo' },
            ...tiposFormateados
          ]);
        }

        // Cargar regiones
        const { data: regionesData, error: regionesError } = await supabase
          .from('properties')
          .select('region')
          .not('region', 'is', null)
          .neq('region', '');

        if (regionesError) {
          console.error('Error cargando regiones:', regionesError);
        } else {
          const regionesUnicas = [...new Set(regionesData?.map(item => item.region) || [])];
          const regionesFormateadas = regionesUnicas.map(region => ({
            value: region,
            label: region
          }));
          setRegions([
            { value: '', label: 'Cualquier zona' },
            ...regionesFormateadas
          ]);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 Iniciando búsqueda...', searchData);
    
    const params = new URLSearchParams({
      query: searchData.location,
      location: searchData.location,
      zone: searchData.zone,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      propertyType: searchData.propertyType,
      pricePerDay: searchData.pricePerDay.toString(),
      pricePerMonth: searchData.pricePerMonth.toString()
    });
    
    const searchUrl = `/search?${params.toString()}`;
    console.log('🚀 Navegando a:', searchUrl);
    
    try {
      navigate(searchUrl);
      console.log('✅ Navegación exitosa');
    } catch (error) {
      console.error('❌ Error en la navegación:', error);
    }
  };

  const handleLocationChange = (location: string) => {
    setSearchData(prev => ({ ...prev, location }));
  };

  const handleZoneChange = (zone: string) => {
    const newZone = zone === "Cualquier zona" ? "" : zone;
    setSearchData(prev => ({
      ...prev,
      zone: newZone
    }));
  };

  const handleCheckInChange = (date: string) => {
    setSearchData(prev => ({ ...prev, checkIn: date }));
  };

  const handleCheckOutChange = (date: string) => {
    setSearchData(prev => ({ ...prev, checkOut: date }));
  };

  const handlePropertyTypeChange = (type: string) => {
    const newPropertyType = type === "Cualquier tipo" ? "" : type;
    setSearchData(prev => ({
      ...prev,
      propertyType: newPropertyType
    }));
  };

  const handlePricePerDayChange = (price: number) => {
    setSearchData(prev => ({ ...prev, pricePerDay: price }));
  };

  const handlePricePerMonthChange = (price: number) => {
    setSearchData(prev => ({ ...prev, pricePerMonth: price }));
  };

  const getPropertyTypeLabel = () => {
    if (!searchData.propertyType) return "Tipo de Vivienda";
    return searchData.propertyType;
  };

  const getZoneLabel = () => {
    if (!searchData.zone) return "Zona";
    return searchData.zone;
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl ${className}`}>
      <form onSubmit={handleSearch} className="space-y-4">
        
        {/* Fila 1: Localización con zona (1/2) y Calendario (1/2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Localización con Google Places y zona */}
          <div className="relative">
            <GooglePlacesAutocomplete
              value={searchData.location}
              onChange={handleLocationChange}
              placeholder="¿Dónde quieres ir?"
              className="w-full"
            />
            
            {/* Botón de zona integrado */}
            <button
              type="button"
              onClick={() => setShowZoneSearch(!showZoneSearch)}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                searchData.zone 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={getZoneLabel()}
            >
              <Globe className="w-3 h-3" />
            </button>

            {/* Dropdown de zonas */}
            {showZoneSearch && (
              <div className="absolute z-[9999] mt-1 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                {availableRegions.map((region) => (
                  <button
                    key={region.value}
                    type="button"
                    onClick={() => {
                      handleZoneChange(region.value);
                      setShowZoneSearch(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      searchData.zone === region.value ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                    }`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calendario */}
          <div>
            <TailGridsDateRangePicker
              checkIn={searchData.checkIn}
              checkOut={searchData.checkOut}
              onCheckInChange={handleCheckInChange}
              onCheckOutChange={handleCheckOutChange}
              placeholder="Seleccionar fechas"
            />
          </div>
        </div>

        {/* Fila 2: Tipo de vivienda (1/2), Rango precios (1/2), Buscar (full width en móvil) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Tipo de Vivienda - 50% en móvil */}
          <div className="relative md:col-span-1">
            <button
              type="button"
              onClick={() => setShowPropertyType(!showPropertyType)}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-between text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 ${
                searchData.propertyType 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : ''
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isLoading ? 'Cargando...' : getPropertyTypeLabel()}
                </span>
                <span className="sm:hidden">
                  {isLoading ? '...' : 'Tipo'}
                </span>
                {searchData.propertyType && (
                  <span className="ml-1 text-xs">•</span>
                )}
              </span>
              {showPropertyType ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Dropdown de tipos de vivienda */}
            {showPropertyType && !isLoading && (
              <div className="absolute z-[9999] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {availablePropertyTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      handlePropertyTypeChange(type.value);
                      setShowPropertyType(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      searchData.propertyType === type.value ? 'bg-green-50 text-green-700' : 'text-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rango de Precios - 50% en móvil */}
          <div className="relative md:col-span-1">
            <button
              type="button"
              onClick={() => setShowPriceFilters(!showPriceFilters)}
              className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-between text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 ${
                (searchData.pricePerDay !== 500 || searchData.pricePerMonth !== 5000) 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="hidden sm:inline">Rango €</span>
                <span className="sm:hidden flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Precio
                </span>
                {(searchData.pricePerDay !== 500 || searchData.pricePerMonth !== 5000) && (
                  <span className="ml-1 text-xs">•</span>
                )}
              </span>
              {showPriceFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Buscar - Full width en móvil, 1/3 en desktop */}
          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Buscar Todo</span>
              <span className="sm:hidden">Buscar</span>
            </button>
          </div>
        </div>
      </form>

      {/* Filtros expandibles */}
      {(showPriceFilters || showPropertyType || showZoneSearch) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          {showPriceFilters && (
            <div className="mb-4">
              <div className="mb-3 text-sm text-gray-600">
                <span className="font-medium">Filtros de precio activos:</span>
                <span className="ml-2">
                  Día: €{searchData.pricePerDay} | Mes: €{searchData.pricePerMonth}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PriceFilter
                  label="Precio máximo por día"
                  value={searchData.pricePerDay}
                  onChange={handlePricePerDayChange}
                  min={0}
                  max={500}
                  step={25}
                  className="mb-0"
                />
                
                <PriceFilter
                  label="Precio máximo por mes"
                  value={searchData.pricePerMonth}
                  onChange={handlePricePerMonthChange}
                  min={0}
                  max={5000}
                  step={100}
                  className="mb-0"
                />
              </div>
            </div>
          )}

          {showPropertyType && !isLoading && (
            <div className="mb-4">
              <div className="mb-3 text-sm text-gray-600">
                <span className="font-medium">Tipo de vivienda seleccionado:</span>
                <span className="ml-2">{getPropertyTypeLabel()}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availablePropertyTypes.slice(1).map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handlePropertyTypeChange(type.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      searchData.propertyType === type.value 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showZoneSearch && !isLoading && (
            <div>
              <div className="mb-3 text-sm text-gray-600">
                <span className="font-medium">Zona seleccionada:</span>
                <span className="ml-2">{getZoneLabel()}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableRegions.slice(1).map((region) => (
                  <button
                    key={region.value}
                    type="button"
                    onClick={() => handleZoneChange(region.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      searchData.zone === region.value 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LandingSearchForm; 
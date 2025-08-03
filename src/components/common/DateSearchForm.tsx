import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TailGridsDateRangePicker from './TailGridsDateRangePicker';
import PriceFilter from './PriceFilter';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

interface DateSearchFormProps {
  variant?: 'hero' | 'search';
  className?: string;
  // Props para integración con search page
  externalSearchData?: {
    location: string;
    checkIn: string;
    checkOut: string;
    pricePerDay?: number;
    pricePerMonth?: number;
  };
  onSearchDataChange?: (data: { 
    location: string; 
    checkIn: string; 
    checkOut: string;
    pricePerDay?: number;
    pricePerMonth?: number;
  }) => void;
  onSearch?: (e: React.FormEvent) => void;
}

const DateSearchForm: React.FC<DateSearchFormProps> = ({ 
  variant = 'hero', 
  className = '',
  externalSearchData,
  onSearchDataChange,
  onSearch
}) => {
  const isHero = variant === 'hero';
  const isExternal = !!externalSearchData;
  const [showPriceFilters, setShowPriceFilters] = useState(false);
  
  const [internalSearchData, setInternalSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    pricePerDay: 500,
    pricePerMonth: 5000
  });

  const searchData = isExternal ? externalSearchData! : internalSearchData;
  
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isExternal && onSearch) {
      onSearch(e);
      return;
    }

    // Comportamiento por defecto para hero
    const params = new URLSearchParams({
      query: searchData.location,
      location: searchData.location,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: '1',
      pricePerDay: (searchData.pricePerDay || 500).toString(),
      pricePerMonth: (searchData.pricePerMonth || 5000).toString()
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleLocationChange = (location: string) => {
    if (isExternal) {
      onSearchDataChange!({ ...searchData, location });
    } else {
      setInternalSearchData(prev => ({ ...prev, location }));
    }
  };

  const handleCheckInChange = (date: string) => {
    if (isExternal) {
      onSearchDataChange!({ ...searchData, checkIn: date });
    } else {
      setInternalSearchData(prev => ({ ...prev, checkIn: date }));
    }
  };

  const handleCheckOutChange = (date: string) => {
    if (isExternal) {
      onSearchDataChange!({ ...searchData, checkOut: date });
    } else {
      setInternalSearchData(prev => ({ ...prev, checkOut: date }));
    }
  };

  const handlePricePerDayChange = (price: number) => {
    if (isExternal) {
      onSearchDataChange!({ ...searchData, pricePerDay: price });
    } else {
      setInternalSearchData(prev => ({ ...prev, pricePerDay: price }));
    }
  };

  const handlePricePerMonthChange = (price: number) => {
    if (isExternal) {
      onSearchDataChange!({ ...searchData, pricePerMonth: price });
    } else {
      setInternalSearchData(prev => ({ ...prev, pricePerMonth: price }));
    }
  };

  return (
    <div className={`${isHero ? 'bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl' : 'bg-white rounded-lg p-4 shadow-md'} ${className}`}>
      <form onSubmit={handleSearch} className={`grid ${isHero ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'} gap-3 sm:gap-4 items-center`}>
        
        {/* Localización con Google Places */}
        <div className="relative">
          <GooglePlacesAutocomplete
            value={searchData.location}
            onChange={handleLocationChange}
            placeholder="¿Dónde quieres ir?"
            className="w-full"
          />
        </div>

        <div className="md:col-span-1">
          <TailGridsDateRangePicker
            checkIn={searchData.checkIn}
            checkOut={searchData.checkOut}
            onCheckInChange={handleCheckInChange}
            onCheckOutChange={handleCheckOutChange}
            placeholder="Seleccionar fechas"
          />
        </div>

        <div className={`${isHero ? 'md:col-span-2' : 'lg:col-span-3'} flex gap-2 items-center`}>
          <button
            type="submit"
            className={`flex-3 ${isHero ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2`}
          >
            <Search className="w-5 h-5" />
            <span>{isHero ? 'Buscar Todo' : 'Buscar'}</span>
          </button>

          {/* Botón de filtros de precio solo en hero */}
          {isHero && (
            <button
              type="button"
              onClick={() => setShowPriceFilters(!showPriceFilters)}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-between text-sm font-medium ${
                (searchData.pricePerDay !== 500 || searchData.pricePerMonth !== 5000) 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>
                Rango €
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
          )}
        </div>
      </form>

      {/* Filtros de precio expandibles solo en hero */}
      {isHero && showPriceFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="mb-3 text-sm text-gray-600">
            <span className="font-medium">Filtros activos:</span>
            <span className="ml-2">
              Día: €{searchData.pricePerDay} | Mes: €{searchData.pricePerMonth}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PriceFilter
              label="Precio máximo por día"
              value={searchData.pricePerDay || 500}
              onChange={handlePricePerDayChange}
              min={0}
              max={500}
              step={25}
              className="mb-0"
            />
            
            <PriceFilter
              label="Precio máximo por mes"
              value={searchData.pricePerMonth || 5000}
              onChange={handlePricePerMonthChange}
              min={0}
              max={5000}
              step={100}
              className="mb-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSearchForm; 
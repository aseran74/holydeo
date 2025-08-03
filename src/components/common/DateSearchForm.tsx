import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
    zone?: string;
    checkIn: string;
    checkOut: string;
    pricePerDay?: number;
    pricePerMonth?: number;
  };
  onSearchDataChange?: (data: { 
    location: string; 
    zone?: string;
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
    zone: '',
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
      zone: searchData.zone || '',
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

  // Función para manejar cambios de fechas en modo search
  const handleDateChange = (checkIn: string, checkOut: string) => {
    if (isExternal) {
      onSearchDataChange!({ ...searchData, checkIn, checkOut });
    } else {
      setInternalSearchData(prev => ({ ...prev, checkIn, checkOut }));
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
          {isExternal ? (
            <SearchDateRangePicker
              checkIn={searchData.checkIn}
              checkOut={searchData.checkOut}
              onDateChange={handleDateChange}
              placeholder="Seleccionar fechas"
            />
          ) : (
            <TailGridsDateRangePicker
              checkIn={searchData.checkIn}
              checkOut={searchData.checkOut}
              onCheckInChange={handleCheckInChange}
              onCheckOutChange={handleCheckOutChange}
              placeholder="Seleccionar fechas"
            />
          )}
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

// Componente personalizado para búsqueda que aplica fechas automáticamente
interface SearchDateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onDateChange: (checkIn: string, checkOut: string) => void;
  placeholder?: string;
}

const SearchDateRangePicker: React.FC<SearchDateRangePickerProps> = ({
  checkIn,
  checkOut,
  onDateChange,
  placeholder = "Seleccionar fechas"
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(checkIn || null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(checkOut || null);
  const [isOpen, setIsOpen] = useState(false);
  const datepickerRef = useRef<HTMLDivElement>(null);

  // Actualizar fechas cuando cambien las props
  useEffect(() => {
    setSelectedStartDate(checkIn || null);
    setSelectedEndDate(checkOut || null);
  }, [checkIn, checkOut]);

  const handleDayClick = (selectedDay: Date) => {
    const dayString = selectedDay.toISOString().split('T')[0];

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Primera selección o nueva selección
      setSelectedStartDate(dayString);
      setSelectedEndDate(null);
      // Aplicar inmediatamente en modo search
      onDateChange(dayString, '');
    } else {
      // Segunda selección
      if (new Date(dayString) < new Date(selectedStartDate)) {
        // Si la segunda fecha es anterior, intercambiar
        setSelectedStartDate(dayString);
        setSelectedEndDate(selectedStartDate);
        onDateChange(dayString, selectedStartDate);
      } else {
        setSelectedEndDate(dayString);
        onDateChange(selectedStartDate, dayString);
      }
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="w-[40px] h-[40px]"></div>);
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const dayString = day.toISOString().split('T')[0];
      const today = new Date();
      const isToday = day.toDateString() === today.toDateString();
      const isPast = day < new Date(today.setHours(0, 0, 0, 0));

      let className = "flex items-center justify-center cursor-pointer w-[40px] h-[40px] rounded-full text-gray-700 hover:bg-blue-500 hover:text-white transition-colors";

      // Fecha seleccionada como inicio
      if (selectedStartDate && dayString === selectedStartDate) {
        className = "flex items-center justify-center cursor-pointer w-[40px] h-[40px] bg-blue-500 text-white rounded-r-none";
      }
      
      // Fecha seleccionada como fin
      if (selectedEndDate && dayString === selectedEndDate) {
        className = "flex items-center justify-center cursor-pointer w-[40px] h-[40px] bg-blue-500 text-white rounded-l-none";
      }
      
      // Rango seleccionado
      if (selectedStartDate && selectedEndDate && 
          new Date(day) > new Date(selectedStartDate) && 
          new Date(day) < new Date(selectedEndDate)) {
        className = "flex items-center justify-center cursor-pointer w-[40px] h-[40px] bg-blue-100 text-blue-700 rounded-none";
      }

      // Días pasados
      if (isPast) {
        className += " text-gray-400 cursor-not-allowed hover:bg-transparent hover:text-gray-400";
      }

      // Hoy
      if (isToday) {
        className += " ring-2 ring-blue-300";
      }

      daysArray.push(
        <div
          key={i}
          className={className}
          data-date={dayString}
          onClick={() => !isPast && handleDayClick(day)}
        >
          {i}
        </div>
      );
    }

    return daysArray;
  };

  const updateInput = () => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      return `${start.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`;
    } else if (selectedStartDate) {
      const start = new Date(selectedStartDate);
      return `${start.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} - Seleccionar salida`;
    }
    return "";
  };

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const clearDates = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onDateChange("", "");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={datepickerRef}>
      <div className="relative flex items-center">
        <span className="absolute left-0 pl-5 text-gray-400">
          <Calendar className="w-5 h-5" />
        </span>

        <input
          type="text"
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 bg-gray-100 py-3 pl-[50px] pr-12 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white hover:bg-gray-200 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          value={updateInput()}
          readOnly
          onClick={toggleDatepicker}
        />

        {(selectedStartDate || selectedEndDate) && (
          <button
            type="button"
            onClick={clearDates}
            className="absolute right-8 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={toggleDatepicker}
          className="absolute right-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

             {isOpen && (
         <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-6 z-50 min-w-[320px]">
           <div className="flex items-center justify-between mb-4">
             <button
               type="button"
               onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
               className="p-1 hover:bg-gray-100 rounded"
             >
               <ChevronLeft className="w-4 h-4" />
             </button>
             <h3 className="text-lg font-semibold">
               {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
             </h3>
             <button
               type="button"
               onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
               className="p-1 hover:bg-gray-100 rounded"
             >
               <ChevronRight className="w-4 h-4" />
             </button>
           </div>

           <div className="grid grid-cols-7 gap-2 mb-3">
             {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
               <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                 {day}
               </div>
             ))}
           </div>

           <div className="grid grid-cols-7 gap-2">
             {renderCalendar()}
           </div>
         </div>
       )}
    </div>
  );
};

export default DateSearchForm; 
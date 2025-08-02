import React, { useState } from 'react';
import { Search, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DateRangePicker from './DateRangePicker';

interface DateSearchFormProps {
  variant?: 'hero' | 'search';
  className?: string;
}

const DateSearchForm: React.FC<DateSearchFormProps> = ({ 
  variant = 'hero', 
  className = '' 
}) => {
  const isHero = variant === 'hero';
  
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      query: searchData.location,
      location: searchData.location,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString()
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`${isHero ? 'bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl' : 'bg-white rounded-lg p-4 shadow-md'} ${className}`}>
      <form onSubmit={handleSearch} className={`grid ${isHero ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-4'} gap-3 sm:gap-4 items-center`}>
        
        <div className="relative lg:col-span-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="¿Dónde quieres ir?"
            value={searchData.location}
            onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="lg:col-span-1">
          <DateRangePicker
            checkIn={searchData.checkIn}
            checkOut={searchData.checkOut}
            onCheckInChange={(date) => setSearchData(prev => ({ ...prev, checkIn: date }))}
            onCheckOutChange={(date) => setSearchData(prev => ({ ...prev, checkOut: date }))}
            placeholder="Seleccionar fechas"
          />
        </div>

        {!isHero && (
          <div className="relative lg:col-span-1">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchData.guests}
              onChange={(e) => setSearchData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'huésped' : 'huéspedes'}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className={`w-full lg:col-span-1 ${isHero ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2`}
        >
          <Search className="w-5 h-5" />
          <span>{isHero ? 'Buscar Todo' : 'Buscar'}</span>
        </button>
      </form>
    </div>
  );
};

export default DateSearchForm; 
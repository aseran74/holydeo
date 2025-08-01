import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navegar a la página de propiedades con los filtros
    const params = new URLSearchParams({
      location: searchData.location,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString()
    });
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative text-white">
      {/* Video contenido */}
      <div className="relative w-full h-screen pt-16 sm:pt-0">
        {/* Video para móvil */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover md:hidden"
        >
          <source src="/video-hero.mp4" type="video/mp4" />
        </video>
        
        {/* Video para escritorio */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover hidden md:block"
        >
          <source src="/video-escritorio.mp4" type="video/mp4" />
        </video>
        
        {/* Fallback para navegadores que no soportan video */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 hidden"></div>
        
        {/* Overlay oscuro para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Contenido del hero sobre el video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-6 sm:px-8 md:px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white px-4">
              Vive fuera de temporada
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-blue-100 max-w-3xl mx-auto px-4">
              Encuentra alojamientos y planes fuera de temporada a precios imbatibles.
            </p>

            {/* Buscador */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto mx-4 sm:mx-auto">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="¿Dónde quieres ir?"
                    value={searchData.location}
                    onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'huésped' : 'huéspedes'}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="lg:col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Buscar Propiedades
                </button>
              </form>
            </div>

            {/* Estadísticas */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">500+</div>
                <div className="text-blue-100">Propiedades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">50+</div>
                <div className="text-blue-100">Destinos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">10k+</div>
                <div className="text-blue-100">Clientes Satisfechos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero; 
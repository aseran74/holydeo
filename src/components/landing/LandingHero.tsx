import { Search, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingHero = () => {
  return (
    <section className="relative w-full h-screen flex justify-center items-start pt-10 pb-32 md:pb-0 md:items-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video-hero.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>
      <div className="relative z-10 flex flex-col items-center gap-8 text-center px-4 w-full">
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 
            className="hidden md:block text-3xl lg:text-4xl font-bold text-white transform -rotate-3 mb-4"
            style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            Alójate y vive experiencias fuera de temporada a precios imbatibles
          </h2>
          <img 
            src="/images/logo2.png" 
            alt="Logo" 
            className="h-20 w-auto"
            style={{ filter: 'brightness(0) invert(1)' }} 
          />
        </div>
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 mt-4 md:mt-8">
          <div className="flex items-center bg-gray-100 p-3 rounded-xl w-full">
            <Search className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              placeholder="¿A dónde quieres ir?"
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center bg-gray-100 p-3 rounded-xl w-full">
            <CalendarDays className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              placeholder="Fecha de llegada"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center bg-gray-100 p-3 rounded-xl w-full">
            <CalendarDays className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              placeholder="Fecha de salida"
              onFocus={(e) => (e.target.type = 'date')}
              onBlur={(e) => (e.target.type = 'text')}
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500"
            />
          </div>
          <Link to="/archivo" className="w-full md:w-auto">
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 w-full"
            >
              Buscar
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingHero; 
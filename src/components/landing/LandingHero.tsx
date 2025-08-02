import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DateSearchForm from '../common/DateSearchForm';

const LandingHero = () => {
  const [showUnderline, setShowUnderline] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const heroHeight = windowHeight;
      
      // Mostrar el subrayado cuando estamos en la mitad del hero
      if (scrollY < heroHeight * 0.5) {
        setShowUnderline(true);
      } else {
        setShowUnderline(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar una vez al montar

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative text-white">
      <div className="relative w-full min-h-screen h-screen">
        {/* Videos y Overlay */}
        <video autoPlay muted loop playsInline className="w-full h-full object-cover object-center absolute inset-0 md:hidden" style={{ objectPosition: 'center 70%' }}>
          <source src="/video-hero.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="w-full h-full object-cover object-center absolute inset-0 hidden md:block" style={{ objectPosition: 'center 30%' }}>
          <source src="/video-escritorio.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Contenido del hero */}
        <div className="absolute inset-0 flex items-center justify-center py-96 sm:py-24 px-4">
          <div className="text-center w-full max-w-4xl mx-auto">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight text-white px-6 sm:px-4">
              Vive fuera de{' '}
              <span className="relative inline-block">
                temporada
                {/* ✨ SVG para el subrayado curvo ✨ */}
                <svg 
                  className={`absolute left-0 w-full bottom-[-10px] sm:bottom-[-14px] transition-all duration-1500 ease-in-out ${
                    showUnderline ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  viewBox="0 0 230 18" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M2 11.1455C41.2483 3.32203 162.656 -5.3339 228 15.493" 
                    stroke="#60A5FA" // Este es el color 'blue-400' de Tailwind
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className={`transition-all duration-1500 ease-in-out ${
                      showUnderline ? 'stroke-dasharray-300 stroke-dashoffset-0' : 'stroke-dasharray-300 stroke-dashoffset-300'
                    }`}
                  />
                </svg>
              </span>
              <span className="text-blue-400">.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Encuentra alojamientos y planes fuera de temporada a precios imbatibles.
            </p>

            {/* Buscador */}
            <div className="w-full max-w-4xl mx-auto">
              <DateSearchForm variant="hero" />
            </div>

            {/* Estadísticas */}
            <div className="mt-4 sm:mt-16 flex flex-row md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full px-6 sm:px-4">
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2">500+</div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100">Propiedades</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2">200+</div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100">Experiencias</div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2">600+</div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100">Clientes Satisfechos</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
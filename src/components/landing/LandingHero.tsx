import { useState, useEffect } from 'react';
import LandingSearchForm from '../common/LandingSearchForm';
import { useLanguage } from '../../context/LanguageContext';

const LandingHero = () => {
  const { t } = useLanguage();
  const [showUnderline, setShowUnderline] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileVideoPlaying] = useState(false);
  const [mobileVideoRef, setMobileVideoRef] = useState<HTMLVideoElement | null>(null);
  const [desktopVideoRef, setDesktopVideoRef] = useState<HTMLVideoElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      const windowHeight = window.innerHeight;
      const heroHeight = windowHeight;
      
      // Mostrar el subrayado cuando estamos en la mitad del hero
      if (currentScrollY < heroHeight * 0.5) {
        setShowUnderline(true);
      } else {
        setShowUnderline(false);
      }

      // Mostrar las estadísticas cuando hacemos scroll y mantenerlas visibles
      if (currentScrollY > 100) {
        setShowStats(true);
      }
      // Quitamos el else para que no se oculten una vez que aparezcan
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar una vez al montar

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Efecto para configurar el tiempo de inicio del video
  useEffect(() => {
    const setVideoStartTime = (videoElement: HTMLVideoElement) => {
      if (videoElement) {
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.currentTime = 1; // Empezar en el segundo 1
        });
        
        // También configurar cuando el video esté listo para reproducir
        videoElement.addEventListener('canplay', () => {
          if (videoElement.currentTime < 1) {
            videoElement.currentTime = 1;
          }
        });
      }
    };

    if (mobileVideoRef) {
      setVideoStartTime(mobileVideoRef);
    }
    
    if (desktopVideoRef) {
      setVideoStartTime(desktopVideoRef);
    }
  }, [mobileVideoRef, desktopVideoRef]);

  return (
    <section 
      className="relative text-white overflow-hidden m-0 p-0" 
      style={{ 
        margin: 0, 
        padding: 0,
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
    >
      <div 
        className="relative w-full min-h-screen h-[120vh] m-0 p-0" 
        style={{ 
          margin: 0, 
          padding: 0,
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Video para móvil y escritorio con diferentes archivos */}
        {isMobile ? (
          // Video para móvil (< 640px)
          <div className="relative w-full h-full m-0 p-0" style={{ margin: 0, padding: 0 }}>
            <video 
              ref={setMobileVideoRef}
              autoPlay 
              muted 
              loop 
              playsInline 
              preload="auto"
              className="w-full h-full object-cover object-center absolute inset-0 m-0 p-0"
              style={{ 
                objectPosition: 'center 30%', 
                margin: 0, 
                padding: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%'
              }}
            >
              <source src="/video-movil.mp4" type="video/mp4" />
              {/* Fallback por si el video no carga */}
              <img 
                src="/immovil.jpg"
                alt="Hero móvil fallback"
                className="w-full h-full object-cover object-center m-0 p-0"
                style={{ margin: 0, padding: 0 }}
              />
            </video>
            
            {/* Botón de play manual si el video no se reproduce automáticamente */}
            {!mobileVideoPlaying && mobileVideoRef && (
              <button
                onClick={() => {
                  if (mobileVideoRef) {
                    mobileVideoRef.play();
                  }
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 z-10"
              >
                ▶️ {t('hero.search.playVideo')}
              </button>
            )}
          </div>
        ) : (
          // Video para tablet y escritorio (≥ 640px)
          <video 
            ref={setDesktopVideoRef}
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover object-center absolute inset-0 m-0 p-0" 
            style={{ 
              objectPosition: 'center 30%', 
              margin: 0, 
              padding: 0,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <source src="/video-escritorio.mp4" type="video/mp4" />
          </video>
        )}
        
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Contenido del hero */}
        <div className="absolute inset-0 flex items-center justify-center py-96 sm:py-32 px-4">
          <div className="text-center w-full max-w-4xl mx-auto">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight text-white px-6 sm:px-4">
              {t('hero.title')}{' '}
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
                    style={{
                      strokeDasharray: 300,
                      strokeDashoffset: showUnderline ? 0 : 300,
                      transform: `translateX(${scrollY * 0.1}px)`
                    }}
                  />
                </svg>
              </span>
              {/* Punto azul solo en tablet y escritorio */}
              <span className="hidden sm:inline text-blue-400">.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Buscador */}
            <div className="w-full max-w-4xl mx-auto relative z-50">
              <LandingSearchForm />
            </div>

            {/* Estadísticas con efecto de scroll */}
            <div className={`mt-8 sm:mt-12 flex flex-row md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full px-6 sm:px-4 transition-all duration-1000 ease-out transform z-[-10] ${
              showStats 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2 transition-all duration-700 delay-200">
                  500+
                </div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100 transition-all duration-700 delay-300">
                  {t('hero.stats.properties')}
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2 transition-all duration-700 delay-400">
                  200+
                </div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100 transition-all duration-700 delay-500">
                  {t('hero.stats.experiences')}
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2 transition-all duration-700 delay-600">
                  600+
                </div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100 transition-all duration-700 delay-700">
                  {t('hero.stats.satisfiedClients')}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
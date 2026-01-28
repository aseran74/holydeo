import { useState, useEffect, useMemo } from 'react';
import LandingSearchForm from '../common/LandingSearchForm';
import { useLanguage } from '../../context/LanguageContext';

// Generar array de imágenes secuenciales (WebP) - Hasta 50 fotogramas
const generateImageSequence = () => {
  const images: string[] = [];
  for (let i = 0; i <= 49; i++) {
    const num = i.toString().padStart(3, '0');
    images.push(`/Hero4/Video4_${num}.webp`);
  }
  return images;
};

const IMAGE_SEQUENCE = generateImageSequence();
const TOTAL_IMAGES = IMAGE_SEQUENCE.length;

function getInitialHeroState() {
  if (typeof window === 'undefined')
    return { scrollY: 0, showUnderline: true, showStats: false, isMobile: false, currentImageIndex: 0 };
  const w = window.innerWidth;
  const isMobile = w < 640;
  const scrollY = window.scrollY;
  const h = window.innerHeight;
  const showUnderline = scrollY < h * 0.5;
  const showStats = scrollY > 100;
  let currentImageIndex = 0;
  if (!isMobile) {
    const p = Math.min(Math.max(scrollY / h, 0), 1);
    currentImageIndex = Math.floor(p * (TOTAL_IMAGES - 1));
  }
  return { scrollY, showUnderline, showStats, isMobile, currentImageIndex };
}

const LandingHero = () => {
  const { t, language } = useLanguage();
  const initial = useMemo(() => getInitialHeroState(), []);
  const [showUnderline, setShowUnderline] = useState(initial.showUnderline);
  const [showStats, setShowStats] = useState(initial.showStats);
  const [isMobile, setIsMobile] = useState(initial.isMobile);
  const [scrollY, setScrollY] = useState(initial.scrollY);
  const [currentImageIndex, setCurrentImageIndex] = useState(initial.currentImageIndex);
  const [videoEnded, setVideoEnded] = useState(false);
  const [mobileVideoRef, setMobileVideoRef] = useState<HTMLVideoElement | null>(null);
  const [desktopVideoRef, setDesktopVideoRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        setScrollY(currentScrollY);

        // Actualizar imágenes si el video terminó (tanto móvil como desktop)
        if (videoEnded) {
          const scrollProgress = Math.min(Math.max(currentScrollY / heroHeight, 0), 1);
          const targetIndex = Math.floor(scrollProgress * (TOTAL_IMAGES - 1));
          setCurrentImageIndex(Math.max(0, Math.min(TOTAL_IMAGES - 1, targetIndex)));
        }

        setShowUnderline(currentScrollY < heroHeight * 0.5);
        if (currentScrollY > 100) setShowStats(true);

        rafId = null;
      });
    };

    const init = () => {
      const currentScrollY = window.scrollY;
      const h = window.innerHeight;
      setScrollY(currentScrollY);
      setShowUnderline(currentScrollY < h * 0.5);
      if (currentScrollY > 100) setShowStats(true);
      if (videoEnded) {
        const progress = Math.min(Math.max(currentScrollY / h, 0), 1);
        const idx = Math.floor(progress * (TOTAL_IMAGES - 1));
        setCurrentImageIndex((prev) => (prev !== idx ? idx : prev));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    init();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [isMobile, videoEnded]);

  // Precarga de todas las imágenes del hero con cache (móvil y desktop)
  useEffect(() => {
    IMAGE_SEQUENCE.forEach((src) => {
      const img = new Image();
      // Forzar cache agregando timestamp para evitar problemas de cache
      img.src = src;
      // Pre-cargar con fetch para asegurar cache
      fetch(src, { 
        cache: 'force-cache',
        method: 'GET',
        headers: {
          'Cache-Control': 'max-age=31536000'
        }
      }).catch(() => {
        // Si falla el fetch, la imagen se cargará normalmente
      });
    });
  }, []);

  // Efecto para configurar el tiempo de inicio del video en móvil y detectar cuando termina
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

        // Detectar cuando el video termina
        videoElement.addEventListener('ended', () => {
          setVideoEnded(true);
        });
      }
    };

    if (mobileVideoRef) {
      setVideoStartTime(mobileVideoRef);
    }
  }, [mobileVideoRef]);

  // Efecto para configurar el tiempo de inicio del video en desktop y detectar cuando termina
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

        // Detectar cuando el video termina
        videoElement.addEventListener('ended', () => {
          setVideoEnded(true);
        });
      }
    };

    if (desktopVideoRef) {
      setVideoStartTime(desktopVideoRef);
    }
  }, [desktopVideoRef]);

  return (
    <section 
      className="relative text-white overflow-hidden m-0 p-0" 
      style={{ 
        width: '100vw',
        left: '50%',
        transform: 'translateX(-50%)',
        position: 'relative',
      }}
    >
      <div 
        className="relative w-full min-h-screen h-[120vh] sm:h-[144vh] m-0 p-0" 
        style={{ 
          margin: 0, 
          padding: 0,
          width: '100%',
          position: 'relative'
        }}
      >
        {/* Video para móvil y desktop */}
        {isMobile ? (
          // Video o imágenes secuenciales para móvil (< 640px)
          <div className="relative w-full h-full">
            {!videoEnded ? (
              // Mostrar video hasta que termine
              <video 
                ref={setMobileVideoRef}
                autoPlay 
                muted 
                playsInline 
                preload="auto"
                className="w-full h-full object-cover"
                style={{ 
                  objectPosition: 'center center',
                  width: '100%',
                  height: '100%',
                  filter: 'brightness(1.2) contrast(1.1)'
                }}
              >
                <source src="/Video4.mp4" type="video/mp4" />
                {/* Fallback por si el video no carga */}
                <img 
                  src="/immovil.jpg"
                  alt="Hero móvil fallback"
                  className="w-full h-full object-cover"
                />
              </video>
            ) : (
              // Mostrar imágenes secuenciales cuando el video termine
              <img
                src={IMAGE_SEQUENCE[currentImageIndex]}
                alt="Hero"
                className="w-full h-full object-cover absolute m-0 p-0"
                style={{
                  // 'top' controla qué tan abajo empieza la imagen
                  top: '00%', 
                  left: 0,
                  width: '100%',
                  height: '100%', 
                  // 'center 20%' hace que se vea más la parte de arriba de la foto
                  objectPosition: 'center 200%', 
                  transform: 'translateZ(0)',
                  imageRendering: 'auto',
                  transition: 'object-position 0.5s ease-out', // Suaviza el cambio
                  filter: 'brightness(1.2) contrast(1.1)'
                }}
              />
            )}
          </div>
        ) : (
          // Video o imágenes secuenciales para tablet y escritorio (≥ 640px)
          <div className="relative w-full h-full m-0 p-0" style={{ margin: 0, padding: 0 }}>
            {!videoEnded ? (
              // Mostrar video hasta que termine
              <video 
                ref={setDesktopVideoRef}
                autoPlay 
                muted 
                playsInline 
                preload="auto"
                className="w-full h-full object-cover object-center absolute inset-0 m-0 p-0"
                style={{ 
                  objectPosition: 'center 100%', 
                  margin: 0, 
                  padding: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  filter: 'brightness(1.2) contrast(1.1)'
                }}
              >
                <source src="/Video4.mp4" type="video/mp4" />
                {/* Fallback por si el video no carga */}
                <img 
                  src="/immovil.jpg"
                  alt="Hero desktop fallback"
                  className="w-full h-full object-cover object-center m-0 p-0"
                  style={{ margin: 10, padding: 0 }}
                />
              </video>
            ) : (
              // Mostrar imágenes secuenciales cuando el video termine
              <img
                src={IMAGE_SEQUENCE[currentImageIndex]}
                alt="Hero"
                className="w-full h-full object-cover object-center absolute inset-0 m-0 p-0"
                style={{
                  objectPosition: 'center 100%',
                  margin: 0,
                  padding: 0,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  transform: 'translateZ(0)',
                  imageRendering: 'auto',
                  filter: 'brightness(1.2) contrast(1.1)'
                }}
              />
            )}
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 sm:bg-black/40 z-0"></div>

        {/* Contenido del hero */}
        <div className="absolute inset-0 flex items-start justify-center pt-24 sm:pt-32 pb-16 px-4 z-10">
          <div className="text-center w-full max-w-4xl mx-auto">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight text-white px-6 sm:px-4 drop-shadow-lg">
              {t('hero.title')}{' '}
              {language === 'es' && (
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
                      stroke="#3B82F6" // Color blue-500 más intenso
                      strokeWidth="6" 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-all duration-1500 ease-in-out ${
                        showUnderline ? 'stroke-dasharray-300 stroke-dashoffset-0' : 'stroke-dasharray-300 stroke-dashoffset-300'
                      }`}
                      style={{
                        strokeDasharray: 300,
                        strokeDashoffset: showUnderline ? 0 : 300,
                        transform: `translateX(${scrollY * 0.1}px)`,
                        filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
                      }}
                    />
                  </svg>
                </span>
              )}
              {/* Punto azul solo en tablet y escritorio */}
              <span className="hidden sm:inline text-blue-400">.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl mb-8 text-white max-w-3xl mx-auto drop-shadow-md">
              {t('hero.subtitle')}
            </p>

            {/* Buscador */}
            <div id="search" className="w-full max-w-4xl mx-auto relative z-20 scroll-mt-24">
              <LandingSearchForm />
            </div>

            {/* Estadísticas con efecto de scroll */}
            <div className={`mt-8 sm:mt-12 flex flex-row md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full px-6 sm:px-4 transition-all duration-1000 ease-out transform z-10 ${
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
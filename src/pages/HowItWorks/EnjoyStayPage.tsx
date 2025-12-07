import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingNavbar from '../../components/landing/LandingNavbar';
import LandingFooter from '../../components/landing/LandingFooter';
import { 
  CheckCircle, 
  Users, 
  UtensilsCrossed, 
  Palette, 
  Calendar,
  Heart,
  Sparkles,
  Gift,
  Home,
  RefreshCw
} from 'lucide-react';

const EnjoyStayPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LandingNavbar />
      
      {/* Hero Section - Rehecho desde cero */}
      <section className="relative w-full overflow-hidden bg-gray-900 text-white min-h-[100vh] h-[100vh] md:min-h-[180vh] md:h-[180vh]">
        {/* Fondo negro base */}
        <div className="absolute inset-0 bg-black z-0 pointer-events-none"></div>
        
        {/* Capa 1 - Fondo de estrellas (estrellas.jpg) - detrás de la casa con efecto parallax */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img 
            src="/estrellas.jpg"
            alt="Estrellas" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
        {/* Capa 2 - Casa moderna (fondo1) - encima de las estrellas, ocupa toda la página */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Imagen para desktop */}
          <img 
            src="/fondo1.png"
            alt="Casa moderna" 
            className="hidden md:block w-full h-full object-cover"
          />
          {/* Imagen para móvil - posición baja */}
          <div className="block md:hidden w-full h-full flex items-end justify-center">
            <img 
              src="/Fondo1movil-removebg-preview.png"
              alt="Casa moderna móvil" 
              className="w-full h-auto object-contain"
              style={{ maxHeight: '100%' }}
            />
          </div>
        </div>
        
        {/* Capa 3 - Luna (fondo3) - z-index detrás de la casa pero encima de las estrellas con efecto parallax horizontal */}
        <div 
          className="absolute inset-0 flex items-start justify-center pt-8 md:pt-4 pointer-events-none" 
          style={{ 
            zIndex: 15,
            transform: `translateX(${-scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img 
            src="/fondo3.png"
            alt="Luna" 
            className="object-contain"
            style={{ 
              width: '800px', 
              height: '800px',
              opacity: 0.9
            }}
          />
        </div>
        
        {/* Overlay oscuro adicional para mayor efecto nocturno */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none"></div>
        
        {/* Contenido del hero */}
        <div className="relative z-40 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-3 mb-6">
                <img 
                  src="/logotrans-white.svg"
                  alt="Holydeo Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Disfruta tu estancia
              </h1>
              <p className="text-base md:text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto">
                Te ofrecemos mucho más que un alojamiento: te abrimos la puerta a una experiencia completa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia Completa */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-purple-100 dark:bg-purple-900/30 rounded-full p-4 mb-6">
                <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Durante tu estancia podrás acceder a <strong className="text-purple-600 dark:text-purple-400">actividades exclusivas</strong> con descuentos especiales, 
                como nuestros Green Fests mensuales con precios de derribo, propuestas gastronómicas únicas, eventos de arte, cultura y una 
                <strong className="text-purple-600 dark:text-purple-400"> red social privada</strong> para conocer a otros viajeros, nómadas digitales y residentes con tus mismas inquietudes.
              </p>
            </div>

            {/* Actividades */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  icon: Gift, 
                  title: "Green Fests mensuales", 
                  desc: "Precios de derribo",
                  color: "from-green-500 to-emerald-600",
                  bg: "bg-green-50 dark:bg-green-900/20",
                  border: "border-green-200 dark:border-green-800"
                },
                { 
                  icon: UtensilsCrossed, 
                  title: "Propuestas gastronómicas", 
                  desc: "Experiencias únicas",
                  color: "from-orange-500 to-red-600",
                  bg: "bg-orange-50 dark:bg-orange-900/20",
                  border: "border-orange-200 dark:border-orange-800"
                },
                { 
                  icon: Palette, 
                  title: "Eventos de arte y cultura", 
                  desc: "Actividades culturales",
                  color: "from-pink-500 to-rose-600",
                  bg: "bg-pink-50 dark:bg-pink-900/20",
                  border: "border-pink-200 dark:border-pink-800"
                },
                { 
                  icon: Users, 
                  title: "Red social privada", 
                  desc: "Conecta con otros viajeros",
                  color: "from-blue-500 to-indigo-600",
                  bg: "bg-blue-50 dark:bg-blue-900/20",
                  border: "border-blue-200 dark:border-blue-800"
                }
              ].map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div 
                    key={index}
                    className={`${activity.bg} ${activity.border} rounded-xl p-6 border hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className={`bg-gradient-to-br ${activity.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Free Cancel */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 md:p-12 border border-blue-200 dark:border-blue-800 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-block bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 mb-6">
                  <RefreshCw className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Free Cancel: Tu estancia, tus reglas
                </h2>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700 mb-6">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Además, si tus planes cambian, no te preocupes. Gracias a nuestra opción <strong className="text-blue-600 dark:text-blue-400">Free Cancel</strong>, 
                  puedes rescindir tu contrato y cambiarte a otra propiedad siempre que lo necesites —según las condiciones pactadas, plazos de preaviso y disponibilidad— 
                  para que siempre estés en el lugar que mejor encaje contigo.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: CheckCircle, text: "Flexibilidad total", color: "text-green-600 dark:text-green-400" },
                  { icon: Home, text: "Cambio de propiedad", color: "text-blue-600 dark:text-blue-400" },
                  { icon: Calendar, text: "Según condiciones", color: "text-purple-600 dark:text-purple-400" }
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg p-4">
                      <IconComponent className={`w-6 h-6 ${feature.color}`} />
                      <span className="font-semibold text-gray-900 dark:text-white">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tu estancia, tus reglas
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Aquí vienes a vivir, disfrutar y conectar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
              >
                Explorar propiedades
              </Link>
              <Link
                to="/search?type=experiences"
                className="inline-block bg-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-400 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform border border-white/20"
              >
                Ver experiencias
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default EnjoyStayPage;


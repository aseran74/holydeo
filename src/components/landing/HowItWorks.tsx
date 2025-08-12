import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenSquare, PartyPopper } from 'lucide-react';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const steps: Step[] = [
  {
    icon: <Search size={36} />,
    title: 'Más que Vacaciones, una Inmersión Total',
    description:
      'Alojamientos diseñados para viajeros que buscan experiencias auténticas y prolongadas en destinos vacacionales durante temporada baja. Perfectos para nómadas digitales, prejubilados, creativos y profesionales en año sabático.',
    color: 'text-blue-500',
    gradient: 'from-blue-100 to-blue-300 dark:from-blue-900/30 dark:to-blue-700/20'
  },
  {
    icon: <PenSquare size={36} />,
    title: 'Tranquilidad Fuera de Temporada',
    description:
      'Disfruta la tranquilidad fuera de temporada alta: precios accesibles, menos multitudes y conexión auténtica con el destino.',
    color: 'text-green-500',
    gradient: 'from-green-100 to-green-300 dark:from-green-900/30 dark:to-green-700/20'
  },
  {
    icon: <PartyPopper size={36} />,
    title: 'Reserva Inteligente: Flexibilidad y Ahorro Real',
    description:
      'Olvídate de tarifas infladas de grandes plataformas. Contratos de 15 días a 9 meses con precios significativamente más económicos que Airbnb o Booking, condiciones flexibles y tarifas especiales de temporada baja.',
    color: 'text-pink-500',
    gradient: 'from-pink-100 to-pink-300 dark:from-pink-900/30 dark:to-pink-700/20'
  },
  {
    icon: <Search size={36} />,
    title: 'Cultura y Tradición',
    description:
      'Recorre pueblos blancos, mercados locales y gastronomía auténtica.',
    color: 'text-purple-500',
    gradient: 'from-purple-100 to-purple-300 dark:from-purple-900/30 dark:to-purple-700/20'
  },
  {
    icon: <PenSquare size={36} />,
    title: 'Deporte y Aventura',
    description:
      'Aprende golf o kitesurf con instructores locales y tarifas especiales de temporada baja.',
    color: 'text-orange-500',
    gradient: 'from-orange-100 to-orange-300 dark:from-orange-900/30 dark:to-orange-700/20'
  },
  {
    icon: <PartyPopper size={36} />,
    title: 'Tu Ritmo',
    description:
      'De 15 días a 9 meses para vivir como un local y dominar nuevas experiencias.',
    color: 'text-indigo-500',
    gradient: 'from-indigo-100 to-indigo-300 dark:from-indigo-900/30 dark:to-indigo-700/20'
  }
];

const HowItWorks = () => {
  return (
    <section
      className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        {/* Encabezado */}
        <div className="text-center">
          <h2
            id="how-it-works-heading"
            className="text-base font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase"
          >
            Cómo funciona
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
            Estancias Largas con Experiencias Únicas
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            De 15 días a 9 meses en destinos vacacionales fuera de temporada
          </p>
        </div>

        {/* Pasos */}
        <div className="mt-20 relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-x-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative p-6 sm:p-8 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl"
            >
              {/* Número */}
              <div className="absolute -top-6 left-4 md:-left-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                {index + 1}
              </div>

              {/* Icono animado */}
              <motion.div
                whileHover={{ rotate: 8, scale: 1.15 }}
                className={`mb-5 flex justify-center`}
              >
                <div
                  className={`p-4 rounded-full bg-gradient-to-br ${step.gradient} shadow-lg ${step.color}`}
                >
                  {step.icon}
                </div>
              </motion.div>

              {/* Título y descripción */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                {step.title}
              </h3>
              <p className="mt-3 text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <a
            href="#search"
            className="inline-block px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            Empieza a vivir tu próxima experiencia
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 
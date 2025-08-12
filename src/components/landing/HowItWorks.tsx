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
      'Nuestros alojamientos están diseñados para viajeros que buscan una experiencia auténtica y prolongada. Son el refugio perfecto para nómadas digitales, prejubilados apasionados del golf, blogueros de viajes, creativos y profesionales que aprovechan un año sabático o estancia de investigación.',
    color: 'text-blue-500',
    gradient: 'from-blue-100 to-blue-300 dark:from-blue-900/30 dark:to-blue-700/20'
  },
  {
    icon: <PenSquare size={36} />,
    title: 'Reserva Inteligente: Flexibilidad y Ahorro Real',
    description:
      'Olvídate de las tarifas infladas y las restricciones de las grandes plataformas. Ofrecemos contratos de media estancia con precios significativamente más económicos que Airbnb o Booking, condiciones flexibles y tarifas especiales de temporada baja.',
    color: 'text-pink-500',
    gradient: 'from-pink-100 to-pink-300 dark:from-pink-900/30 dark:to-pink-700/20'
  },
  {
    icon: <PartyPopper size={36} />,
    title: 'Vive el Destino, No Solo lo Visites',
    description:
      'Te damos el tiempo y las herramientas para que vivas una experiencia completa. Sumérgete en la cultura local: explora mercados tradicionales, saborea la auténtica gastronomía, disfruta de tu deporte favorito y conecta con la comunidad a través de actividades únicas.',
    color: 'text-green-500',
    gradient: 'from-green-100 to-green-300 dark:from-green-900/30 dark:to-green-700/20'
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
            Estancias prolongadas para vivir, trabajar y disfrutar
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Ya sea que busques un cambio de aire para teletrabajar, aprovechar tu prejubilación o
            sumergirte en nuevas culturas, nuestro proceso te conecta con el lugar perfecto para
            quedarte y vivir la experiencia completa.
          </p>
        </div>

        {/* Pasos */}
        <div className="mt-20 relative grid grid-cols-1 md:grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-x-8">
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
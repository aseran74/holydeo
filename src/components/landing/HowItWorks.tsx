import React from 'react';
import { Search, PenSquare, PartyPopper } from 'lucide-react';

// Define la estructura de cada paso
interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Array con la información de los pasos. ¡Fácil de modificar!
const steps: Step[] = [
  {
    icon: <Search size={40} className="text-blue-500" />,
    title: 'Explora y Descubre',
    description: 'Navega entre cientos de propiedades y experiencias únicas. Usa nuestros filtros para encontrar justo lo que buscas.'
  },
  {
    icon: <PenSquare size={40} className="text-blue-500" />,
    title: 'Reserva Fácilmente',
    description: 'Una vez que encuentres tu lugar ideal, resérvalo en segundos con nuestro sistema de pago seguro y transparente.'
  },
  {
    icon: <PartyPopper size={40} className="text-blue-500" />,
    title: 'Disfruta tu Estancia',
    description: '¡Todo listo! Prepara tus maletas y prepárate para vivir una experiencia inolvidable. Estamos para ayudarte si lo necesitas.'
  }
];

const HowItWorks = () => {
  return (
    <div className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Cómo funciona</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
            Tu próxima aventura en 3 simples pasos
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Hemos diseñado un proceso sencillo para que encuentres y reserves tu estancia sin complicaciones.
          </p>
        </div>

        {/* Contenedor de los pasos con la línea de conexión */}
        <div className="mt-20">
          <div className="relative">
            {/* Línea punteada de fondo (solo visible en pantallas medianas o más grandes) */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-1/2 left-0 w-full h-0.5"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-700"></div>
              </div>
            </div>

            {/* Grid para las tarjetas de los pasos */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-x-8">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="relative p-6 sm:p-8 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Círculo con el número del paso */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg hover:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  
                  {/* Icono */}
                  <div className="mb-5 flex justify-center">
                    <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Título y descripción */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">{step.title}</h3>
                  <p className="mt-3 text-base text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks; 
import React from 'react';
import LottieIcon from '../common/LottieIcon';

// Define la estructura de cada paso
interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Animaciones Lottie inline para cada paso
const searchAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "Search",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Search Icon",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 0, "k": 0},
        "p": {"a": 0, "k": [100, 100, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [100, 100, 100]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": {"a": 0, "k": [80, 80]},
              "p": {"a": 0, "k": [0, 0]},
              "nm": "Ellipse Path 1"
            },
            {
              "ty": "st",
              "c": {"a": 0, "k": [0.2, 0.4, 1, 1]},
              "o": {"a": 0, "k": 100},
              "w": {"a": 0, "k": 8},
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0]},
              "a": {"a": 0, "k": [0, 0]},
              "s": {"a": 0, "k": [100, 100]},
              "r": {"a": 0, "k": 0},
              "o": {"a": 0, "k": 100}
            }
          ],
          "nm": "Circle"
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "d": 1,
              "s": {"a": 0, "k": [4, 20]},
              "p": {"a": 0, "k": [60, 60]},
              "r": {"a": 0, "k": 0},
              "nm": "Rectangle Path 1"
            },
            {
              "ty": "fl",
              "c": {"a": 0, "k": [0.2, 0.4, 1, 1]},
              "o": {"a": 0, "k": 100}
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0]},
              "a": {"a": 0, "k": [0, 0]},
              "s": {"a": 0, "k": [100, 100]},
              "r": {"a": 0, "k": 45},
              "o": {"a": 0, "k": 100}
            }
          ],
          "nm": "Handle"
        }
      ]
    }
  ]
};

const bookingAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "Booking",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Calendar",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 0, "k": 0},
        "p": {"a": 0, "k": [100, 100, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [100, 100, 100]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "rc",
              "s": {"a": 0, "k": [120, 100]},
              "p": {"a": 0, "k": [0, 0]},
              "r": {"a": 0, "k": 8},
              "nm": "Rectangle Path 1"
            },
            {
              "ty": "fl",
              "c": {"a": 0, "k": [0.2, 0.4, 1, 1]},
              "o": {"a": 0, "k": 100}
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0]},
              "a": {"a": 0, "k": [0, 0]},
              "s": {"a": 0, "k": [100, 100]},
              "r": {"a": 0, "k": 0},
              "o": {"a": 0, "k": 100}
            }
          ],
          "nm": "Calendar Body"
        },
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "rc",
              "s": {"a": 0, "k": [120, 20]},
              "p": {"a": 0, "k": [0, -50]},
              "r": {"a": 0, "k": [8, 8, 0, 0]},
              "nm": "Rectangle Path 1"
            },
            {
              "ty": "fl",
              "c": {"a": 0, "k": [0.1, 0.3, 0.9, 1]},
              "o": {"a": 0, "k": 100}
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0]},
              "a": {"a": 0, "k": [0, 0]},
              "s": {"a": 0, "k": [100, 100]},
              "r": {"a": 0, "k": 0},
              "o": {"a": 0, "k": 100}
            }
          ],
          "nm": "Calendar Header"
        }
      ]
    }
  ]
};

const enjoyAnimation = {
  "v": "5.7.4",
  "fr": 30,
  "ip": 0,
  "op": 60,
  "w": 200,
  "h": 200,
  "nm": "Enjoy",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Party",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 0, "k": 0},
        "p": {"a": 0, "k": [100, 100, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [100, 100, 100]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "d": 1,
              "ty": "el",
              "s": {"a": 0, "k": [20, 20]},
              "p": {"a": 0, "k": [0, 0]},
              "nm": "Ellipse Path 1"
            },
            {
              "ty": "fl",
              "c": {"a": 0, "k": [1, 0.8, 0, 1]},
              "o": {"a": 0, "k": 100}
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0]},
              "a": {"a": 0, "k": [0, 0]},
              "s": {"a": 0, "k": [100, 100]},
              "r": {"a": 0, "k": 0},
              "o": {"a": 0, "k": 100}
            }
          ],
          "nm": "Star"
        }
      ]
    }
  ]
};

// Array con la información de los pasos. ¡Fácil de modificar!
const steps: Step[] = [
  {
    icon: <LottieIcon animationData={searchAnimation} size={60} />,
    title: 'Explora y Descubre',
    description: 'Navega entre cientos de propiedades y experiencias únicas. Usa nuestros filtros para encontrar justo lo que buscas.'
  },
  {
    icon: <LottieIcon animationData={bookingAnimation} size={60} />,
    title: 'Reserva Fácilmente',
    description: 'Una vez que encuentres tu lugar ideal, resérvalo en segundos con nuestro sistema de pago seguro y transparente.'
  },
  {
    icon: <LottieIcon animationData={enjoyAnimation} size={60} />,
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
                  className="relative p-6 sm:p-8 bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Círculo con el número del paso */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce-in">
                    {index + 1}
                  </div>
                  
                  {/* Icono Lottie */}
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

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
          }
          70% {
            transform: scale(0.9) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HowItWorks; 
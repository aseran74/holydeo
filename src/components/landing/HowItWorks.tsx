import { Search, Calendar, Star, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Busca tu destino",
      description: "Encuentra la propiedad perfecta en tu destino favorito usando nuestro buscador inteligente.",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Reserva fácilmente",
      description: "Selecciona tus fechas y completa la reserva en pocos clics con nuestro sistema seguro.",
      color: "bg-green-500"
    },
    {
      icon: Star,
      title: "Disfruta tu estancia",
      description: "Llega a tu propiedad y disfruta de una experiencia única con todas las comodidades.",
      color: "bg-yellow-500"
    },
    {
      icon: CheckCircle,
      title: "Valora tu experiencia",
      description: "Comparte tu opinión y ayuda a otros viajeros a elegir su próxima aventura.",
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Encuentra y reserva tu propiedad ideal en solo 4 simples pasos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                {/* Línea conectora */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2 z-0"></div>
                )}
                
                {/* Número del paso */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>
                
                {/* Icono */}
                <div className={`relative w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105">
            Empezar a buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 
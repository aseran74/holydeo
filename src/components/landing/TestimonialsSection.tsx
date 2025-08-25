import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  location?: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = [] }) => {
  // Datos por defecto si no hay testimonios
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      name: "María García",
      role: "Inquilina de Temporada",
      content: "La experiencia fue increíble. La propiedad superó todas nuestras expectativas y el proceso de reserva fue muy sencillo. Definitivamente volveremos el próximo año.",
      rating: 5,
      location: "Madrid, España"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Familia Vacacional",
      content: "Perfecto para nuestras vacaciones familiares. La casa tenía todo lo necesario y la ubicación era ideal para explorar la zona. Muy recomendable.",
      rating: 5,
      location: "Barcelona, España"
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Profesional Remoto",
      content: "Trabajé desde la propiedad durante 3 meses y fue excelente. Conexión WiFi perfecta, ambiente tranquilo y todas las comodidades necesarias.",
      rating: 5,
      location: "Valencia, España"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Quote className="w-4 h-4" />
            Testimonios de Clientes
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre por qué miles de personas eligen nuestras propiedades para sus estancias temporales
          </p>
        </div>

        {/* Testimonios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.rating}/5
                </span>
              </div>

              {/* Contenido */}
              <blockquote className="mb-6">
                <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-3 opacity-50" />
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </blockquote>

              {/* Información del cliente */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>

                {/* Detalles */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                  {testimonial.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      📍 {testimonial.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para vivir tu experiencia?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Únete a miles de clientes satisfechos que ya han disfrutado de nuestras propiedades de temporada
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explorar Propiedades
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

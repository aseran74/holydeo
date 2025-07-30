import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Cómo puedo reservar una propiedad?",
      answer: "Es muy fácil. Simplemente busca tu destino, selecciona las fechas de entrada y salida, elige el número de huéspedes y completa el proceso de reserva con tus datos de pago."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las tarjetas de crédito y débito principales (Visa, MasterCard, American Express), PayPal y transferencias bancarias. Todos los pagos son procesados de forma segura."
    },
    {
      question: "¿Puedo cancelar mi reserva?",
      answer: "Sí, puedes cancelar tu reserva hasta 24 horas antes de la fecha de llegada. Las políticas de cancelación específicas varían según la propiedad. Consulta los términos de cada alojamiento."
    },
    {
      question: "¿Las propiedades están verificadas?",
      answer: "Todas nuestras propiedades pasan por un proceso de verificación riguroso. Incluye inspección de calidad, verificación de fotos y validación de comodidades para garantizar tu satisfacción."
    },
    {
      question: "¿Qué incluye el precio de la reserva?",
      answer: "El precio incluye el alojamiento completo, limpieza, toallas y sábanas. Algunas propiedades pueden incluir servicios adicionales como WiFi, parking o acceso a piscina. Consulta los detalles específicos de cada propiedad."
    },
    {
      question: "¿Puedo contactar al anfitrión?",
      answer: "Sí, puedes comunicarte directamente con el anfitrión a través de nuestro sistema de mensajería integrado. Los anfitriones suelen responder en menos de 24 horas."
    },
    {
      question: "¿Qué pasa si tengo un problema durante mi estancia?",
      answer: "Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier problema. Puedes contactarnos por teléfono, email o chat en vivo desde la aplicación."
    },
    {
      question: "¿Ofrecen seguro de viaje?",
      answer: "Sí, ofrecemos opciones de seguro de viaje que cubren cancelaciones, problemas médicos y daños a la propiedad. Puedes añadirlo durante el proceso de reserva."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Resolvemos todas tus dudas sobre reservas y alojamientos
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            ¿No encuentras la respuesta que buscas?
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Contactar Soporte
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 
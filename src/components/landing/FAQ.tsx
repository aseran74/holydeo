import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, CreditCard, Home, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ContactSection from './ContactSection';

const FAQ = () => {
  const { t } = useLanguage();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const faqCategories = [
    {
      id: 'reservas',
      title: 'Reservas',
      icon: Calendar,
      color: 'blue',
      questions: [
        {
          id: 'reservas-1',
          question: '¿Cómo se confirma una reserva de media estancia?',
          answer: 'La reserva se confirma cuando el inquilino completa la solicitud, pasa la verificación y realiza el pago de la reserva. Nosotros gestionamos todo el proceso.'
        },
        {
          id: 'reservas-2',
          question: '¿Puedo cancelar una reserva si el inquilino no es adecuado?',
          answer: 'Sí. Si tras la verificación detectamos algo que no encaja, consultamos contigo antes de confirmar la reserva.'
        },
        {
          id: 'reservas-3',
          question: '¿Cómo conseguís inquilinos para septiembre–junio?',
          answer: 'Disponemos de una amplia cartera de clientes: prejubilados extranjeros, nómadas digitales, profesionales desplazados y estudiantes de posgrado interesados en estancias medias cerca de la costa.'
        },
        {
          id: 'reservas-4',
          question: '¿Puedo ver el perfil del inquilino antes de aceptar la reserva?',
          answer: 'Sí, siempre tendrás acceso a la información relevante para decidir si aceptas o no.'
        },
        {
          id: 'reservas-5',
          question: '¿Cómo se gestionan las llegadas y salidas?',
          answer: 'Holydeo coordina la llegada, revisión del estado de la vivienda, entrega de llaves y todo el proceso de salida.'
        }
      ]
    },
    {
      id: 'pagos',
      title: 'Pagos',
      icon: CreditCard,
      color: 'green',
      questions: [
        {
          id: 'pagos-1',
          question: '¿Cuándo cobra el propietario cada mes?',
          answer: 'El propietario cobra siempre antes del día 10, incluso si el inquilino se retrasa.'
        },
        {
          id: 'pagos-2',
          question: '¿Qué pasa si el inquilino no paga?',
          answer: 'Nosotros cubrimos el impago: el propietario nunca deja de cobrar.'
        },
        {
          id: 'pagos-3',
          question: '¿Cuándo cobro mi comisión como agente?',
          answer: 'Recibirás tu comisión una vez el contrato esté firmado y el inquilino haya completado la entrada.'
        },
        {
          id: 'pagos-4',
          question: '¿Hay algún coste para publicar o gestionar una propiedad?',
          answer: 'No. Publicar y gestionar con Holydeo es gratuito para agentes y propietarios.'
        },
        {
          id: 'pagos-5',
          question: '¿Cómo funcionan las devoluciones de fianzas?',
          answer: 'Holydeo gestiona la fianza, revisa la vivienda al finalizar la estancia y procesa la devolución correspondiente.'
        }
      ]
    },
    {
      id: 'propiedades',
      title: 'Propiedades',
      icon: Home,
      color: 'orange',
      questions: [
        {
          id: 'propiedades-1',
          question: '¿Qué tipo de propiedades buscan los inquilinos de septiembre a junio?',
          answer: 'Apartamentos y casas en zonas de playa, especialmente las que suelen estar vacías en temporada baja.'
        },
        {
          id: 'propiedades-2',
          question: '¿Qué requisitos debe cumplir una vivienda para publicarse?',
          answer: 'Buena ubicación, fotos actualizadas, estado adecuado y disponibilidad de septiembre a junio.'
        },
        {
          id: 'propiedades-3',
          question: '¿Puedo subir propiedades de mis propios clientes?',
          answer: 'Sí. Puedes subir propiedades de tus clientes sin exclusividad y seguir siendo su agente.'
        },
        {
          id: 'propiedades-4',
          question: '¿Quién se encarga de incidencias y mantenimiento?',
          answer: 'Holydeo coordina reparaciones, avisos y cualquier gestión durante la estancia.'
        },
        {
          id: 'propiedades-5',
          question: '¿Puedo seguir gestionando la vivienda si lo prefiero?',
          answer: 'Sí. Puedes colaborar solo en visitas y captación, o delegar la gestión completa en Holydeo.'
        }
      ]
    },
    {
      id: 'soporte',
      title: 'Soporte 24h',
      icon: MessageCircle,
      color: 'yellow',
      questions: [
        {
          id: 'soporte-1',
          question: '¿Tenéis asistencia 24 horas?',
          answer: 'Sí, ofrecemos soporte operativo 24/7 para incidencias urgentes de inquilinos y propietarios.'
        },
        {
          id: 'soporte-2',
          question: '¿Cómo puedo contactar con el equipo de soporte?',
          answer: 'Desde tu área privada, por email o a través del canal prioritario para agentes.'
        },
        {
          id: 'soporte-3',
          question: '¿Puedo solicitar ayuda durante una visita?',
          answer: 'Sí, tienes asistencia inmediata para resolver cualquier duda o situación inesperada.'
        },
        {
          id: 'soporte-4',
          question: '¿Ofrecéis soporte técnico sobre la plataforma?',
          answer: 'Sí. Si tienes problemas con tu panel, carga de propiedades o gestión, nuestro equipo te ayuda al momento.'
        },
        {
          id: 'soporte-5',
          question: '¿El propietario también tiene acceso a soporte?',
          answer: 'Sí, tanto tu cliente como el inquilino cuentan con soporte 24h para incidencias relacionadas con su estancia.'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        hover: 'hover:bg-green-100 dark:hover:bg-green-900/30'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {faqCategories.map((category) => {
            const IconComponent = category.icon;
            const colorClasses = getColorClasses(category.color);
            const isCategoryOpen = openCategory === category.id;

            return (
              <div
                key={category.id}
                className={`border ${colorClasses.border} rounded-lg overflow-hidden transition-all duration-200`}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full px-6 py-5 text-left flex items-center justify-between ${colorClasses.bg} ${colorClasses.hover} transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${colorClasses.text.includes('blue') ? 'from-blue-500 to-blue-600' : colorClasses.text.includes('green') ? 'from-green-500 to-green-600' : colorClasses.text.includes('orange') ? 'from-orange-500 to-orange-600' : 'from-yellow-500 to-yellow-600'} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-110`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">
                      {category.title}
                    </span>
                  </div>
                  {isCategoryOpen ? (
                    <ChevronUp className="w-6 h-6 text-gray-500 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-500 transition-transform duration-200" />
                  )}
                </button>

                {/* Questions */}
                {isCategoryOpen && (
                  <div className="bg-white dark:bg-gray-800">
                    {category.questions.map((faq) => {
                      const isQuestionOpen = openQuestion === faq.id;
                      return (
                        <div
                          key={faq.id}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <button
                            onClick={() => toggleQuestion(faq.id)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <span className="font-semibold text-gray-900 dark:text-white pr-4">
                              {faq.question}
                            </span>
                            {isQuestionOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isQuestionOpen && (
                            <div className="px-6 pb-4">
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('faq.notFound')}
          </p>
        </div>
      </div>

      {/* Sección de Contacto integrada */}
      <div id="contact" className="mt-20">
        <ContactSection />
      </div>
    </section>
  );
};

export default FAQ;

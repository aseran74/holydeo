import { useMemo, useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Home,
  MessageCircle,
  Search,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ContactSection from './ContactSection';

type CategoryColor = 'blue' | 'green' | 'orange' | 'yellow';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqCategory = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: CategoryColor;
  questions: FaqItem[];
};

const FAQ = () => {
  const { t } = useLanguage();
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('reservas');
  const [query, setQuery] = useState('');

  const faqCategories: FaqCategory[] = [
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

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  const getCategoryTheme = (color: CategoryColor) => {
    const themes = {
      blue: {
        chipActive:
          'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20 dark:shadow-blue-400/10',
        chipInactive:
          'bg-white/60 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-blue-900/20 dark:hover:border-blue-800',
        icon:
          'from-blue-500 to-blue-600 shadow-blue-600/25 dark:shadow-blue-400/10',
        dot: 'bg-blue-600 dark:bg-blue-400'
      },
      green: {
        chipActive:
          'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/20 dark:shadow-green-400/10',
        chipInactive:
          'bg-white/60 text-gray-700 border-gray-200 hover:bg-green-50 hover:border-green-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-green-900/20 dark:hover:border-green-800',
        icon:
          'from-green-500 to-green-600 shadow-green-600/25 dark:shadow-green-400/10',
        dot: 'bg-green-600 dark:bg-green-400'
      },
      orange: {
        chipActive:
          'bg-orange-600 text-white border-orange-600 shadow-sm shadow-orange-600/20 dark:shadow-orange-400/10',
        chipInactive:
          'bg-white/60 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-orange-900/20 dark:hover:border-orange-800',
        icon:
          'from-orange-500 to-orange-600 shadow-orange-600/25 dark:shadow-orange-400/10',
        dot: 'bg-orange-600 dark:bg-orange-400'
      },
      yellow: {
        chipActive:
          'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/20 dark:shadow-amber-400/10',
        chipInactive:
          'bg-white/60 text-gray-700 border-gray-200 hover:bg-amber-50 hover:border-amber-200 dark:bg-gray-900/20 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-amber-900/20 dark:hover:border-amber-800',
        icon:
          'from-amber-500 to-amber-600 shadow-amber-600/25 dark:shadow-amber-400/10',
        dot: 'bg-amber-600 dark:bg-amber-400'
      }
    } as const;
    return themes[color];
  };

  const activeCategory = useMemo(() => {
    return faqCategories.find((c) => c.id === activeCategoryId) ?? faqCategories[0];
  }, [activeCategoryId, faqCategories]);

  const filteredQuestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeCategory.questions;
    return activeCategory.questions.filter((item) => {
      const haystack = `${item.question} ${item.answer}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, query]);

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-gray-900/30 border border-gray-200/70 dark:border-gray-700/70 text-gray-700 dark:text-gray-200 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
              {t('faq.title')}
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t('faq.title')}
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          {/* Tabs + Search */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {faqCategories.map((category) => {
                const IconComponent = category.icon;
                const theme = getCategoryTheme(category.color);
                const isActive = activeCategoryId === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategoryId(category.id);
                      setOpenQuestion(null);
                    }}
                    className={[
                      'shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 dark:focus-visible:ring-offset-gray-900',
                      isActive ? theme.chipActive : theme.chipInactive
                    ].join(' ')}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span
                      className={[
                        'w-8 h-8 rounded-full grid place-items-center bg-gradient-to-br',
                        isActive ? 'from-white/25 to-white/10' : theme.icon
                      ].join(' ')}
                    >
                      <IconComponent className={['w-4 h-4', isActive ? 'text-white' : 'text-white'].join(' ')} />
                    </span>
                    <span className="font-semibold whitespace-nowrap">{category.title}</span>
                    <span
                      className={[
                        'ml-1 text-xs font-semibold rounded-full px-2 py-0.5',
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                      ].join(' ')}
                    >
                      {category.questions.length}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpenQuestion(null);
                  }}
                  placeholder={t('faq.searchPlaceholder')}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/30 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {query.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={t('faq.clearSearch')}
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                  {t('faq.results', { count: filteredQuestions.length })}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/25 backdrop-blur">
                <div className="p-4 sm:p-6 border-b border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-3">
                    <span className={['w-2.5 h-2.5 rounded-full', getCategoryTheme(activeCategory.color).dot].join(' ')} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {activeCategory.title}
                    </h3>
                  </div>
                </div>

                {filteredQuestions.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      {t('faq.noResults')}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200/70 dark:divide-gray-700/70">
                    {filteredQuestions.map((faq) => {
                      const isOpen = openQuestion === faq.id;
                      const controlsId = `faq-answer-${faq.id}`;
                      return (
                        <div key={faq.id} className="group">
                          <button
                            type="button"
                            onClick={() => toggleQuestion(faq.id)}
                            className="w-full px-4 sm:px-6 py-5 text-left flex items-start gap-4 hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
                            aria-expanded={isOpen}
                            aria-controls={controlsId}
                          >
                            <div className="mt-1 w-1.5 h-10 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-green-500 transition-colors" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {faq.question}
                                </span>
                                <span className="mt-0.5">
                                  {isOpen ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                  )}
                                </span>
                              </div>
                            </div>
                          </button>

                          <div
                            id={controlsId}
                            className={[
                              'grid transition-[grid-template-rows] duration-300 ease-in-out px-4 sm:px-6',
                              isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
                            ].join(' ')}
                          >
                            <div className="overflow-hidden">
                              <p className="pl-5 text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/25 backdrop-blur p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('faq.helpTitle')}
                </h4>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {t('faq.helpSubtitle')}
                </p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 transition-colors"
                >
                  {t('faq.contactSupport')}
                </a>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {t('faq.helpNote')}
                </p>
              </div>
            </aside>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <p className="text-gray-600 dark:text-gray-300">
              {t('faq.notFound')}
            </p>
          </div>
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

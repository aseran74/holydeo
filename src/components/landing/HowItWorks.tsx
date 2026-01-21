import React from 'react';
import { motion } from 'framer-motion';
import { Search, PenSquare, PartyPopper, MapPin, CreditCard, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../ui/modal';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const HowItWorks = () => {
  const { t } = useLanguage();
  const { isOpen: isReservationModalOpen, openModal: openReservationModal, closeModal: closeReservationModal } = useModal(false);

  const steps: Step[] = [
    // 1-3: Lo que hacemos
    {
      icon: <Search size={36} />,
      title: t('howItWorks.steps.accommodations.title'),
      description: t('howItWorks.steps.accommodations.description'),
      color: 'text-blue-500',
      gradient: 'from-blue-100 to-blue-300 dark:from-blue-900/30 dark:to-blue-700/20'
    },
    {
      icon: <PenSquare size={36} />,
      title: t('howItWorks.steps.experiences.title'),
      description: t('howItWorks.steps.experiences.description'),
      color: 'text-green-500',
      gradient: 'from-green-100 to-green-300 dark:from-green-900/30 dark:to-green-700/20'
    },
    {
      icon: <PartyPopper size={36} />,
      title: t('howItWorks.steps.flexibility.title'),
      description: t('howItWorks.steps.flexibility.description'),
      color: 'text-purple-500',
      gradient: 'from-purple-100 to-purple-300 dark:from-purple-900/30 dark:to-purple-700/20'
    },
    // 4-6: Cómo funciona
    {
      icon: <MapPin size={36} />,
      title: t('howItWorks.steps.explore.title'),
      description: t('howItWorks.steps.explore.description'),
      color: 'text-pink-500',
      gradient: 'from-pink-100 to-pink-300 dark:from-pink-900/30 dark:to-pink-700/20'
    },
    {
      icon: <CreditCard size={36} />,
      title: t('howItWorks.steps.reserve.title'),
      description: t('howItWorks.steps.reserve.description'),
      color: 'text-orange-500',
      gradient: 'from-orange-100 to-orange-300 dark:from-orange-900/30 dark:to-orange-700/20'
    },
    {
      icon: <CheckCircle size={36} />,
      title: t('howItWorks.steps.enjoy.title'),
      description: t('howItWorks.steps.enjoy.description'),
      color: 'text-indigo-500',
      gradient: 'from-indigo-100 to-indigo-300 dark:from-indigo-900/30 dark:to-indigo-700/20'
    }
  ];
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
            className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl"
          >
            {t('howItWorks.subtitle')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            {t('howItWorks.description')}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={openReservationModal}
              aria-haspopup="dialog"
              aria-expanded={isReservationModalOpen}
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              <span className="absolute -right-1 -top-1 inline-flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-60"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
              </span>
              <Info className="w-4 h-4 transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110" />
              {t('howItWorks.reservationModal.cta')}
            </button>
          </div>
        </div>

        {/* Sección: Lo que hacemos */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {t('howItWorks.whatWeDo')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-x-8">
            {steps.slice(0, 3).map((step, index) => (
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
        </div>

        {/* Sección: Cómo funciona */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {t('howItWorks.howItWorks')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 sm:gap-y-16 md:gap-x-8">
            {steps.slice(3, 6).map((step, index) => (
              <motion.div
                key={index + 3}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative p-6 sm:p-8 bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl"
              >
                {/* Número */}
                <div className="absolute -top-6 left-4 md:-left-6 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {index + 4}
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
        </div>

        {/* CTA final */}
        <div className="mt-16 text-center">
          <a
            href="#search"
            className="inline-block px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            {t('howItWorks.cta')}
          </a>
        </div>
      </div>

      <Modal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
        className="mx-4 max-w-3xl"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-3 pr-10">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('howItWorks.reservationModal.title')}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {t('howItWorks.reservationModal.intro')}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/60">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('howItWorks.reservationModal.short.title')}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {t('howItWorks.reservationModal.short.body')}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/60">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('howItWorks.reservationModal.monthly.title')}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {t('howItWorks.reservationModal.monthly.body')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={closeReservationModal}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default HowItWorks; 
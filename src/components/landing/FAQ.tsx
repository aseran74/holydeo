import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: t('faq.questions.howToBook.question'),
      answer: t('faq.questions.howToBook.answer')
    },
    {
      question: t('faq.questions.paymentMethods.question'),
      answer: t('faq.questions.paymentMethods.answer')
    },
    {
      question: t('faq.questions.cancelBooking.question'),
      answer: t('faq.questions.cancelBooking.answer')
    },
    {
      question: t('faq.questions.verifiedProperties.question'),
      answer: t('faq.questions.verifiedProperties.answer')
    },
    {
      question: t('faq.questions.priceIncludes.question'),
      answer: t('faq.questions.priceIncludes.answer')
    },
    {
      question: t('faq.questions.contactHost.question'),
      answer: t('faq.questions.contactHost.answer')
    },
    {
      question: t('faq.questions.problemDuringStay.question'),
      answer: t('faq.questions.problemDuringStay.answer')
    },
    {
      question: t('faq.questions.travelInsurance.question'),
      answer: t('faq.questions.travelInsurance.answer')
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
            {t('faq.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('faq.subtitle')}
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
            {t('faq.notFound')}
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            {t('faq.contactSupport')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 
import { useLanguage } from "../../context/LanguageContext";

export const LanguageToggleButton: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {language === 'es' ? (
        // Bandera de España
        <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-300">
          <div className="w-full h-full bg-gradient-to-b from-red-600 via-yellow-400 to-red-600">
            <div className="w-full h-1 bg-red-600"></div>
            <div className="w-full h-1 bg-yellow-400"></div>
            <div className="w-full h-1 bg-yellow-400"></div>
            <div className="w-full h-1 bg-red-600"></div>
          </div>
        </div>
      ) : (
        // Bandera de Inglaterra (Cruz de San Jorge)
        <div className="w-6 h-4 rounded-sm overflow-hidden border border-gray-300">
          <div className="w-full h-full bg-white relative">
            {/* Cruz roja horizontal */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-600 transform -translate-y-1/2"></div>
            {/* Cruz roja vertical */}
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-red-600 transform -translate-x-1/2"></div>
          </div>
        </div>
      )}
    </button>
  );
};


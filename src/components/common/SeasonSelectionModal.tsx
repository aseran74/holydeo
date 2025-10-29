import React from 'react';
import { X, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SeasonSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  seasons: Array<{ value: string; label: string }>;
  selectedSeasons: string[];
  onSeasonToggle: (season: string) => void;
  onApply: () => void;
  onClear: () => void;
}

const SeasonSelectionModal: React.FC<SeasonSelectionModalProps> = ({
  isOpen,
  onClose,
  seasons,
  selectedSeasons,
  onSeasonToggle,
  onApply,
  onClear
}) => {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('filters.season')}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('filters.seasonDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-3">
              {seasons.map(season => (
                <label 
                  key={season.value} 
                  className="flex items-center space-x-4 cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedSeasons.includes(season.value)}
                    onChange={() => onSeasonToggle(season.value)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <span className="text-lg font-medium text-gray-900">
                      {season.label}
                    </span>
                  </div>
                  {selectedSeasons.includes(season.value) && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>

            {/* Selected count */}
            {selectedSeasons.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  {selectedSeasons.length} {selectedSeasons.length === 1 ? t('filters.season') : t('filters.season')} {t('common.selected')}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              {t('common.clear')}
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={onApply}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.apply')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonSelectionModal;

import React from 'react';
import { X } from 'lucide-react';
import EnhancedSearchFilters from './EnhancedSearchFilters';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchData: any;
  setSearchData: (data: any) => void;
  searchType: string;
  experienceTypes: string[];
  seasons?: Array<{ value: string; label: string }>;
  amenities: Array<{ id: string; name: string; icon: any }>;
  handleAmenityToggle: (amenity: string) => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  searchData,
  setSearchData,
  searchType,
  experienceTypes,
  seasons,
  amenities,
  handleAmenityToggle
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] md:hidden"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-end md:hidden">
        <div className="bg-white w-full max-h-[90vh] rounded-t-2xl shadow-xl overflow-hidden flex flex-col animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <EnhancedSearchFilters
              searchData={searchData}
              setSearchData={setSearchData}
              searchType={searchType}
              showFilters={true}
              setShowFilters={() => {}}
              experienceTypes={experienceTypes}
              seasons={seasons}
              amenities={amenities}
              handleAmenityToggle={handleAmenityToggle}
              isModal={true}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default FiltersModal;


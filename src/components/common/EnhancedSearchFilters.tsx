import React, { useState, useEffect } from 'react';
import { Filter, Calendar, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import NumberStepper from './NumberStepper';
import PriceFilter from './PriceFilter';
import SeasonSelectionModal from './SeasonSelectionModal';
import { supabase } from '../../supabaseClient';

interface EnhancedSearchFiltersProps {
  searchData: any;
  setSearchData: (data: any) => void;
  searchType: string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  experienceTypes: string[];
  seasons?: Array<{ value: string; label: string }>;
  amenities: Array<{ id: string; name: string; icon: any }>;
  handleAmenityToggle: (amenity: string) => void;
  isModal?: boolean;
}

const EnhancedSearchFilters: React.FC<EnhancedSearchFiltersProps> = ({
  searchData,
  setSearchData,
  searchType,
  showFilters,
  setShowFilters,
  experienceTypes,
  seasons,
  amenities,
  handleAmenityToggle,
  isModal = false
}) => {
  const { t } = useLanguage();
  const [dynamicPropertyTypes, setDynamicPropertyTypes] = useState<string[]>([]);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [tempSelectedSeasons, setTempSelectedSeasons] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: tiposData, error: tiposError } = await supabase
          .from('properties')
          .select('tipo')
          .not('tipo', 'is', null)
          .neq('tipo', '');
        if (tiposError) { console.error('Error cargando tipos:', tiposError); }
        else { setDynamicPropertyTypes([...new Set(tiposData?.map(item => item.tipo) || [])]); }
      } catch (error) { console.error('Error cargando datos:', error); }
    };
    loadData();
  }, []);

  // Funciones para manejar el modal de temporadas
  const handleOpenSeasonModal = () => {
    setTempSelectedSeasons(searchData.seasons || []);
    setShowSeasonModal(true);
  };

  const handleSeasonToggle = (season: string) => {
    setTempSelectedSeasons(prev => 
      prev.includes(season) 
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  };

  const handleApplySeasons = () => {
    setSearchData((prev: any) => ({
      ...prev,
      seasons: tempSelectedSeasons
    }));
    setShowSeasonModal(false);
  };

  const handleClearSeasons = () => {
    setTempSelectedSeasons([]);
  };

  const getSelectedSeasonsText = () => {
    if (!searchData.seasons || searchData.seasons.length === 0) {
      return 'Seleccionar temporadas';
    }
    if (searchData.seasons.length === 1) {
      const season = seasons?.find(s => s.value === searchData.seasons[0]);
      return season?.label || '1 temporada';
    }
    return `${searchData.seasons.length} temporadas`;
  };

  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {!isModal && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <Filter className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className={`${showFilters || isModal ? 'block' : 'hidden'} lg:block`}>
          <div className="space-y-6">
            {/* Filtros de Precio */}
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('filters.pricePerDay')}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {t('filters.pricePerDayDescription')}
                  </p>
                <PriceFilter
                  label=""
                  value={searchData.pricePerDay}
                  onChange={(value) => setSearchData((prev: any) => ({ ...prev, pricePerDay: value }))}
                  min={0}
                  max={500}
                  step={25}
                />
              </div>
              
              {/* Filtro de precio por mes solo para propiedades */}
              {searchType === 'properties' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('filters.pricePerMonth')}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {t('filters.pricePerMonthDescription')}
                  </p>
                  <PriceFilter
                    label=""
                    value={searchData.pricePerMonth}
                    onChange={(value) => setSearchData((prev: any) => ({ ...prev, pricePerMonth: value }))}
                    min={0}
                    max={5000}
                    step={100}
                  />
                </div>
              )}
            </div>

            {/* Filtro de temporada solo para propiedades */}
            {searchType === 'properties' && seasons && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filters.season')}
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  {t('filters.seasonDescription')}
                </p>
                
                {/* Botón para abrir modal (móvil y desktop) */}
                <button
                  onClick={handleOpenSeasonModal}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 bg-white"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-medium text-gray-700">
                      {getSelectedSeasonsText()}
                    </span>
                    {searchData.seasons && searchData.seasons.length > 0 && (
                      <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        {searchData.seasons.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}

            {/* Filtros específicos según el tipo */}
            {searchType === 'properties' ? (
              <>
                {/* Tipo de propiedad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('filters.propertyType')}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {t('filters.propertyTypeDescription')}
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {dynamicPropertyTypes.map(type => {
                      // Convertir propertyType a array si es string (compatibilidad)
                      const propertyTypes = Array.isArray(searchData.propertyType) 
                        ? searchData.propertyType 
                        : searchData.propertyType 
                          ? [searchData.propertyType] 
                          : [];
                      const isChecked = propertyTypes.includes(type);
                      
                      return (
                        <label 
                          key={type} 
                          className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const currentTypes = Array.isArray(searchData.propertyType) 
                                ? searchData.propertyType 
                                : searchData.propertyType 
                                  ? [searchData.propertyType] 
                                  : [];
                              
                              if (e.target.checked) {
                                setSearchData((prev: any) => ({
                                  ...prev,
                                  propertyType: [...currentTypes, type]
                                }));
                              } else {
                                setSearchData((prev: any) => ({
                                  ...prev,
                                  propertyType: currentTypes.filter((t: string) => t !== type)
                                }));
                              }
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700 flex-1">
                            {type}
                          </span>
                          {isChecked && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Habitaciones y Baños lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                  <NumberStepper
                    value={searchData.bedrooms}
                    onChange={(value) => setSearchData((prev: any) => ({ ...prev, bedrooms: value }))}
                    min={0}
                    max={6}
                    label={t('filters.minBedrooms')}
                    className="w-full"
                  />

                  <NumberStepper
                    value={searchData.bathrooms}
                    onChange={(value) => setSearchData((prev: any) => ({ ...prev, bathrooms: value }))}
                    min={0}
                    max={5}
                    label={t('filters.minBathrooms')}
                    className="w-full"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filters.amenities')}
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {amenities.map(amenity => {
                      const IconComponent = amenity.icon;
                      return (
                        <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={searchData.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <IconComponent className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 flex items-center">
                            {amenity.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Tipo de experiencia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de experiencia
                  </label>
                  <select
                    value={searchData.experienceType}
                    onChange={(e) => setSearchData((prev: any) => ({ ...prev, experienceType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todos los tipos</option>
                    {experienceTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duración */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (horas)
                  </label>
                  <select
                    value={searchData.duration}
                    onChange={(e) => setSearchData((prev: any) => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Cualquier duración</option>
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                      <option key={num} value={num.toString()}>
                        {num} {num === 1 ? 'hora' : 'horas'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Participantes máximos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participantes máximos
                  </label>
                  <select
                    value={searchData.maxParticipants}
                    onChange={(e) => setSearchData((prev: any) => ({ ...prev, maxParticipants: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Cualquier número</option>
                    {[1, 2, 4, 6, 8, 10, 15, 20].map(num => (
                      <option key={num} value={num.toString()}>
                        Hasta {num} {num === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de selección de temporadas */}
      <SeasonSelectionModal
        isOpen={showSeasonModal}
        onClose={() => setShowSeasonModal(false)}
        seasons={seasons || []}
        selectedSeasons={tempSelectedSeasons}
        onSeasonToggle={handleSeasonToggle}
        onApply={handleApplySeasons}
        onClear={handleClearSeasons}
      />
    </div>
  );
};

export default EnhancedSearchFilters;

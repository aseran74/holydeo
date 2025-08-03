import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import NumberStepper from './NumberStepper';
import PriceFilter from './PriceFilter';
import { supabase } from '../../supabaseClient';

interface EnhancedSearchFiltersProps {
  searchData: any;
  setSearchData: (data: any) => void;
  searchType: string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  seasons: string[];
  experienceTypes: string[];
  amenities: Array<{ id: string; name: string; icon: any }>;
  handleAmenityToggle: (amenity: string) => void;
}

const EnhancedSearchFilters: React.FC<EnhancedSearchFiltersProps> = ({
  searchData,
  setSearchData,
  searchType,
  showFilters,
  setShowFilters,
  seasons,
  experienceTypes,
  amenities,
  handleAmenityToggle
}) => {
  const [dynamicPropertyTypes, setDynamicPropertyTypes] = useState<string[]>([]);

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
  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="space-y-6">
                         {/* Filtros de Precio */}
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Precio máximo por día
                 </label>
                 <p className="text-xs text-gray-500 mb-2">
                   Elige el precio día que pagarías por medias estancias (15 días mínimo, 60 días máximo)
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
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Precio máximo por mes
                 </label>
                 <p className="text-xs text-gray-500 mb-2">
                   Marca para elegir el precio mes por toda la temporada
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
             </div>

                         {/* Temporada */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Temporada
               </label>
               <p className="text-xs text-gray-500 mb-2">
                 Marca si quieres toda una temporada
               </p>
               <select
                 value={searchData.season}
                 onChange={(e) => setSearchData((prev: any) => ({ ...prev, season: e.target.value }))}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
               >
                 <option value="">Todas las temporadas</option>
                 {seasons.map(season => (
                   <option key={season} value={season}>
                     {season}
                   </option>
                 ))}
               </select>
             </div>

            {/* Filtros específicos según el tipo */}
            {searchType === 'properties' ? (
              <>
                                 {/* Tipo de propiedad */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Tipo de vivienda
                   </label>
                   <p className="text-xs text-gray-500 mb-2">
                     Marca para elegir el tipo de vivienda
                   </p>
                   <select
                     value={searchData.propertyType}
                     onChange={(e) => setSearchData((prev: any) => ({ ...prev, propertyType: e.target.value }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                   >
                     <option value="">Todos los tipos</option>
                     {dynamicPropertyTypes.map(type => (
                       <option key={type} value={type}>
                         {type}
                       </option>
                     ))}
                   </select>
                 </div>

                {/* Habitaciones y Baños lado a lado */}
                <div className="grid grid-cols-2 gap-4">
                                     <NumberStepper
                     value={searchData.bedrooms}
                     onChange={(value) => setSearchData((prev: any) => ({ ...prev, bedrooms: value }))}
                     min={0}
                     max={6}
                     label="Nº Dormitorios mínimo"
                     className="w-full"
                   />

                   <NumberStepper
                     value={searchData.bathrooms}
                     onChange={(value) => setSearchData((prev: any) => ({ ...prev, bathrooms: value }))}
                     min={0}
                     max={5}
                     label="Nº Baños mínimo"
                     className="w-full"
                   />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Comodidades
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
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
                          <IconComponent className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-700 flex items-center">
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
    </div>
  );
};

export default EnhancedSearchFilters; 
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LocationInput from "../LocationInput";
import StayDatesRangeInput from "./StayDatesRangeInput";
import SeasonInput from "./SeasonInput";
import TabFilters from "@/app/(stay-listings)/TabFilters";

// 1. (Recomendado) Interfaz para definir la forma de todo el estado del formulario.
// Esto nos da seguridad de tipos y autocompletado.
interface FormData {
  location: string;
  dates: { 
    startDate: Date | null;
    endDate: Date | null;
  };
  seasons: string[];
}

// Ya no es necesario FC<{}>. Una función simple es más directa.
const StaySearchForm = () => {
  // 2. ESTADO CENTRALIZADO: Un único `useState` para gobernar todo el formulario.
  const [formData, setFormData] = useState<FormData>({
    location: "",
    dates: { startDate: null, endDate: null },
    seasons: [],
  });

  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  // 3. MANEJADORES DE ESTADO: Funciones para actualizar cada parte del formulario.
  const handleLocationChange = (value: string) => {
    setFormData((prev) => ({ ...prev, location: value }));
  };

  const handleDatesChange = (value: { startDate: Date | null, endDate: Date | null }) => {
    setFormData((prev) => ({ ...prev, dates: value }));
  };
  
  const handleSeasonsChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, seasons: value }));
  };

  // 4. LÓGICA DE ENVÍO COMPLETA: Ahora envía todos los datos del formulario.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    // Construimos los parámetros desde nuestro estado centralizado
    if (formData.location) {
      params.append("location", formData.location);
    }
    if (formData.dates.startDate && formData.dates.endDate) {
      // Es una buena práctica formatear las fechas a un estándar como ISO (YYYY-MM-DD)
      params.append("startDate", formData.dates.startDate.toISOString().split('T')[0]);
      params.append("endDate", formData.dates.endDate.toISOString().split('T')[0]);
    }
    if (formData.seasons.length > 0) {
      params.append("seasons", formData.seasons.join(","));
    }

    // Navegamos con todos los filtros aplicados
    router.push(`/listing-stay?${params.toString()}`);
  };

    return (
      <>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-5xl mx-auto mt-8 flex rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 font-poppins text-20px"
        >
          {/* 5. DISEÑO Y PROPORCIONES MEJORADAS */}
          {/* LocationInput tiene más peso visual porque suele contener más información */}
          <LocationInput
            value={formData.location}
            onChange={handleLocationChange}
            className="flex-[1.75]"
          />
          
            <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>
          
          {/* DatesRangeInput y SeasonInput comparten el espacio restante */}
          <StayDatesRangeInput
            // value={formData.dates}
            // onChange={handleDatesChange}
            className="flex-1"
          />
          
            <div className="self-center border-r border-slate-200 dark:border-slate-700 h-8"></div>

          {/* CAMBIO CLAVE: Agrupamos el último campo y el botón */}
          <div className="flex flex-[1.5] items-center justify-between pl-4">
            <SeasonInput
              selectedSeasons={formData.seasons}
              onChange={handleSeasonsChange}
              className="flex-1"
            />
            <div className="pr-2 py-2">
            <button
                type="submit"
                className="h-12 w-12 lg:h-14 lg:w-auto lg:px-6 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 hidden lg:inline">Buscar</span>
            </button>
            </div>
          </div>
          </form>
          {/* Botón Más filtros debajo del formulario */}
          <div className="w-full max-w-5xl mx-auto flex justify-end mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
              onClick={() => setShowFilters(true)}
            >
              Más filtros
            </button>
          </div>
          {/* Modal de filtros avanzados */}
          {showFilters && <TabFilters isOpenMoreFilter={showFilters} setIsOpenMoreFilter={setShowFilters} />}
        </>
    );
};

export default StaySearchForm;

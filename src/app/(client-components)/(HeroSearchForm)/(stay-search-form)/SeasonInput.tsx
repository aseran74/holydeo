import React, { useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface SeasonInputProps {
  selectedSeasons: string[];
  onChange: (seasons: string[]) => void;
  className?: string;
}

const SEASON_OPTIONS = [
  "Sep a Julio",
  "Sep a Junio",
  "Sep a Mayo",
  "Oct a Julio",
  "Oct a Junio",
  "Oct a Mayo",
];

const SeasonInput = ({ selectedSeasons, onChange, className = "" }: SeasonInputProps) => {
  const [showModal, setShowModal] = useState(false);
  const [tempSeasons, setTempSeasons] = useState<string[]>(selectedSeasons);

  const handleSeasonChange = (season: string) => {
    setTempSeasons((prev) =>
      prev.includes(season)
        ? prev.filter((s) => s !== season)
        : [...prev, season]
    );
  };

  const handleOpen = () => {
    setTempSeasons(selectedSeasons);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleApply = () => {
    onChange(tempSeasons);
    setShowModal(false);
  };

  return (
    <div className={`relative flex ${className} font-poppins text-20px`}>
      <div
        className="flex w-full items-center gap-3 cursor-pointer text-left h-full"
        onClick={handleOpen}
        role="button"
      >
        <CalendarIcon className="h-7 w-7 text-neutral-400" />
        <div className="flex-grow">
          <span className="block font-semibold text-neutral-800 dark:text-neutral-100 text-base">
            ¿Temporada?
          </span>
          <span className="block text-sm text-neutral-500 dark:text-neutral-400 font-light truncate">
            {selectedSeasons.length > 0 ? selectedSeasons.join(", ") : "¿For the full season?"}
          </span>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={handleClose}>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Selecciona temporadas</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {SEASON_OPTIONS.map((season) => (
                <label key={season} className="flex items-center gap-2.5 p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer text-sm text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={tempSeasons.includes(season)}
                    onChange={() => handleSeasonChange(season)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  {season}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-sm font-medium"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
                onClick={handleApply}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonInput; 
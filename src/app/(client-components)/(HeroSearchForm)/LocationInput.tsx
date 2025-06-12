"use client";

import React, { useState, useRef, useEffect, FC } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

// Las props para un componente controlado
export interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const LocationInput: FC<LocationInputProps> = ({ value, onChange, className = "" }) => {
  const [showPopover, setShowPopover] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lógica para cerrar el popover (es correcta, la mantenemos)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (item: string) => {
    onChange(item);
    setShowPopover(false);
  };

  return (
    <div className={`relative flex ${className} font-poppins text-20px`} ref={containerRef}>
      <div
        onClick={() => setShowPopover(true)}
        className="flex flex-1 items-center gap-3 cursor-pointer p-4 text-left h-full"
        role="button"
      >
        <MapPinIcon className="h-7 w-7 text-neutral-400" />
        {/* DISEÑO AJUSTADO: Título y placeholder/valor como en la imagen */}
        <div className="flex-grow">
          <span className="block font-semibold text-neutral-800 dark:text-neutral-100 text-base">
            ¿Dónde vas?
          </span>
          <input
            className="w-full bg-transparent border-none p-0 focus:ring-0 text-neutral-500 dark:text-neutral-400 font-light truncate text-[14px]"
            placeholder="Where are you going?"
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
          />
        </div>
      </div>

      {showPopover && (
        <div className="absolute left-0 z-40 w-full min-w-[300px] sm:min-w-[400px] bg-white dark:bg-neutral-800 top-full mt-2 rounded-2xl shadow-xl overflow-hidden py-2">
          {/* Aquí iría la lógica para mostrar sugerencias */}
          {["Hamptons, NY", "Las Vegas, NV", "Ueno, Tokyo"].map((item) => (
             <span key={item} onClick={() => handleSelectLocation(item)} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
               <MapPinIcon className="h-5 w-5 text-neutral-400" />
               <span className="block font-medium text-neutral-700 dark:text-neutral-200">{item}</span>
             </span>
           ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;

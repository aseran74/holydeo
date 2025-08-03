import React, { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";

interface TailGridsDateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const TailGridsDateRangePicker: React.FC<TailGridsDateRangePickerProps> = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  placeholder = "Seleccionar fechas",
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(checkIn || null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(checkOut || null);
  const [isOpen, setIsOpen] = useState(false);
  const datepickerRef = useRef<HTMLDivElement>(null);

  // Actualizar fechas cuando cambien las props
  useEffect(() => {
    setSelectedStartDate(checkIn || null);
    setSelectedEndDate(checkOut || null);
  }, [checkIn, checkOut]);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="w-[46px] h-[46px]"></div>);
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      const dayString = day.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const today = new Date();
      const isToday = day.toDateString() === today.toDateString();
      const isPast = day < new Date(today.setHours(0, 0, 0, 0));

      let className = "flex items-center justify-center cursor-pointer w-[46px] h-[46px] rounded-full text-gray-700 hover:bg-blue-500 hover:text-white transition-colors";

      // Fecha seleccionada como inicio
      if (selectedStartDate && dayString === selectedStartDate) {
        className = "flex items-center justify-center cursor-pointer w-[46px] h-[46px] bg-blue-500 text-white rounded-r-none";
      }
      
      // Fecha seleccionada como fin
      if (selectedEndDate && dayString === selectedEndDate) {
        className = "flex items-center justify-center cursor-pointer w-[46px] h-[46px] bg-blue-500 text-white rounded-l-none";
      }
      
      // Rango seleccionado
      if (selectedStartDate && selectedEndDate && 
          new Date(day) > new Date(selectedStartDate) && 
          new Date(day) < new Date(selectedEndDate)) {
        className = "flex items-center justify-center cursor-pointer w-[46px] h-[46px] bg-blue-100 text-blue-700 rounded-none";
      }

      // Días pasados
      if (isPast) {
        className += " text-gray-400 cursor-not-allowed hover:bg-transparent hover:text-gray-400";
      }

      // Hoy
      if (isToday) {
        className += " ring-2 ring-blue-300";
      }

      daysArray.push(
        <div
          key={i}
          className={className}
          data-date={dayString}
          onClick={() => !isPast && handleDayClick(day)}
        >
          {i}
        </div>
      );
    }

    return daysArray;
  };

  const handleDayClick = (selectedDay: Date) => {
    const dayString = selectedDay.toISOString().split('T')[0];

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Primera selección o nueva selección
      setSelectedStartDate(dayString);
      setSelectedEndDate(null);
    } else {
      // Segunda selección
      if (new Date(dayString) < new Date(selectedStartDate)) {
        // Si la segunda fecha es anterior, intercambiar
        setSelectedStartDate(dayString);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(dayString);
      }
    }
  };

  const updateInput = () => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate);
      const end = new Date(selectedEndDate);
      return `${start.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`;
    } else if (selectedStartDate) {
      const start = new Date(selectedStartDate);
      return `${start.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })} - Seleccionar salida`;
    }
    return "";
  };

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    if (selectedStartDate) {
      onCheckInChange(selectedStartDate);
    }
    if (selectedEndDate) {
      onCheckOutChange(selectedEndDate);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedStartDate(checkIn || null);
    setSelectedEndDate(checkOut || null);
    setIsOpen(false);
  };

  const clearDates = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onCheckInChange("");
    onCheckOutChange("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={datepickerRef}>
      <div className="relative flex items-center">
        <span className="absolute left-0 pl-5 text-gray-400">
          <Calendar className="w-5 h-5" />
        </span>

        <input
          type="text"
          placeholder={placeholder}
          className={`w-full rounded-lg border border-gray-200 bg-gray-100 py-3 pl-[50px] pr-12 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white hover:bg-gray-200 dark:border-gray-600 dark:text-white dark:focus:border-blue-500`}
          value={updateInput()}
          onClick={toggleDatepicker}
          readOnly
        />

        {(selectedStartDate || selectedEndDate) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearDates();
            }}
            className="absolute right-8 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <span
          className="absolute right-0 cursor-pointer pr-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={toggleDatepicker}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <button
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() =>
                  setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-lg font-medium text-gray-800 dark:text-white">
                {currentDate.toLocaleString("es-ES", {
                  month: "long",
                  year: "numeric"
                })}
              </div>

              <button
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() =>
                  setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
                }
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-7 gap-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5">
              {renderCalendar()}
            </div>

            <div className="mt-5 flex justify-end space-x-2.5 border-t border-gray-200 pt-5 dark:border-gray-600">
              <button
                className="rounded-lg border border-blue-500 px-5 py-2.5 text-base font-medium text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className="rounded-lg bg-blue-500 px-5 py-2.5 text-base font-medium text-white hover:bg-blue-600"
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

export default TailGridsDateRangePicker; 
import React, { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";

interface FullCalendarDatePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const FullCalendarDatePicker: React.FC<FullCalendarDatePickerProps> = ({
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
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const datepickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedStartDate(checkIn || null);
    setSelectedEndDate(checkOut || null);
  }, [checkIn, checkOut]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDisplayDate = () => {
    if (selectedStartDate && selectedEndDate) {
      const start = new Date(selectedStartDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      const end = new Date(selectedEndDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      return `${start} - ${end}`;
    } else if (selectedStartDate) {
      const start = new Date(selectedStartDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      return `${start} - Seleccionar salida`;
    }
    return placeholder;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const dateStr = date.toISOString().split('T')[0];
    return dateStr >= selectedStartDate && dateStr <= selectedEndDate;
  };

  const isDateHovered = (date: Date) => {
    if (!selectedStartDate || !hoverDate || selectedEndDate) return false;
    const dateStr = date.toISOString().split('T')[0];
    return dateStr > selectedStartDate && date <= hoverDate;
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    const dateString = date.toISOString().split('T')[0];

    if (!selectedStartDate || selectedEndDate) {
      // Iniciar nueva selección
      setSelectedStartDate(dateString);
      setSelectedEndDate(null);
      onCheckInChange(dateString);
      onCheckOutChange('');
    } else {
      // Completar selección
      if (dateString > selectedStartDate) {
        setSelectedEndDate(dateString);
        onCheckOutChange(dateString);
      } else {
        // Si selecciona una fecha anterior, reiniciar
        setSelectedStartDate(dateString);
        setSelectedEndDate(null);
        onCheckInChange(dateString);
        onCheckOutChange('');
      }
    }
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

  const toggleDatepicker = () => {
    setIsOpen(!isOpen);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    // Días vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-[46px] h-[46px]"></div>);
    }

    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const isPast = date < today;
      const isSelected = dateString === selectedStartDate || dateString === selectedEndDate;
      const isInRange = isDateInRange(date);
      const isHovered = isDateHovered(date);
      const isDisabled = isPast;

      let className = "w-[46px] h-[46px] flex items-center justify-center rounded-full text-sm font-medium transition-colors";

      if (isSelected) {
        className += " bg-blue-500 text-white";
      } else if (isInRange) {
        className += " bg-blue-100 text-blue-700";
      } else if (isHovered) {
        className += " bg-blue-50 text-blue-600";
      } else if (isDisabled) {
        className += " text-gray-300 cursor-not-allowed";
      } else {
        className += " text-gray-700 cursor-pointer hover:bg-blue-500 hover:text-white";
      }

      days.push(
        <div
          key={i}
          onMouseEnter={() => !isDisabled && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          onClick={() => !isDisabled && handleDateClick(date)}
          className={className}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className={`relative ${className}`} ref={datepickerRef} style={{ zIndex: 99999 }}>
      <div
        ref={inputRef}
        onClick={toggleDatepicker}
        className="w-full rounded-lg border border-gray-200 bg-gray-100 py-3 pl-[50px] pr-12 text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white hover:bg-gray-200 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center">
          <Calendar className="absolute left-5 text-gray-400 w-5 h-5" />
          <span className={selectedStartDate || selectedEndDate ? 'text-gray-800' : 'text-gray-500'}>
            {formatDisplayDate()}
          </span>
        </div>
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
        <ChevronDown className={`absolute right-4 text-gray-400 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-[99998]"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute left-0 right-0 top-full z-[99999] mt-2 rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-600 dark:bg-gray-800"
            style={{
              maxHeight: 'calc(100vh - 20px)',
              overflowY: 'auto'
            }}
          >
          <div className="p-6">
            {/* Cabecera del calendario */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="w-[46px] h-10 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>
          </div>

          {/* Botones - Fuera del scroll, siempre visibles */}
          <div className="px-6 pb-6 flex justify-end space-x-3 border-t border-gray-200 pt-5 dark:border-gray-600 bg-white dark:bg-gray-800">
            <button
              onClick={handleCancel}
              className="rounded-lg border-2 border-blue-500 px-6 py-3 text-base font-semibold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-blue-500 px-6 py-3 text-base font-semibold text-white hover:bg-blue-600 shadow-md"
            >
              Aplicar
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default FullCalendarDatePicker;

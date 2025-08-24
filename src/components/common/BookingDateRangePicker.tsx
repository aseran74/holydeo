import React, { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

interface BookingDateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onDatesChange: (start: Date | null, end: Date | null) => void;
  blockedDates?: string[];
  className?: string;
}

const BookingDateRangePicker: React.FC<BookingDateRangePickerProps> = ({
  startDate,
  endDate,
  onDatesChange,
  blockedDates = [],
  className = ""
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(startDate || null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(endDate || null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const datepickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedStartDate(startDate || null);
    setSelectedEndDate(endDate || null);
  }, [startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isDateBlocked = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return blockedDates.includes(dateString);
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateHovered = (date: Date) => {
    if (!selectedStartDate || !hoverDate || selectedEndDate) return false;
    return date > selectedStartDate && date <= hoverDate;
  };

  const handleDateClick = (date: Date) => {
    // No permitir seleccionar fechas bloqueadas
    if (isDateBlocked(date)) return;
    
    // No permitir fechas pasadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    if (!selectedStartDate || selectedEndDate) {
      // Iniciar nueva selección
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      onDatesChange(date, null);
    } else {
      // Completar selección
      if (date > selectedStartDate) {
        // Verificar que no haya fechas bloqueadas en el rango
        let hasBlockedDates = false;
        const tempDate = new Date(selectedStartDate);
        while (tempDate <= date) {
          if (isDateBlocked(tempDate)) {
            hasBlockedDates = true;
            break;
          }
          tempDate.setDate(tempDate.getDate() + 1);
        }

        if (!hasBlockedDates) {
          setSelectedEndDate(date);
          onDatesChange(selectedStartDate, date);
        } else {
          // Mostrar alerta o mensaje de error
          alert('El rango seleccionado contiene fechas no disponibles');
          setSelectedStartDate(date);
          setSelectedEndDate(null);
          onDatesChange(date, null);
        }
      } else {
        // Si selecciona una fecha anterior, reiniciar
        setSelectedStartDate(date);
        setSelectedEndDate(null);
        onDatesChange(date, null);
      }
    }
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
      const isBlocked = isDateBlocked(date);
      const isPast = date < today;
      const isSelected = selectedStartDate?.toDateString() === date.toDateString() || 
                        selectedEndDate?.toDateString() === date.toDateString();
      const isInRange = isDateInRange(date);
      const isHovered = isDateHovered(date);
      const isDisabled = isPast || isBlocked;

      days.push(
        <div
          key={i}
          onMouseEnter={() => !isDisabled && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          onClick={() => !isDisabled && handleDateClick(date)}
          className={`
            w-[46px] h-[46px] flex items-center justify-center rounded-lg text-sm font-medium relative
            ${isDisabled 
              ? 'cursor-not-allowed' 
              : 'cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20'
            }
            ${isPast ? 'text-gray-300 dark:text-gray-600' : ''}
            ${isBlocked ? 'bg-red-50 text-red-300 dark:bg-red-900/20 dark:text-red-400' : ''}
            ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
            ${isInRange && !isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
            ${isHovered ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
            ${!isDisabled && !isSelected && !isInRange && !isHovered ? 'text-gray-700 dark:text-gray-300' : ''}
          `}
        >
          {i}
          {isBlocked && (
            <div className="absolute -top-1 -right-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          )}
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
    <div className={`relative ${className}`} ref={datepickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer flex items-center justify-between hover:border-blue-500 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">
            {selectedStartDate && selectedEndDate
              ? `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`
              : selectedStartDate
              ? `${formatDate(selectedStartDate)} - Seleccionar fin`
              : 'Seleccionar fechas'}
          </span>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[340px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          {/* Cabecera del calendario */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day) => (
              <div key={day} className="w-[46px] h-8 flex items-center justify-center text-xs font-semibold text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* Leyenda */}
          {blockedDates.length > 0 && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Las fechas en rojo no están disponibles</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingDateRangePicker;


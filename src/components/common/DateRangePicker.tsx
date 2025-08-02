import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, X } from 'lucide-react';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  placeholder = "Seleccionar fechas",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(checkIn ? new Date(checkIn) : null);
  const [endDate, setEndDate] = useState<Date | null>(checkOut ? new Date(checkOut) : null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      onCheckInChange(date.toISOString().split('T')[0]);
    } else {
      onCheckInChange('');
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (date) {
      onCheckOutChange(date.toISOString().split('T')[0]);
    } else {
      onCheckOutChange('');
    }
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
    onCheckInChange('');
    onCheckOutChange('');
  };

  const formatDisplayDate = () => {
    if (startDate && endDate) {
      const start = startDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      const end = endDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      return `${start} - ${end}`;
    } else if (startDate) {
      return startDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
    return placeholder;
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center">
          <Calendar className="absolute left-3 text-gray-400 w-5 h-5" />
          <span className={`${startDate || endDate ? 'text-gray-800' : 'text-gray-500'}`}>
            {formatDisplayDate()}
          </span>
        </div>
        {(startDate || endDate) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearDates();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Fecha de llegada</h4>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar llegada"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                calendarClassName="border-0 shadow-lg rounded-lg"
                popperClassName="z-50"
              />
            </div>
            
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Fecha de salida</h4>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccionar salida"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                calendarClassName="border-0 shadow-lg rounded-lg"
                popperClassName="z-50"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearDates}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar fechas
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangePicker; 
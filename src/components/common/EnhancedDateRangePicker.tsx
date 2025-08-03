import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Calendar, X } from 'lucide-react';

interface EnhancedDateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'hero' | 'search';
}

const EnhancedDateRangePicker: React.FC<EnhancedDateRangePickerProps> = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  placeholder = "Seleccionar fechas",
  className = "",
  variant = 'hero'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const clearDates = () => {
    onCheckInChange('');
    onCheckOutChange('');
  };

  const formatDisplayDate = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      const end = new Date(checkOut).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      return `${start} - ${end}`;
    } else if (checkIn) {
      return new Date(checkIn).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
    return placeholder;
  };

  const getMinDate = () => {
    return dayjs();
  };

  const getMinCheckOut = () => {
    return checkIn ? dayjs(checkIn) : getMinDate();
  };

  const handleCheckInChange = (date: Dayjs | null) => {
    if (date) {
      onCheckInChange(date.format('YYYY-MM-DD'));
      // Si la fecha de salida es anterior a la nueva fecha de llegada, limpiarla
      if (checkOut && dayjs(checkOut).isBefore(date)) {
        onCheckOutChange('');
      }
    } else {
      onCheckInChange('');
    }
  };

  const handleCheckOutChange = (date: Dayjs | null) => {
    if (date) {
      onCheckOutChange(date.format('YYYY-MM-DD'));
    } else {
      onCheckOutChange('');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`relative ${className}`}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between hover:border-gray-300 transition-colors ${
            variant === 'hero' ? 'bg-white/95 backdrop-blur-sm' : 'bg-white'
          }`}
        >
          <div className="flex items-center">
            <Calendar className="absolute left-3 text-gray-400 w-5 h-5" />
            <span className={`${checkIn || checkOut ? 'text-gray-800' : 'text-gray-500'}`}>
              {formatDisplayDate()}
            </span>
          </div>
          {(checkIn || checkOut) && (
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
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px]">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fecha de llegada</h4>
                <DatePicker
                  value={checkIn ? dayjs(checkIn) : null}
                  onChange={handleCheckInChange}
                  minDate={getMinDate()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      className: 'w-full',
                      placeholder: 'Seleccionar llegada'
                    }
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fecha de salida</h4>
                <DatePicker
                  value={checkOut ? dayjs(checkOut) : null}
                  onChange={handleCheckOutChange}
                  minDate={getMinCheckOut()}
                  slotProps={{
                    textField: {
                      size: 'small',
                      className: 'w-full',
                      placeholder: 'Seleccionar salida'
                    }
                  }}
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
    </LocalizationProvider>
  );
};

export default EnhancedDateRangePicker; 
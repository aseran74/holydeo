import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

const SimpleDateRangePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleStartDateChange = (newDate: Dayjs | null) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate: Dayjs | null) => {
    setEndDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Date Range Picker Simple
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de inicio:
            </label>
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full"
              slotProps={{
                textField: {
                  size: 'medium',
                  className: 'w-full'
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de fin:
            </label>
            <DatePicker
              value={endDate}
              onChange={handleEndDateChange}
              className="w-full"
              slotProps={{
                textField: {
                  size: 'medium',
                  className: 'w-full'
                }
              }}
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Rango Seleccionado:
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Desde: {startDate.format('DD/MM/YYYY')}
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Hasta: {endDate.format('DD/MM/YYYY')}
            </p>
            <p className="text-blue-700 dark:text-blue-300 mt-2">
              Duración: {endDate.diff(startDate, 'day') + 1} días
            </p>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default SimpleDateRangePicker; 
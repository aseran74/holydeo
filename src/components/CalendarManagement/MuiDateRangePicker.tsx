import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { Button, Box, Typography, Paper, Chip } from '@mui/material';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Dayjs;
  endDate: Dayjs;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  description?: string;
}

interface MuiDateRangePickerProps {
  onEventCreate?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  events?: CalendarEvent[];
}

const MuiDateRangePicker: React.FC<MuiDateRangePickerProps> = ({
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  events = []
}) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState<CalendarEvent['color']>('primary');
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const colorOptions = [
    { value: 'primary', label: 'Primario', color: '#1976d2' },
    { value: 'secondary', label: 'Secundario', color: '#9c27b0' },
    { value: 'success', label: 'Éxito', color: '#2e7d32' },
    { value: 'warning', label: 'Advertencia', color: '#ed6c02' },
    { value: 'error', label: 'Error', color: '#d32f2f' }
  ];

  const handleStartDateChange = (newDate: Dayjs | null) => {
    setStartDate(newDate);
  };

  const handleEndDateChange = (newDate: Dayjs | null) => {
    setEndDate(newDate);
  };

  const handleCreateEvent = () => {
    if (!startDate || !endDate || !eventTitle.trim()) {
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      startDate: startDate,
      endDate: endDate,
      color: selectedColor,
      description: eventDescription
    };

    onEventCreate?.(newEvent);
    resetForm();
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !eventTitle.trim()) {
      return;
    }

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: eventTitle,
      startDate: startDate || editingEvent.startDate,
      endDate: endDate || editingEvent.endDate,
      color: selectedColor,
      description: eventDescription
    };

    onEventUpdate?.(updatedEvent);
    resetForm();
  };

  const handleDeleteEvent = (eventId: string) => {
    onEventDelete?.(eventId);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description || '');
    setSelectedColor(event.color);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setIsCreatingEvent(true);
  };

  const resetForm = () => {
    setEventTitle('');
    setEventDescription('');
    setSelectedColor('primary');
    setStartDate(null);
    setEndDate(null);
    setIsCreatingEvent(false);
    setEditingEvent(null);
  };

  const getColorStyle = (color: CalendarEvent['color']) => {
    const colorMap = {
      primary: '#1976d2',
      secondary: '#9c27b0',
      success: '#2e7d32',
      warning: '#ed6c02',
      error: '#d32f2f'
    };
    return { backgroundColor: colorMap[color] };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="mb-6">
          <Typography variant="h5" className="mb-4 text-gray-800 dark:text-white">
            Gestor de Calendario
          </Typography>
          
          {/* Date Range Picker */}
          <Box className="mb-6">
            <Typography variant="subtitle1" className="mb-2 text-gray-700 dark:text-gray-300">
              Seleccionar Rango de Fechas
            </Typography>
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
          </Box>

          {/* Event Creation Form */}
          <Paper className="p-4 mb-6 bg-gray-50 dark:bg-gray-700">
            <Typography variant="h6" className="mb-4 text-gray-800 dark:text-white">
              {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </Typography>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título del Evento
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder="Ingresa el título del evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  rows={3}
                  placeholder="Descripción del evento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color del Evento
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => setSelectedColor(option.value as CalendarEvent['color'])}
                      className={`cursor-pointer ${
                        selectedColor === option.value ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={getColorStyle(option.value as CalendarEvent['color'])}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="contained"
                  onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  disabled={!startDate || !endDate || !eventTitle.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingEvent ? 'Actualizar Evento' : 'Crear Evento'}
                </Button>
                {(editingEvent || isCreatingEvent) && (
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </Paper>

          {/* Events List */}
          <div>
            <Typography variant="h6" className="mb-4 text-gray-800 dark:text-white">
              Eventos Programados
            </Typography>
            <div className="space-y-3">
              {events.map((event) => (
                <Paper
                  key={event.id}
                  className="p-4 border-l-4"
                  style={{ borderLeftColor: getColorStyle(event.color).backgroundColor }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Typography variant="subtitle1" className="font-semibold text-gray-800 dark:text-white">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-1">
                        {event.startDate.format('DD/MM/YYYY')} - {event.endDate.format('DD/MM/YYYY')}
                      </Typography>
                      {event.description && (
                        <Typography variant="body2" className="text-gray-500 dark:text-gray-500 mt-2">
                          {event.description}
                        </Typography>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Paper>
              ))}
              {events.length === 0 && (
                <Typography variant="body2" className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay eventos programados
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default MuiDateRangePicker; 
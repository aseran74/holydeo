import React from 'react';
import SimpleDateRangePicker from '../../components/CalendarManagement/SimpleDateRangePicker';
import MuiDateRangePicker from '../../components/CalendarManagement/MuiDateRangePicker';
import PageMeta from '../../components/common/PageMeta';
import { Dayjs } from 'dayjs';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Dayjs;
  endDate: Dayjs;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  description?: string;
}

const CalendarDemo: React.FC = () => {
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);

  const handleEventCreate = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <>
      <PageMeta
        title="Demo Calendario MUI X | Date Range Picker"
        description="Demostración del Date Range Picker de MUI X"
      />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Demo: Date Range Picker MUI X
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Demostración de las capacidades del Date Range Picker de MUI X
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Componente Simple */}
          <div>
            <SimpleDateRangePicker />
          </div>

          {/* Componente Completo */}
          <div>
            <MuiDateRangePicker
              events={events}
              onEventCreate={handleEventCreate}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Características del Date Range Picker
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                ✅ Ventajas:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Interfaz moderna y accesible</li>
                <li>• Soporte para múltiples idiomas</li>
                <li>• Validación integrada</li>
                <li>• Personalización completa</li>
                <li>• Soporte para teclado</li>
                <li>• Responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔧 Funcionalidades:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Selección de rango de fechas</li>
                <li>• Múltiples vistas (mes, semana, día)</li>
                <li>• Atajos de fecha predefinidos</li>
                <li>• Formato de fecha personalizable</li>
                <li>• Integración con formularios</li>
                <li>• Soporte para zonas horarias</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarDemo; 
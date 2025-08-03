import React, { useState } from 'react';
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

const MuiCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

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
        title="Calendario MUI X | Gestor de Eventos"
        description="Gestor de calendario usando MUI X Date Range Picker"
      />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestor de Calendario
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus eventos usando el Date Range Picker de MUI X
          </p>
        </div>

        <MuiDateRangePicker
          events={events}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      </div>
    </>
  );
};

export default MuiCalendarPage; 
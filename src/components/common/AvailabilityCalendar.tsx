import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface AvailabilityCalendarProps {
  propertyId: string;
  className?: string;
}

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
}

interface BlockedDate {
  date: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ 
  propertyId, 
  className = '' 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnavailableDates();
  }, [propertyId]);

  const fetchUnavailableDates = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching unavailable dates for property:', propertyId);
      
      // Obtener las reservas confirmadas
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, start_date, end_date, status')
        .eq('property_id', propertyId)
        .eq('status', 'confirmada');

      // Obtener las fechas bloqueadas
      const { data: blockedDatesData, error: blockedDatesError } = await supabase
        .from('blocked_dates')
        .select('date')
        .eq('property_id', propertyId);

      if (bookingsError || blockedDatesError) {
        console.error('Error fetching bookings:', bookingsError);
        console.error('Error fetching blocked dates:', blockedDatesError);
      } else {
        console.log('Bookings found:', bookingsData);
        setBookings(bookingsData || []);
        console.log('Blocked dates found:', blockedDatesData);
        setBlockedDates(blockedDatesData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateUnavailable = (date: Date) => {
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Comprobar si está dentro de una reserva
    const isBooked = bookings.some(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const bookingStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const bookingEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      return checkDate >= bookingStart && checkDate <= bookingEnd;
    });

    if (isBooked) return true;

    // Comprobar si es una fecha bloqueada explícitamente
    const isBlocked = blockedDates.some(blockedDate => {
      const blocked = new Date(blockedDate.date);
      const blockedDay = new Date(blocked.getFullYear(), blocked.getMonth(), blocked.getDate());
      return checkDate.getTime() === blockedDay.getTime();
    });

    return isBlocked;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Agregar días del mes anterior para completar la primera semana
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthLastDay = new Date(year, month, 0);
      const day = prevMonthLastDay.getDate() - startingDayOfWeek + i + 1;
      days.push(new Date(year, month - 1, day));
    }

    // Agregar días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Agregar días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 días = 42
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDayName = (day: number) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[day];
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(42)].map((_, index) => (
              <div key={index} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Calendar className="inline w-5 h-5 mr-2" />
          Disponibilidad
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getMonthName(currentDate)}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {[0, 1, 2, 3, 4, 5, 6].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
            {getDayName(day)}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isUnavailable = isDateUnavailable(day);
          const isPast = isDateInPast(day);
          const isToday = isDateToday(day);

          let dayClasses = "h-8 flex items-center justify-center text-sm rounded transition-colors";
          
          if (!isCurrentMonth) {
            dayClasses += " text-gray-300 dark:text-gray-600";
          } else if (isPast) {
            dayClasses += " text-gray-400 dark:text-gray-500";
          } else if (isUnavailable) {
            dayClasses += " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 font-medium line-through";
          } else if (isToday) {
            dayClasses += " bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium";
          } else {
            dayClasses += " text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
          }

          return (
            <div key={index} className={dayClasses}>
              {day.getDate()}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 dark:bg-red-900 rounded"></div>
          <span className="text-red-600 dark:text-red-400">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 rounded"></div>
          <span className="text-blue-600 dark:text-blue-400">Hoy</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar; 
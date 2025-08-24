import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import useToast from '../../hooks/useToast';

interface ExperienceDatePickerProps {
  experienceId: string;
  onDateSelect: (date: string) => void;
  selectedDate: string;
  className?: string;
}

interface BlockedDate {
  date: string;
  reason: 'booked' | 'maintenance' | 'unavailable';
}

interface AvailabilityInfo {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  priceModifier: number;
}

const ExperienceDatePicker: React.FC<ExperienceDatePickerProps> = ({
  experienceId,
  onDateSelect,
  selectedDate,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [availabilityInfo, setAvailabilityInfo] = useState<AvailabilityInfo[]>([]);

  const toast = useToast();

  // Cargar fechas bloqueadas
  useEffect(() => {
    if (isOpen) {
      loadBlockedDates();
    }
  }, [isOpen, experienceId]);

  const loadBlockedDates = async () => {
    setLoading(true);
    try {
      // Obtener reservas existentes para esta experiencia
      const { data: bookings, error: bookingsError } = await supabase
        .from('experience_bookings')
        .select('preferred_date, status')
        .eq('experience_id', experienceId)
        .in('status', ['confirmed', 'pending']);

      if (bookingsError) {
        console.error('Error loading bookings:', bookingsError);
        return;
      }

      // Obtener configuración de disponibilidad
      const { data: availability, error: availabilityError } = await supabase
        .from('experience_availability')
        .select('*')
        .eq('experience_id', experienceId);

      if (availabilityError) {
        console.error('Error loading availability:', availabilityError);
        return;
      }

      // Procesar información de disponibilidad
      if (availability) {
        const processedAvailability: AvailabilityInfo[] = availability.map(a => ({
          dayOfWeek: a.day_of_week,
          isAvailable: a.is_available,
          startTime: a.start_time,
          endTime: a.end_time,
          maxParticipants: a.max_participants,
          priceModifier: a.price_modifier
        }));
        setAvailabilityInfo(processedAvailability);
      }

      // Crear array de fechas bloqueadas
      const blocked: BlockedDate[] = [];
      
      // Agregar fechas de reservas confirmadas como bloqueadas
      if (bookings) {
        bookings.forEach(booking => {
          if (booking.status === 'confirmed') {
            blocked.push({
              date: booking.preferred_date,
              reason: 'booked'
            });
          }
        });
      }

      // Agregar fechas pasadas como bloqueadas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Verificar disponibilidad por día de la semana
      if (availability) {
        const currentDate = new Date(today);
        for (let i = 0; i < 365; i++) {
          const dayOfWeek = currentDate.getDay();
          const dayAvailability = availability.find(a => a.day_of_week === dayOfWeek);
          
          if (dayAvailability && !dayAvailability.is_available) {
            blocked.push({
              date: currentDate.toISOString().split('T')[0],
              reason: 'unavailable'
            });
          }
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      setBlockedDates(blocked);
    } catch (error) {
      console.error('Error loading blocked dates:', error);
      toast.error('Error', 'No se pudieron cargar las fechas disponibles');
    } finally {
      setLoading(false);
    }
  };

  const isDateBlocked = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return blockedDates.some(blocked => blocked.date === dateString);
  };

  const isDatePast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDateStatus = (date: Date) => {
    if (isDatePast(date)) return 'past';
    if (isDateBlocked(date)) return 'blocked';
    return 'available';
  };

  const getDateInfo = (date: Date): string => {
    const dateString = date.toISOString().split('T')[0];
    const blocked = blockedDates.find(b => b.date === dateString);
    
    if (blocked) {
      switch (blocked.reason) {
        case 'booked': return 'Reservado';
        case 'maintenance': return 'Mantenimiento';
        case 'unavailable': return 'No disponible';
        default: return 'No disponible';
      }
    }

    // Si está disponible, mostrar información de horarios
    const dayOfWeek = date.getDay();
    const availability = availabilityInfo.find(a => a.dayOfWeek === dayOfWeek);
    
    if (availability && availability.isAvailable) {
      return `Disponible: ${availability.startTime} - ${availability.endTime}`;
    }

    return 'Disponible';
  };

  const handleDateClick = (date: Date) => {
    if (getDateStatus(date) === 'available') {
      const dateString = date.toISOString().split('T')[0];
      onDateSelect(dateString);
      setIsOpen(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  };

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Agregar días del mes anterior para completar la primera semana
    for (let i = 0; i < startingDay; i++) {
      const prevDate = new Date(year, month, -startingDay + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Agregar días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Agregar días del mes siguiente para completar la última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatDay = (date: Date) => {
    return date.getDate();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`relative ${className}`}>
      {/* Botón para abrir el date picker */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white flex items-center justify-between"
      >
        <span className={selectedDate ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
          {selectedDate ? selectedDate : 'Seleccionar fecha'}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {/* Date picker modal */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-25"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Seleccionar fecha
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navegación de meses */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <h4 className="text-base font-medium text-gray-900 dark:text-white capitalize">
                {formatMonthYear(currentMonth)}
              </h4>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(({ date, isCurrentMonth }, index) => {
                const status = getDateStatus(date);
                const isSelected = selectedDate === date.toISOString().split('T')[0];
                
                let className = "h-10 w-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center cursor-pointer";
                
                if (!isCurrentMonth) {
                  className += " text-gray-300 dark:text-gray-600 cursor-default";
                } else if (status === 'past') {
                  className += " text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-100 dark:bg-gray-700";
                } else if (status === 'blocked') {
                  className += " text-gray-400 dark:text-gray-500 cursor-not-allowed bg-red-100 dark:bg-red-900/20";
                } else if (isSelected) {
                  className += " bg-blue-600 text-white hover:bg-blue-700";
                } else {
                  className += " text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700";
                }

                return (
                  <div
                    key={index}
                    className={className}
                    onClick={() => isCurrentMonth && status === 'available' && handleDateClick(date)}
                                         title={isCurrentMonth ? getDateInfo(date) : ''}
                  >
                    {formatDay(date)}
                  </div>
                );
              })}
            </div>

                         {/* Información de disponibilidad de la semana */}
             {availabilityInfo.length > 0 && (
               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                 <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                   Horarios de esta semana
                 </h5>
                 <div className="grid grid-cols-7 gap-1 text-xs">
                   {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => {
                     const availability = availabilityInfo.find(a => a.dayOfWeek === index);
                     const isAvailable = availability?.isAvailable;
                     
                     return (
                       <div key={day} className="text-center">
                         <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                           {day}
                         </div>
                         {isAvailable ? (
                           <div className="text-green-600 dark:text-green-400">
                             {availability?.startTime?.substring(0, 5)} - {availability?.endTime?.substring(0, 5)}
                           </div>
                         ) : (
                           <div className="text-red-500 dark:text-red-400">
                             Cerrado
                           </div>
                         )}
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}

             {/* Leyenda */}
             <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
               <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                 <div className="flex items-center gap-1">
                   <div className="w-3 h-3 bg-blue-600 rounded"></div>
                   <span>Seleccionado</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-3 h-3 bg-red-100 dark:bg-red-900/20 rounded"></div>
                   <span>No disponible</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
                   <span>Pasado</span>
                 </div>
               </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExperienceDatePicker;

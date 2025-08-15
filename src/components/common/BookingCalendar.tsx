import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { ChevronLeft, X } from 'lucide-react';

interface BookingCalendarProps {
  propertyId: string;
  onBookingComplete: (bookingData: any) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  propertyId
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    fetchBookedDates();
  }, [propertyId]);

  const fetchBookedDates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in, check_out')
        .eq('property_id', propertyId);

      if (error) {
        console.error('Error fetching booked dates:', error);
      } else {
        const dates: string[] = [];
        data?.forEach(booking => {
          const start = new Date(booking.check_in);
          const end = new Date(booking.check_out);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dates.push(d.toISOString().split('T')[0]);
          }
        });
        setBookedDates(dates);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Añadir días del mes anterior para completar la primera semana
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Añadir todos los días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookedDates.includes(dateStr);
  };

  const isDateBlocked = () => {
    // Por ahora no hay fechas bloqueadas
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateInPast(date) || isDateBooked(date) || isDateBlocked()) {
      return;
    }

    setSelectedDates(prev => {
      const isAlreadySelected = prev.some(d => d.toDateString() === date.toDateString());
      
      if (isAlreadySelected) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = 0;
    
    selectedDates.forEach(() => {
      // Por ahora usamos un precio fijo, puedes ajustarlo según tus necesidades
      total += 100; // Precio base por día
    });
    
    return total;
  };

  const days = getDaysInMonth(currentDate);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <h3 className="text-lg font-semibold mb-4">Reservar por días sueltos</h3>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando calendario...</p>
        </div>
      ) : (
        <>
          {/* Navegación del calendario */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h4 className="text-lg font-medium">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h4>
            
            <button
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="rotate-180" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="min-h-[40px] flex items-center justify-center">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    disabled={isDateInPast(day) || isDateBooked(day) || isDateBlocked()}
                    className={`w-8 h-8 rounded-full text-sm transition-colors ${
                      selectedDates.some(d => d.toDateString() === day.toDateString())
                        ? 'bg-blue-600 text-white'
                        : isDateBooked(day)
                        ? 'bg-red-100 text-red-600 cursor-not-allowed'
                        : isDateBlocked()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isDateInPast(day)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {day.getDate()}
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {/* Fechas seleccionadas */}
          {selectedDates.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Fechas seleccionadas ({selectedDates.length} días)
              </h5>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full">
                    <span className="text-sm text-blue-800 dark:text-blue-200">
                      {date.toLocaleDateString('es-ES')}
                    </span>
                    <button
                      onClick={() => setSelectedDates(prev => prev.filter((_, i) => i !== index))}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Precio total: €{totalPrice}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingCalendar;

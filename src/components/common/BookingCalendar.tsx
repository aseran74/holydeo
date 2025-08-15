import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface BookingCalendarProps {
  propertyId: string;
  propertyName: string;
  precioDia?: number;
  precioEntresemana?: number;
  precioFinDeSemana?: number;
  minDays?: number;
  maxDays?: number;
}

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface BlockedDate {
  id: string;
  date: string;
  source: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  propertyId,
  propertyName,
  precioDia = 0,
  precioEntresemana = 0,
  precioFinDeSemana = 0,
  minDays = 1,
  maxDays = 30
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    message: ''
  });

  useEffect(() => {
    fetchCalendarData();
  }, [propertyId]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      // Obtener reservas confirmadas
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, start_date, end_date, status')
        .eq('property_id', propertyId)
        .eq('status', 'confirmada');

      if (bookingsError) {
        console.error('Error obteniendo reservas:', bookingsError);
      } else {
        setBookings(bookingsData || []);
      }

      // Obtener días bloqueados
      const { data: blockedData, error: blockedError } = await supabase
        .from('blocked_dates')
        .select('id, date, source')
        .eq('property_id', propertyId);

      if (blockedError) {
        console.error('Error obteniendo días bloqueados:', blockedError);
      } else {
        setBlockedDates(blockedData || []);
      }
    } catch (error) {
      console.error('Error en fetchCalendarData:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return bookings.some(booking => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return blockedDates.some(blocked => blocked.date === dateStr);
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

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDateInPast(date) || isDateBooked(date) || isDateBlocked(date)) {
      return;
    }

    setSelectedDates(prev => {
      const dateStr = date.toDateString();
      const isAlreadySelected = prev.some(d => d.toDateString() === dateStr);
      
      if (isAlreadySelected) {
        return prev.filter(d => d.toDateString() !== dateStr);
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calculateTotalPrice = () => {
    if (selectedDates.length === 0) return 0;
    
    let total = 0;
    selectedDates.forEach(date => {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingo o Sábado
        total += precioFinDeSemana;
      } else {
        total += precioEntresemana;
      }
    });
    
    return total;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedDates.length === 0) return;
    
    try {
      const startDate = selectedDates[0];
      const endDate = selectedDates[selectedDates.length - 1];
      
      // Aquí iría la lógica para crear la reserva
      // Por ahora solo mostramos un mensaje de éxito
      alert('Reserva enviada correctamente. Te contactaremos pronto.');
      
      // Limpiar formulario
      setSelectedDates([]);
      setShowBookingForm(false);
      setBookingData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error al enviar la reserva:', error);
      alert('Error al enviar la reserva. Inténtalo de nuevo.');
    }
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
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isBooked = isDateBooked(day);
              const isBlocked = isDateBlocked(day);
              const isPast = isDateInPast(day);
              const isToday = isDateToday(day);
              const isSelected = isDateSelected(day);

              let dayClasses = "h-10 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer";
              
              if (!isCurrentMonth) {
                dayClasses += " text-gray-300 dark:text-gray-600";
              } else if (isPast) {
                dayClasses += " text-gray-400 dark:text-gray-500 cursor-not-allowed";
              } else if (isBooked) {
                dayClasses += " bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium cursor-not-allowed";
              } else if (isBlocked) {
                dayClasses += " bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 font-medium cursor-not-allowed";
              } else if (isSelected) {
                dayClasses += " bg-blue-500 text-white font-medium";
              } else if (isToday) {
                dayClasses += " bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-medium hover:bg-blue-200";
              } else {
                dayClasses += " text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
              }

              return (
                <div
                  key={index}
                  className={dayClasses}
                  onClick={() => handleDateClick(day)}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>Reservado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 rounded"></div>
              <span>No disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Seleccionado</span>
            </div>
          </div>

          {/* Información de selección */}
          {selectedDates.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Fechas seleccionadas ({selectedDates.length} días)
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                <p>Desde: {selectedDates[0].toLocaleDateString('es-ES')}</p>
                <p>Hasta: {selectedDates[selectedDates.length - 1].toLocaleDateString('es-ES')}</p>
                <p className="font-medium mt-2">Precio total: {totalPrice.toFixed(2)}€</p>
              </div>
              
              <button
                onClick={() => setShowBookingForm(true)}
                className="btn btn-primary w-full"
              >
                Reservar estas fechas
              </button>
            </div>
          )}

          {/* Formulario de reserva */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Solicitar reserva</h3>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre completo</label>
                    <input
                      type="text"
                      required
                      value={bookingData.guestName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guestName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingData.guestEmail}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guestEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={bookingData.guestPhone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, guestPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Mensaje (opcional)</label>
                    <textarea
                      value={bookingData.message}
                      onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Comentarios adicionales..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Enviar solicitud
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingCalendar;

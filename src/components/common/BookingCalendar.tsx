import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

interface BookingCalendarProps {
  propertyId: string;
  precioDia?: number;
  onBookingComplete?: (bookingData: any) => void;
}

interface BlockedDate {
  id: string;
  date: string;
  source: 'manual' | 'ical' | 'booking';
}

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  guest_name?: string;
  status: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  propertyId,
  precioDia = 100,
  onBookingComplete
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');
  const [loading, setLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    notes: ''
  });

  useEffect(() => {
    fetchCalendarData();
  }, [propertyId]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      
      // Obtener fechas bloqueadas
      const { data: blocked, error: blockedError } = await supabase
        .from('blocked_dates')
        .select('id, date, source')
        .eq('property_id', propertyId);

      if (blockedError) {
        console.error('Error fetching blocked dates:', blockedError);
      } else if (blocked) {
        setBlockedDates(blocked);
      }

      // Obtener reservas existentes
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, check_in, check_out, guest_name, status')
        .eq('property_id', propertyId)
        .eq('status', 'confirmed');

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      } else if (bookings) {
        setExistingBookings(bookings);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
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

  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.some(b => b.date === dateStr);
  };

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return existingBookings.some(booking => {
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);
      const checkDate = new Date(dateStr);
      return checkDate >= start && checkDate <= end;
    });
  };

  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date);
    
    if (status !== 'available') return;

    if (selectionMode === 'start') {
      setSelectedStartDate(date);
      setSelectedEndDate(null); // Reset end date when start is selected
      setSelectionMode('end');
    } else {
      // Validar que la fecha de fin sea posterior a la de inicio
      if (selectedStartDate && date <= selectedStartDate) {
        // Si la fecha seleccionada es anterior o igual, cambiar la fecha de inicio
        setSelectedStartDate(date);
        setSelectedEndDate(null);
        setSelectionMode('end');
      } else {
        setSelectedEndDate(date);
        setSelectionMode('start'); // Reset to start mode after end is selected
      }
    }
  };

  const resetSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectionMode('start');
  };

  const getDateStatus = (date: Date) => {
    if (isDateInPast(date)) return 'past';
    if (isDateBooked(date)) return 'booked';
    if (isDateBlocked(date)) return 'blocked';
    return 'available';
  };

  const getDateSource = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const blocked = blockedDates.find(b => b.date === dateStr);
    return blocked?.source || null;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateStart = (date: Date) => {
    return selectedStartDate && date.toDateString() === selectedStartDate.toDateString();
  };

  const isDateEnd = (date: Date) => {
    return selectedEndDate && date.toDateString() === selectedEndDate.toDateString();
  };

  const calculateTotalPrice = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const start = new Date(selectedStartDate);
    const end = new Date(selectedEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return diffDays * precioDia;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStartDate || !selectedEndDate) {
      alert('Por favor, seleccione un rango de fechas.');
      return;
    }

    try {
      setLoading(true);
      
      // Crear la reserva
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          property_id: propertyId,
          check_in: selectedStartDate.toISOString().split('T')[0],
          check_out: selectedEndDate.toISOString().split('T')[0],
          guest_name: bookingForm.guestName,
          guest_email: bookingForm.guestEmail,
          guest_phone: bookingForm.guestPhone,
          notes: bookingForm.notes,
          status: 'pending',
          total_price: calculateTotalPrice(),
          nights: Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        alert('Error al crear la reserva');
        return;
      }

      // Limpiar formulario y fechas seleccionadas
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      setSelectionMode('start');
      setShowBookingForm(false);
      setBookingForm({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        notes: ''
      });

      // Recargar datos del calendario
      await fetchCalendarData();

      // Notificar éxito
      if (onBookingComplete) {
        onBookingComplete(booking);
      }

      alert('Reserva creada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const days = getDaysInMonth(currentDate);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold">Reservar por días sueltos</h3>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando calendario...</p>
        </div>
      ) : (
        <>
          {/* Navegación del calendario */}
          <div className="flex items-center justify-between mb-6">
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
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Indicador de modo de selección */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectionMode === 'start' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <span className={selectionMode === 'start' ? 'font-medium text-blue-600' : 'text-gray-500'}>
                  {selectionMode === 'start' ? 'Selecciona día de llegada' : 'Día de llegada seleccionado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${selectionMode === 'end' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={selectionMode === 'end' ? 'font-medium text-green-600' : 'text-gray-500'}>
                  {selectionMode === 'end' ? 'Selecciona día de salida' : 'Día de salida seleccionado'}
                </span>
              </div>
            </div>
            
            {selectedStartDate && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Llegada:</span> {selectedStartDate.toLocaleDateString('es-ES')}
                {selectedEndDate && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="font-medium">Salida:</span> {selectedEndDate.toLocaleDateString('es-ES')}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Leyenda del calendario */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Reservado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Bloqueado (iCal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Bloqueado (Manual)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Pasado</span>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {days.map((day, index) => {
              if (!day) return <div key={index} className="min-h-[50px]"></div>;
              
              const status = getDateStatus(day);
              const source = getDateSource(day);
              const isSelected = isDateInRange(day);
              const isStart = isDateStart(day);
              const isEnd = isDateEnd(day);
              
              let bgColor = 'bg-white hover:bg-gray-50';
              let textColor = 'text-gray-900';
              let cursor = 'cursor-pointer';
              let borderStyle = 'border-transparent';
              
              if (isStart) {
                bgColor = 'bg-blue-600';
                textColor = 'text-white';
                borderStyle = 'border-2 border-blue-800 shadow-lg';
              } else if (isEnd) {
                bgColor = 'bg-green-600';
                textColor = 'text-white';
                borderStyle = 'border-2 border-green-800 shadow-lg';
              } else if (isSelected) {
                bgColor = 'bg-blue-200';
                textColor = 'text-blue-800';
                borderStyle = 'border border-blue-300';
              } else if (status === 'booked') {
                bgColor = 'bg-red-500';
                textColor = 'text-white';
                cursor = 'cursor-not-allowed';
              } else if (status === 'blocked') {
                bgColor = source === 'ical' ? 'bg-yellow-500' : 'bg-gray-500';
                textColor = 'text-white';
                cursor = 'cursor-not-allowed';
              } else if (status === 'past') {
                bgColor = 'bg-gray-300';
                textColor = 'text-gray-500';
                cursor = 'cursor-not-allowed';
              }

              return (
                <div key={index} className="min-h-[50px] flex items-center justify-center">
                  <button
                    onClick={() => handleDateClick(day)}
                    disabled={status !== 'available'}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${bgColor} ${textColor} ${cursor} ${borderStyle}`}
                    title={
                      isStart ? 'Día de llegada' :
                      isEnd ? 'Día de salida' :
                      isSelected ? 'Día incluido en la reserva' :
                      status === 'booked' ? 'Día reservado' :
                      status === 'blocked' ? `Día bloqueado (${source === 'ical' ? 'iCal' : 'Manual'})` :
                      status === 'past' ? 'Fecha pasada' :
                      'Disponible para reservar'
                    }
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Fechas seleccionadas */}
          {selectedStartDate && selectedEndDate && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fechas seleccionadas ({Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} días)
                </h5>
                <button
                  onClick={resetSelection}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full">
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    {selectedStartDate.toLocaleDateString('es-ES')}
                  </span>
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    -
                  </span>
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    {selectedEndDate.toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Precio total: €{totalPrice}
                </div>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Reservar Ahora
                </button>
              </div>
            </div>
          )}

          {/* Formulario de reserva */}
          {showBookingForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Completar Reserva</h4>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.guestName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingForm.guestEmail}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.guestPhone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, guestPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notas adicionales
                    </label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Noches:</span>
                      <span className="font-medium">
                        {selectedStartDate && selectedEndDate ? 
                          Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Precio por noche:</span>
                      <span className="font-medium">€{precioDia}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>€{totalPrice}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creando...' : 'Confirmar Reserva'}
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

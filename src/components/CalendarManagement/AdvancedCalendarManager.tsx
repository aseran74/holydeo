import { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { supabase } from '../../supabaseClient';
import ICAL from 'ical.js';
import { createEvents } from 'ics';
import { 
  LockIcon, 
  DollarLineIcon, 
  DocsIcon, 
  DownloadIcon, 
  UserIcon, 
  CalenderIcon,
  PlugInIcon,
  BoltIcon,
  TrashBinIcon,
  PlusIcon
} from '../../icons';

interface AdvancedCalendarManagerProps {
  propertyId: string;
  propertyName?: string;
}

type BlockedDate = {
  id: string;
  date: string;
  source: 'manual' | 'ical' | 'booking';
};

type SpecialPrice = {
  id: string;
  date: string;
  price: number;
};

type Booking = {
  id: string;
  guest_id: string;
  guest_name?: string;
  start_date: string;
  end_date: string;
  status: 'pendiente' | 'confirmada' | 'cancelada';
  created_at: string;
};

type Guest = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
};

type CalendarMode = 'view' | 'block' | 'special' | 'booking' | 'ical';

const AdvancedCalendarManager: React.FC<AdvancedCalendarManagerProps> = ({ 
  propertyId, 
  propertyName = "Propiedad" 
}) => {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [specialPrices, setSpecialPrices] = useState<SpecialPrice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('view');
  const [loading, setLoading] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    guests_count: 1,
    total_price: 0,
    notes: ''
  });
  const [specialPriceData, setSpecialPriceData] = useState({
    price: ''
  });
  const [icalUrl, setIcalUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCalendarData();
    fetchGuests();
  }, [propertyId]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      // Obtener fechas bloqueadas
      const { data: blocked, error: blockedError } = await supabase
        .from('blocked_dates')
        .select('id, date, source')
        .eq('property_id', propertyId);
      
      if (blockedError) {
        console.error('Error al obtener fechas bloqueadas:', blockedError);
      }

      // Obtener precios especiales
      const { data: specials, error: specialsError } = await supabase
        .from('special_prices')
        .select('id, date, price')
        .eq('property_id', propertyId);
      
      if (specialsError) {
        console.error('Error al obtener precios especiales:', specialsError);
      }

      // Obtener reservas
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id, 
          guest_id, 
          start_date, 
          end_date, 
          status, 
          created_at,
          guests!inner(users!inner(full_name))
        `)
        .eq('property_id', propertyId)
        .eq('status', 'confirmada');
      
      if (bookingsError) {
        console.error('Error al obtener reservas:', bookingsError);
      }

      if (blocked) setBlockedDates(blocked);
      if (specials) setSpecialPrices(specials);
      if (bookingsData) {
        setBookings(bookingsData.map(b => ({
          ...b,
          guest_name: b.guests?.users?.full_name
        })));
      }
    } catch (error) {
      console.error('Error en fetchCalendarData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select(`
          id,
          users!inner(id, full_name, email)
        `);
      
      if (error) {
        console.error('Error al obtener huéspedes:', error);
      } else if (data) {
        setGuests(data.map(g => ({
          id: g.id,
          full_name: g.users?.full_name || 'Sin nombre',
          email: g.users?.email || '',
          phone: ''
        })));
      }
    } catch (error) {
      console.error('Error al obtener huéspedes:', error);
    }
  };

  const isBlocked = (date: Date) => {
    const d = date.toISOString().slice(0, 10);
    return blockedDates.some(b => b.date === d);
  };

  const getSpecialPrice = (date: Date) => {
    const d = date.toISOString().slice(0, 10);
    const found = specialPrices.find(s => s.date === d);
    return found ? found.price : null;
  };

  const getBooking = (date: Date) => {
    const d = date.toISOString().slice(0, 10);
    return bookings.find(b => b.start_date <= d && b.end_date >= d);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleBlockDay = async () => {
    if (!selectedDate) return;
    const d = selectedDate.toISOString().slice(0, 10);
    
    try {
      const { error } = await supabase.from('blocked_dates').insert({ 
        property_id: propertyId, 
        date: d,
        source: 'manual'
      });
      
      if (error) throw error;
      
      setShowModal(false);
      fetchCalendarData();
    } catch (error) {
      console.error('Error bloqueando día:', error);
      alert('Error al bloquear el día');
    }
  };

  const handleUnblockDay = async () => {
    if (!selectedDate) return;
    const d = selectedDate.toISOString().slice(0, 10);
    const blocked = blockedDates.find(b => b.date === d);
    
    if (blocked) {
      try {
        const { error } = await supabase.from('blocked_dates').delete().eq('id', blocked.id);
        if (error) throw error;
        
        setShowModal(false);
        fetchCalendarData();
      } catch (error) {
        console.error('Error desbloqueando día:', error);
        alert('Error al desbloquear el día');
      }
    }
  };

  const handleSetSpecialPrice = async () => {
    if (!selectedDate || !specialPriceData.price) return;
    const d = selectedDate.toISOString().slice(0, 10);
    const existing = specialPrices.find(s => s.date === d);
    
    try {
      if (existing) {
        const { error } = await supabase
          .from('special_prices')
          .update({ 
            price: Number(specialPriceData.price)
          })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('special_prices')
          .insert({ 
            property_id: propertyId, 
            date: d, 
            price: Number(specialPriceData.price)
          });
        if (error) throw error;
      }
      
      setShowModal(false);
      setSpecialPriceData({ price: '' });
      fetchCalendarData();
    } catch (error) {
      console.error('Error estableciendo precio especial:', error);
      alert('Error al establecer el precio especial');
    }
  };

  const handleRemoveSpecialPrice = async () => {
    if (!selectedDate) return;
    const d = selectedDate.toISOString().slice(0, 10);
    const special = specialPrices.find(s => s.date === d);
    
    if (special) {
      try {
        const { error } = await supabase.from('special_prices').delete().eq('id', special.id);
        if (error) throw error;
        
        setShowModal(false);
        setSpecialPriceData({ price: '' });
        fetchCalendarData();
      } catch (error) {
        console.error('Error eliminando precio especial:', error);
        alert('Error al eliminar el precio especial');
      }
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedDate || !selectedGuest) return;
    
    const startDate = selectedDate.toISOString().slice(0, 10);
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().slice(0, 10);
    
    try {
      const { error } = await supabase.from('bookings').insert({
        property_id: propertyId,
        guest_id: selectedGuest,
        start_date: startDate,
        end_date: endDateStr,
        status: 'confirmada'
      });
      
      if (error) throw error;
      
      setShowModal(false);
      setSelectedGuest('');
      setBookingData({ guests_count: 1, total_price: 0, notes: '' });
      fetchCalendarData();
    } catch (error) {
      console.error('Error creando reserva:', error);
      alert('Error al crear la reserva');
    }
  };

  const handleImportICal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const jCalData = ICAL.parse(text);
      const comp = new ICAL.Component(jCalData);
      const vevents = comp.getAllSubcomponents('vevent');
      
      const dates: string[] = [];
      
      for (const vevent of vevents) {
        try {
          const event = new ICAL.Event(vevent);
          const startDate = event.startDate;
          
          if (startDate) {
            const date = startDate.toJSDate().toISOString().slice(0, 10);
            dates.push(date);
          }
        } catch (eventError) {
          console.error('Error procesando evento:', eventError);
          continue;
        }
      }
      
      if (dates.length === 0) {
        throw new Error('No se encontraron fechas válidas en el archivo');
      }

      // Insertar las fechas en la base de datos
      for (const d of dates) {
        const { error } = await supabase
          .from('blocked_dates')
          .insert({ 
            property_id: propertyId, 
            date: d,
            source: 'ical'
          });
          
        if (error) {
          console.error('Error al insertar fecha:', d, error);
        }
      }

      await fetchCalendarData();
      alert(`Importación completada. Se importaron ${dates.length} fechas.`);
    } catch (err) {
      console.error('Error completo:', err);
      alert('Error importando el archivo iCal. Por favor, verifica que el formato del archivo sea correcto.');
    }
  };

  const handleExportICal = () => {
    const events = [
      ...blockedDates.map(b => ({
        start: b.date.split('-').map(Number),
        title: 'Bloqueado',
        description: `Día bloqueado (${b.source})`,
        duration: { days: 1 },
      })),
      ...specialPrices.map(s => ({
        start: s.date.split('-').map(Number),
        title: `Precio especial: €${s.price}`,
        description: `Precio especial: €${s.price}`,
        duration: { days: 1 },
      })),
      ...bookings.map(b => ({
        start: b.start_date.split('-').map(Number),
        title: `Reserva: ${b.guest_name}`,
        description: `Reserva confirmada`,
        duration: { days: Math.ceil((new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / (1000 * 60 * 60 * 24)) },
      })),
    ];
    
    createEvents(events, (error, value) => {
      if (error) {
        alert('Error exportando iCal');
        return;
      }
      const blob = new Blob([value], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${propertyName}_calendario.ics`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const generateICalUrl = () => {
    // Generar URL para sincronización con Airbnb, Booking, etc.
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/ical/${propertyId}`;
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const blockedDate = blockedDates.find(b => b.date === date.toISOString().slice(0, 10));
      const booking = getBooking(date);
      const price = getSpecialPrice(date);
      
      if (booking) {
        return <div className="w-2 h-2 rounded-full bg-green-500 mx-auto mt-1" title={`Reserva: ${booking.guest_name}`} />;
      }
      
      if (blockedDate) {
        const color = blockedDate.source === 'ical' ? 'bg-yellow-500' : 'bg-red-500';
        return <div className={`w-2 h-2 rounded-full ${color} mx-auto mt-1`} title={blockedDate.source === 'ical' ? 'Bloqueado por iCal' : 'Bloqueado manualmente'} />;
      }
      
      if (price) {
        return <div className="text-xs text-blue-600 font-bold mt-1">€{price}</div>;
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return 'bg-brand-100 border-2 border-brand-500 rounded-lg';
    }
    
    const booking = getBooking(date);
    if (booking) {
      return 'bg-green-100 text-green-700 rounded-lg';
    }
    
    const blockedDate = blockedDates.find(b => b.date === date.toISOString().slice(0, 10));
    if (blockedDate) {
      return blockedDate.source === 'ical' 
        ? 'bg-yellow-100 text-yellow-700 rounded-lg' 
        : 'bg-red-100 text-red-700 rounded-lg';
    }
    
    if (getSpecialPrice(date)) {
      return 'bg-blue-100 text-blue-700 rounded-lg';
    }
    
    return '';
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Gestión Avanzada de Calendario</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCalendarMode('view')}
            className={`px-3 py-1 rounded ${calendarMode === 'view' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Ver
          </button>
          <button
            onClick={() => setCalendarMode('block')}
            className={`px-3 py-1 rounded ${calendarMode === 'block' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            Bloquear
          </button>
          <button
            onClick={() => setCalendarMode('special')}
            className={`px-3 py-1 rounded ${calendarMode === 'special' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Precios
          </button>
          <button
            onClick={() => setCalendarMode('booking')}
            className={`px-3 py-1 rounded ${calendarMode === 'booking' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Reservas
          </button>
        </div>
      </div>

      {(!propertyId) ? (
        <div className="text-gray-500 text-center my-8">Guarda la propiedad para gestionar su calendario.</div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <Calendar
                onClickDay={handleDayClick}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full react-calendar border-none"
              />
              {loading && <div className="text-center text-gray-500 mt-2">Cargando...</div>}
            </div>
            
            <div className="lg:w-80 w-full">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200">
                <h4 className="font-semibold mb-3">Leyenda del Calendario</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Reserva confirmada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Día bloqueado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Bloqueado por iCal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Precio especial</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded">
                  <h5 className="font-semibold mb-2">Estadísticas</h5>
                  <div className="text-xs space-y-1">
                    <div>Reservas: {bookings.length}</div>
                    <div>Días bloqueados: {blockedDates.length}</div>
                    <div>Precios especiales: {specialPrices.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Herramientas de Calendario */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DocsIcon className="w-4 h-4" />
                Importar iCal
              </h4>
              <label className="btn btn-outline btn-sm w-full cursor-pointer">
                Seleccionar archivo
                <input type="file" accept=".ics" className="hidden" onChange={handleImportICal} />
              </label>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DownloadIcon className="w-4 h-4" />
                Exportar iCal
              </h4>
              <button className="btn btn-outline btn-sm w-full" onClick={handleExportICal}>
                Descargar
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <BoltIcon className="w-4 h-4" />
                URL de Sincronización
              </h4>
              <div className="text-xs bg-gray-100 p-2 rounded break-all">
                {generateICalUrl()}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <PlugInIcon className="w-4 h-4" />
                Configuración
              </h4>
              <button className="btn btn-outline btn-sm w-full">
                Configurar
              </button>
            </div>
          </div>

          {/* Modal */}
          {showModal && selectedDate && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
                <h4 className="font-bold mb-4">{selectedDate.toLocaleDateString()}</h4>
                
                {calendarMode === 'block' && (
                  <div>
                    {isBlocked(selectedDate) ? (
                      <>
                        <p className="mb-4 text-red-600">Este día está bloqueado.</p>
                        <button className="btn btn-primary w-full mb-2" onClick={handleUnblockDay}>
                          Desbloquear día
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="mb-4 text-gray-600">Bloquear este día para reservas.</p>
                        <button className="btn btn-danger w-full mb-2" onClick={handleBlockDay}>
                          Bloquear día
                        </button>
                      </>
                    )}
                  </div>
                )}

                {calendarMode === 'special' && (
                  <div>
                    {getSpecialPrice(selectedDate) ? (
                      <>
                        <p className="mb-2 text-blue-600">Precio especial: €{getSpecialPrice(selectedDate)}</p>
                        <input
                          type="number"
                          className="input input-bordered w-full mb-2"
                          value={specialPriceData.price}
                          onChange={e => setSpecialPriceData({...specialPriceData, price: e.target.value})}
                          placeholder="Nuevo precio especial"
                        />
                        <button className="btn btn-primary w-full mb-2" onClick={handleSetSpecialPrice}>
                          Actualizar precio
                        </button>
                        <button className="btn btn-warning w-full mb-2" onClick={handleRemoveSpecialPrice}>
                          Quitar precio especial
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="number"
                          className="input input-bordered w-full mb-2"
                          value={specialPriceData.price}
                          onChange={e => setSpecialPriceData({...specialPriceData, price: e.target.value})}
                          placeholder="Precio especial (€)"
                        />
                        <button className="btn btn-primary w-full mb-2" onClick={handleSetSpecialPrice}>
                          Asignar precio especial
                        </button>
                      </>
                    )}
                  </div>
                )}

                {calendarMode === 'booking' && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Huésped</label>
                      <select
                        className="select select-bordered w-full"
                        value={selectedGuest}
                        onChange={e => setSelectedGuest(e.target.value)}
                      >
                        <option value="">Seleccionar huésped</option>
                        {guests.map(guest => (
                          <option key={guest.id} value={guest.id}>
                            {guest.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Número de huéspedes</label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={bookingData.guests_count}
                        onChange={e => setBookingData({...bookingData, guests_count: parseInt(e.target.value)})}
                        min="1"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Precio total</label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={bookingData.total_price}
                        onChange={e => setBookingData({...bookingData, total_price: parseFloat(e.target.value)})}
                        step="0.01"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Notas</label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        value={bookingData.notes}
                        onChange={e => setBookingData({...bookingData, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <button 
                      className="btn btn-primary w-full mb-2" 
                      onClick={handleCreateBooking}
                      disabled={!selectedGuest}
                    >
                      Crear Reserva
                    </button>
                  </div>
                )}

                <button className="btn btn-outline w-full mt-2" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdvancedCalendarManager; 
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { supabase } from '../../supabaseClient';
import ICAL from 'ical.js';
import { createEvents } from 'ics';
import { LockIcon, DollarLineIcon, DocsIcon, DownloadIcon } from '../../icons';

interface PropertyCalendarManagerProps {
  propertyId: string;
}

type BlockedDate = {
  id: string;
  date: string; // YYYY-MM-DD
  source?: 'manual' | 'ical'; // Nuevo campo para identificar el origen
};

type SpecialPrice = {
  id: string;
  date: string; // YYYY-MM-DD
  price: number;
};

const PropertyCalendarManager: React.FC<PropertyCalendarManagerProps> = ({ propertyId }) => {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [specialPrices, setSpecialPrices] = useState<SpecialPrice[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [specialPriceValue, setSpecialPriceValue] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [propertyId]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
    const { data: blocked, error: blockedError } = await supabase
      .from('blocked_dates')
        .select('id, date, source')
      .eq('property_id', propertyId);
      
      if (blockedError) {
        console.error('Error al obtener fechas bloqueadas:', blockedError);
        return;
      }

    const { data: specials, error: specialsError } = await supabase
      .from('special_prices')
      .select('id, date, price')
      .eq('property_id', propertyId);
      
      if (specialsError) {
        console.error('Error al obtener precios especiales:', specialsError);
        return;
      }

      console.log('Fechas bloqueadas obtenidas:', blocked);
      if (blocked) setBlockedDates(blocked);
      if (specials) setSpecialPrices(specials);
    } catch (error) {
      console.error('Error en fetchCalendarData:', error);
    } finally {
    setLoading(false);
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

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSpecialPriceValue(getSpecialPrice(date)?.toString() || "");
    setShowModal(true);
  };

  const handleBlockDay = async () => {
    if (!selectedDate) return;
    const d = selectedDate.toISOString().slice(0, 10);
    await supabase.from('blocked_dates').insert({ 
      property_id: propertyId, 
      date: d,
      source: 'manual'
    });
    setShowModal(false);
    fetchCalendarData();
  };
  const handleUnblockDay = async () => {
    if (!selectedDate) return;
    const d = selectedDate.toISOString().slice(0, 10);
    const blocked = blockedDates.find(b => b.date === d);
    if (blocked) {
      await supabase.from('blocked_dates').delete().eq('id', blocked.id);
    }
    setShowModal(false);
    fetchCalendarData();
  };
  const handleSetSpecialPrice = async () => {
    if (!selectedDate || !specialPriceValue) return;
    const d = selectedDate.toISOString().slice(0, 10);
    const existing = specialPrices.find(s => s.date === d);
    if (existing) {
      await supabase.from('special_prices').update({ price: Number(specialPriceValue) }).eq('id', existing.id);
    } else {
      await supabase.from('special_prices').insert({ property_id: propertyId, date: d, price: Number(specialPriceValue) });
    }
    setShowModal(false);
    setSpecialPriceValue("");
    fetchCalendarData();
  };
  const handleRemoveSpecialPrice = async () => {
    if (!selectedDate) return;
    const d = selectedDate.toISOString().slice(0, 10);
    const special = specialPrices.find(s => s.date === d);
    if (special) {
      await supabase.from('special_prices').delete().eq('id', special.id);
    }
    setShowModal(false);
    setSpecialPriceValue("");
    fetchCalendarData();
  };

  const handleImportICal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
    const text = await file.text();
      console.log('Contenido del archivo:', text);
      
      const jCalData = ICAL.parse(text);
      const comp = new ICAL.Component(jCalData);
      const vevents = comp.getAllSubcomponents('vevent');
      console.log('Número de eventos encontrados:', vevents.length);
      
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

      console.log('Fechas a importar:', dates);
      
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
        description: 'Día bloqueado',
        duration: { days: 1 },
      })),
      ...specialPrices.map(s => ({
        start: s.date.split('-').map(Number),
        title: `Precio especial: €${s.price}`,
        description: `Precio especial para este día: €${s.price}`,
        duration: { days: 1 },
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
      a.download = 'calendario.ics';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const blockedDate = blockedDates.find(b => b.date === date.toISOString().slice(0, 10));
      if (blockedDate) {
        const color = blockedDate.source === 'ical' ? 'bg-yellow-500' : 'bg-red-500';
        return <div className={`w-2 h-2 rounded-full ${color} mx-auto mt-1`} title={blockedDate.source === 'ical' ? 'Bloqueado por iCal' : 'Bloqueado manualmente'} />;
      }
      const price = getSpecialPrice(date);
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
    const blockedDate = blockedDates.find(b => b.date === date.toISOString().slice(0, 10));
    if (view === 'month' && blockedDate) {
      return blockedDate.source === 'ical' 
        ? 'bg-yellow-100 text-yellow-700 rounded-lg' 
        : 'bg-red-100 text-red-700 rounded-lg';
    }
    if (view === 'month' && getSpecialPrice(date)) {
      return 'bg-blue-100 text-blue-700 rounded-lg';
    }
    return '';
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Gestión de calendario</h3>
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
            <div className="lg:w-80 w-full flex items-start">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <LockIcon className="w-5 h-5 text-red-500" />
                  <span>Haz clic en un día para <b>bloquearlo</b>.</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarLineIcon className="w-5 h-5 text-green-600" />
                  <span>Puedes asignar un <b>precio especial</b> a cualquier día.</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Los días bloqueados no estarán disponibles para reservas.<br/>
                  Los días con precio especial mostrarán el importe en el calendario.
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <label className="btn btn-outline flex items-center gap-2 cursor-pointer">
              <DocsIcon className="w-5 h-5" /> Importar iCal
              <input type="file" accept=".ics" className="hidden" onChange={handleImportICal} />
            </label>
            <button className="btn btn-outline flex items-center gap-2" onClick={handleExportICal} type="button">
              <DownloadIcon className="w-5 h-5" /> Exportar iCal
            </button>
          </div>
          {/* Modal */}
          {showModal && selectedDate && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-xs shadow-lg">
                <h4 className="font-bold mb-2">{selectedDate.toLocaleDateString()}</h4>
                {isBlocked(selectedDate) ? (
                  <>
                    <p className="mb-4 text-red-600">Este día está bloqueado.</p>
                    <button className="btn btn-primary w-full mb-2" onClick={handleUnblockDay}>Desbloquear día</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-danger w-full mb-2" onClick={handleBlockDay}>Bloquear día</button>
                  </>
                )}
                <div className="my-2 text-center text-gray-500">o</div>
                {getSpecialPrice(selectedDate) ? (
                  <>
                    <p className="mb-2 text-blue-600">Precio especial: €{getSpecialPrice(selectedDate)}</p>
                    <input
                      type="number"
                      className="input input-bordered w-full mb-2"
                      value={specialPriceValue}
                      onChange={e => setSpecialPriceValue(e.target.value)}
                      placeholder="Nuevo precio especial"
                    />
                    <button className="btn btn-primary w-full mb-2" onClick={handleSetSpecialPrice}>Actualizar precio</button>
                    <button className="btn btn-warning w-full mb-2" onClick={handleRemoveSpecialPrice}>Quitar precio especial</button>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      className="input input-bordered w-full mb-2"
                      value={specialPriceValue}
                      onChange={e => setSpecialPriceValue(e.target.value)}
                      placeholder="Precio especial (€)"
                    />
                    <button className="btn btn-primary w-full mb-2" onClick={handleSetSpecialPrice}>Asignar precio especial</button>
                  </>
                )}
                <button className="btn btn-outline w-full mt-2" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyCalendarManager; 
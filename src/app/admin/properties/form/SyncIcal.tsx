"use client";
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import ICAL from 'ical.js';

export default function SyncIcal({ propertyId }: { propertyId: string }) {
  const [icalUrl, setIcalUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Importar iCal
  const handleImport = async () => {
    if (!icalUrl) return alert('Por favor, introduce una URL de iCal.');
    setLoading(true);

    try {
      const response = await fetch(icalUrl);
      const icsText = await response.text();
      const jcalData = ICAL.parse(icsText);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');
      
      const datesToBlock = vevents.flatMap((ve: any) => {
        const event = new ICAL.Event(ve);
        const dates = [];
        let current = event.startDate.clone();
        while (current.compare(event.endDate) < 0) {
          dates.push({
            property_id: propertyId,
            date: current.toJSDate().toISOString().split('T')[0],
            source: 'ical_import'
          });
          current.addDuration(new ICAL.Duration({ days: 1 }));
        }
        return dates;
      });

      if (datesToBlock.length > 0) {
        await supabase.from('blocked_dates').upsert(datesToBlock, { onConflict: 'property_id, date' });
        alert('Calendario importado y fechas bloqueadas con éxito.');
      } else {
        alert('No se encontraron eventos en el calendario.');
      }
    } catch (err) {
      console.error(err);
      alert('Error importando el calendario iCal.');
    }
    setLoading(false);
  };

  // Exportar iCal
  const handleExport = () => {
    // Esta URL debe ser un endpoint de tu API que genere el iCal
    const exportUrl = `${window.location.origin}/api/ical/${propertyId}`;
    navigator.clipboard.writeText(exportUrl);
    alert('URL de exportación copiada al portapapeles.');
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Sincronización con iCal</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Importar Calendario iCal</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={icalUrl}
              onChange={(e) => setIcalUrl(e.target.value)}
              placeholder="Pega aquí la URL del iCal"
              className="input input-bordered w-full"
            />
            <button onClick={handleImport} disabled={loading} className="btn btn-primary">
              {loading ? 'Importando...' : 'Importar'}
            </button>
            <button onClick={handleImport} disabled={loading || !icalUrl} className="btn btn-secondary">
              Sincronizar Ahora
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Exportar Calendario</label>
          <p className="text-xs text-gray-500">Usa esta URL para sincronizar en otras plataformas.</p>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/api/ical/${propertyId}`}
              className="input input-bordered w-full bg-gray-100"
            />
            <button onClick={handleExport} className="btn btn-secondary">Copiar</button>
          </div>
        </div>
      </div>
    </div>
  );
} 
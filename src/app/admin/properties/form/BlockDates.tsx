"use client";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '@/utils/supabaseClient';

export default function BlockDates({ propertyId }: { propertyId: string }) {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar fechas bloqueadas
  useEffect(() => {
    if (!propertyId) return;
    const fetchBlockedDates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('date')
        .eq('property_id', propertyId);
      
      if (data) {
        setBlockedDates(data.map(d => new Date(d.date)));
      }
      setLoading(false);
    };
    fetchBlockedDates();
  }, [propertyId]);

  // Bloquear/desbloquear fecha
  const handleDateChange = async (date: Date) => {
    if (!date) return;
    const isoDate = date.toISOString().split('T')[0];
    const isBlocked = blockedDates.some(d => d.toISOString().split('T')[0] === isoDate);

    if (isBlocked) {
      // Desbloquear
      await supabase
        .from('blocked_dates')
        .delete()
        .eq('property_id', propertyId)
        .eq('date', isoDate);
      setBlockedDates(prev => prev.filter(d => d.toISOString().split('T')[0] !== isoDate));
    } else {
      // Bloquear
      await supabase
        .from('blocked_dates')
        .insert([{ property_id: propertyId, date: isoDate }]);
      setBlockedDates(prev => [...prev, date]);
    }
  };

  if (loading) return <div>Cargando calendario...</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Bloquear Fechas</h3>
      <p className="text-sm text-gray-500 mb-4">Haz clic en los días del calendario para marcarlos como no disponibles.</p>
      <DatePicker
        inline
        selected={null}
        onChange={handleDateChange}
        highlightDates={blockedDates}
        monthsShown={2}
        dayClassName={d => blockedDates.some(bd => bd.toDateString() === d.toDateString()) ? 'bg-red-500 text-white rounded-full' : ''}
      />
    </div>
  );
} 
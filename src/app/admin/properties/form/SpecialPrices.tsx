"use client";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from '@/utils/supabaseClient';
import "@/styles/__dates_picker.scss";

export default function SpecialPrices({ propertyId }: { propertyId: string }) {
  const [specialPrices, setSpecialPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [price, setPrice] = useState('');

  // Cargar precios especiales
  useEffect(() => {
    if (!propertyId) return;
    const fetchSpecialPrices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('special_prices')
        .select('date, price')
        .eq('property_id', propertyId);
      
      if (data) {
        setSpecialPrices(data);
      }
      setLoading(false);
    };
    fetchSpecialPrices();
  }, [propertyId]);

  // Manejar clic en una fecha
  const handleDayClick = (date: Date) => {
    const existing = specialPrices.find(sp => new Date(sp.date).toDateString() === date.toDateString());
    setSelectedDate(date);
    setPrice(existing ? existing.price : '');
  };

  // Guardar precio especial
  const handleSavePrice = async () => {
    if (!selectedDate || !price) return;

    const isoDate = selectedDate.toISOString().split('T')[0];
    const { error } = await supabase
      .from('special_prices')
      .upsert({ property_id: propertyId, date: isoDate, price: parseFloat(price) }, { onConflict: 'property_id, date' });

    if (!error) {
      const newPrices = [...specialPrices.filter(sp => new Date(sp.date).toDateString() !== selectedDate.toDateString()), { date: isoDate, price: parseFloat(price) }];
      setSpecialPrices(newPrices);
      setSelectedDate(null);
      setPrice('');
    }
  };

  const renderDayContents = (day: number, date: Date) => {
    const priceInfo = specialPrices.find(sp => new Date(sp.date).toDateString() === date.toDateString());
    const isSpecial = !!priceInfo;

    return (
      <div className={`relative ${isSpecial ? 'react-datepicker__day--selected' : ''}`}>
        <span className="react-datepicker__day_span">{day}</span>
        {priceInfo && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-green-500 text-white rounded-full px-1.5 py-0.5">
            {priceInfo.price}€
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div>Cargando precios...</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Precios Especiales por Fecha</h3>
      <p className="text-sm text-gray-500 mb-4">Haz clic en un día para asignar un precio especial.</p>
      <div className="flex flex-col md:flex-row gap-4">
        <DatePicker
          inline
          onChange={handleDayClick}
          selected={selectedDate}
          monthsShown={2}
          renderDayContents={renderDayContents}
        />
        {selectedDate && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">Precio para {selectedDate.toLocaleDateString()}</h4>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-bordered w-full mt-2"
              placeholder="Ej: 150"
            />
            <button onClick={handleSavePrice} className="btn btn-primary mt-2">Guardar Precio</button>
            <button onClick={() => setSelectedDate(null)} className="btn btn-ghost mt-2">Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
} 
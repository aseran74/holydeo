import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

import {
  TagIcon, CalendarDaysIcon, PlusIcon, XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon,
  InformationCircleIcon, CurrencyDollarIcon, SparklesIcon, EyeSlashIcon
} from '@heroicons/react/24/outline';

export default function PropertyStep4({ form, updateForm, onSaved }: { form: any, updateForm: (fields: any) => void, onSaved?: (data: any) => void }) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const [specialDate, setSpecialDate] = useState("");
  const [specialPrice, setSpecialPrice] = useState("");

  // Añadir precio especial
  const addSpecialPrice = () => {
    if (!specialDate || !specialPrice) return;
    const date = new Date(specialDate).setHours(0,0,0,0);
    const exists = (form.special_prices || []).some((sp: any) => sp.date === date);
    if (exists) return;
    updateForm({ special_prices: [...(form.special_prices || []), { date, price: Number(specialPrice) }] });
    setSpecialDate("");
    setSpecialPrice("");
  };

  // Quitar precio especial
  const removeSpecialPrice = (date: number) => {
    updateForm({ special_prices: (form.special_prices || []).filter((sp: any) => sp.date !== date) });
  };

  // Guardar todo
  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    setMessageType('');
    // Guardar propiedad
    const dbData = { ...form };
    let result;
    if (form.id) {
      result = await supabase.from("properties").update(dbData).eq("id", form.id);
    } else {
      result = await supabase.from("properties").insert([dbData]);
    }
    if (result.error) {
      setMessage("Error al guardar: " + result.error.message);
      setMessageType('error');
      setLoading(false);
      return;
    }
    // Guardar precios especiales en tabla special_prices
    if (form.special_prices && form.special_prices.length > 0) {
      const propertyId = form.id || result.data?.[0]?.id;
      const specials = form.special_prices.map((sp: any) => ({
        property_id: propertyId,
        date: new Date(sp.date).toISOString().slice(0,10),
        price: sp.price,
      }));
      await supabase.from("special_prices").delete().eq("property_id", propertyId);
      await supabase.from("special_prices").insert(specials);
    }
    setMessage("¡Propiedad guardada con éxito! Ya puedes verla en tu panel.");
    setMessageType('success');
    setLoading(false);
    if (onSaved) onSaved(result.data?.[0]);
  };

  const SummaryItem = ({ label, value }: { label: string, value: any }) => (
    value ? <li className="flex justify-between items-center"><span className="text-gray-600">{label}</span><span className="font-semibold text-gray-800 text-right">{value}</span></li> : null
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Precios especiales y Resumen final</h2>
        <p className="text-gray-500 mt-1">Añade tarifas para fechas específicas y revisa todos los datos antes de guardar.</p>
      </div>
      <div className="space-y-10">
        {/* Sección de Precios Especiales */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tarifas especiales por fecha</h3>
          <div className="bg-base-100 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <div className="form-control">
                <label className="label"><span className="label-text">Fecha</span></label>
                <input type="date" value={specialDate} onChange={e => setSpecialDate(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Precio</span></label>
                <div className="relative">
                  <input type="number" value={specialPrice} onChange={e => setSpecialPrice(e.target.value)} placeholder="Ej: 150" className="input input-bordered w-full pr-12" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">{form.currency || 'EUR'}</span>
                </div>
              </div>
              <button type="button" className="btn btn-primary" onClick={addSpecialPrice} disabled={!specialDate || !specialPrice}><PlusIcon className="w-5 h-5"/> Añadir</button>
            </div>
            {(form.special_prices && form.special_prices.length > 0) && (
              <div className="mt-4 pt-4 border-t">
                <p className="font-semibold text-sm mb-2">Precios añadidos:</p>
                <div className="flex flex-wrap gap-2">
                  {form.special_prices.map((sp: any) => (
                    <div key={sp.date} className="badge badge-lg badge-outline gap-2 pl-1">
                      <CalendarDaysIcon className="w-4 h-4"/>
                      {new Date(sp.date).toLocaleDateString()} - <span className="font-bold">{sp.price} {form.currency || 'EUR'}</span>
                      <button onClick={() => removeSpecialPrice(sp.date)} className="ml-1"><XCircleIcon className="w-5 h-5 text-red-500 hover:text-red-700"/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        {/* Sección de Resumen Final */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Revisa que todo esté correcto</h3>
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
            <div className="collapse collapse-arrow border bg-white">
              <input type="checkbox" defaultChecked /> 
              <div className="collapse-title text-xl font-medium flex items-center gap-3"><InformationCircleIcon className="w-6 h-6 text-primary"/> Información General</div>
              <div className="collapse-content">
                <ul className="text-sm space-y-2 divide-y">
                  <SummaryItem label="Nombre" value={form.title} />
                  <SummaryItem label="Dirección" value={form.address} />
                  <SummaryItem label="Superficie" value={form.acreage ? `${form.acreage} m²` : null} />
                  <SummaryItem label="Huéspedes" value={form.guests} />
                  <SummaryItem label="Dormitorios" value={form.bedrooms} />
                  <SummaryItem label="Baños" value={form.bathrooms} />
                </ul>
              </div>
            </div>
            <div className="collapse collapse-arrow border bg-white">
              <input type="checkbox" /> 
              <div className="collapse-title text-xl font-medium flex items-center gap-3"><CurrencyDollarIcon className="w-6 h-6 text-primary"/> Tarifas</div>
              <div className="collapse-content">
                <ul className="text-sm space-y-2 divide-y">
                  <SummaryItem label="Precio Lunes-Viernes" value={form.price_weekday ? `${form.price_weekday} ${form.currency}` : null} />
                  <SummaryItem label="Precio Sábado-Domingo" value={form.price_weekend ? `${form.price_weekend} ${form.currency}` : null} />
                  <SummaryItem label="Precio mensual" value={form.price_monthly ? `${form.price_monthly} ${form.currency}` : null} />
                  <SummaryItem label="Estancia mín/máx" value={form.nights_min && form.nights_max ? `${form.nights_min} - ${form.nights_max} noches` : null} />
                </ul>
              </div>
            </div>
            <div className="collapse collapse-arrow border bg-white">
              <input type="checkbox" /> 
              <div className="collapse-title text-xl font-medium flex items-center gap-3"><SparklesIcon className="w-6 h-6 text-primary"/> Servicios y Normas</div>
              <div className="collapse-content">
                 <ul className="text-sm space-y-2 divide-y">
                  <SummaryItem label="Servicios" value={(form.amenities || []).join(", ")} />
                  <SummaryItem label="Normas" value={(form.rules || []).join(", ")} />
                 </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Botón de guardar y mensajes */}
        <div className="text-center mt-8">
          <button type="button" className={`btn btn-primary btn-lg w-full md:w-auto ${loading && 'loading'}`} onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : (form.id ? "Actualizar Propiedad" : "Publicar Propiedad")}
          </button>
          {message && (
            <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'} shadow-lg mt-4`}>
              <div>
                {messageType === 'success' ? <CheckCircleIcon className="w-6 h-6"/> : <ExclamationTriangleIcon className="w-6 h-6"/>}
                <span>{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
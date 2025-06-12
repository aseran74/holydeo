import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// @ts-ignore
import ICAL from "ical.js";

// Componente de input de precio (puedes crear uno más avanzado si lo deseas)
function PriceInput({ label, name, value, onChange, currency, placeholder, icon }: any) {
  return (
    <div className="form-control w-full">
      <label className="label"><span className="label-text font-semibold">{label}</span></label>
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3">{icon}</span>}
        <input
          name={name}
          type="number"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input input-bordered w-full pl-10 pr-16"
        />
        <span className="absolute right-4 text-gray-400 font-bold">{currency}</span>
      </div>
    </div>
  );
}

import {
  CalendarDaysIcon, CurrencyDollarIcon, MoonIcon, TagIcon, ArrowUpTrayIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const CURRENCIES = ["EUR", "USD", "GBP", "MXN"];

export default function PropertyStep3({ form, updateForm }: { form: any, updateForm: (fields: any) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blockedDates = form.unavailable_dates?.map((d: any) => new Date(Number(d))) || [];

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const time = date.setHours(0, 0, 0, 0);
    let newDates = form.unavailable_dates ? [...form.unavailable_dates] : [];
    if (newDates.includes(time)) {
      newDates = newDates.filter((d: number) => d !== time);
    } else {
      newDates.push(time);
    }
    updateForm({ unavailable_dates: newDates });
  };

  const handleICalImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jcalData = ICAL.parse(event.target?.result as string);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");
        const dates = vevents.map((ve: any) => {
          const dt = ve.getFirstPropertyValue("dtstart");
          return new Date(dt).setHours(0, 0, 0, 0);
        });
        const allDates = Array.from(new Set([...(form.unavailable_dates || []), ...dates]));
        updateForm({ unavailable_dates: allDates });
      } catch (err) {
        alert("Error importando iCal");
      }
    };
    reader.readAsText(file);
  };

  const handleICalExport = () => {
    const events = (form.unavailable_dates || []).map((ts: number, i: number) => `BEGIN:VEVENT\nUID:${i}@app\nDTSTART;VALUE=DATE:${new Date(ts).toISOString().slice(0,10).replace(/-/g,"")}\nSUMMARY:Bloqueado\nEND:VEVENT`).join("\n");
    const ical = `BEGIN:VCALENDAR\nVERSION:2.0\n${events}\nEND:VCALENDAR`;
    const blob = new Blob([ical], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fechas-bloqueadas.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['price_weekday', 'price_weekend', 'price_monthly', 'nights_min', 'nights_max'].includes(name);
    updateForm({ [name]: isNumber ? parseFloat(value) || 0 : value });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Precios y Disponibilidad</h2>
        <p className="text-gray-500 mt-1">Define tus tarifas y gestiona tu calendario.</p>
      </div>
      <div className="space-y-10">
        {/* Sección de Precios y Estancia */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Tarifas y condiciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PriceInput
              label="Precio por noche (L-V)"
              name="price_weekday"
              value={form.price_weekday}
              onChange={handleChange}
              currency={form.currency || 'EUR'}
              placeholder="100"
              icon={<CalendarDaysIcon className="w-5 h-5"/>}
            />
            <PriceInput
              label="Precio por noche (S-D)"
              name="price_weekend"
              value={form.price_weekend}
              onChange={handleChange}
              currency={form.currency || 'EUR'}
              placeholder="120"
              icon={<CalendarDaysIcon className="w-5 h-5 font-bold"/>}
            />
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Moneda</span></label>
              <select name="currency" value={form.currency || 'EUR'} onChange={handleChange} className="select select-bordered">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
             <PriceInput
              label="Precio fijo mensual"
              name="price_monthly"
              value={form.price_monthly}
              onChange={handleChange}
              currency={form.currency || '€'}
              placeholder="1000"
              icon={<TagIcon className="w-5 h-5"/>}
            />
            <PriceInput
              label="Noches mínimas"
              name="nights_min"
              value={form.nights_min}
              onChange={handleChange}
              currency="noches"
              placeholder="2"
              icon={<MoonIcon className="w-5 h-5"/>}
            />
            <PriceInput
              label="Noches máximas"
              name="nights_max"
              value={form.nights_max}
              onChange={handleChange}
              currency="noches"
              placeholder="30"
              icon={<MoonIcon className="w-5 h-5"/>}
            />
          </div>
        </section>
        {/* Sección de Calendario */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Bloquear fechas</h3>
            <p className="text-sm text-gray-500 mb-4">Haz clic en los días del calendario para marcarlos como no disponibles.</p>
            <div className="p-4 border rounded-lg bg-base-100">
               <DatePicker
                  inline
                  selected={null}
                  onChange={handleDateChange}
                  highlightDates={[{ "bg-error text-error-content": blockedDates }]}
                  monthsShown={1}
               />
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm">
                <span className="w-4 h-4 rounded-full bg-error"></span>
                <span>= Fecha bloqueada</span>
            </div>
          </div>
          {/* Sincronización iCal */}
          <div className="w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sincronizar calendario</h3>
            <p className="text-sm text-gray-500 mb-4">Mantén tu disponibilidad actualizada importando o exportando un archivo iCal (.ics).</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <ArrowUpTrayIcon className="w-8 h-8 text-primary"/>
              <div>
                <p className="font-semibold">Importar calendario</p>
                <p className="text-xs text-gray-500">Sube un archivo .ics para bloquear fechas automáticamente.</p>
              </div>
            </div>
            <div
              onClick={handleICalExport}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <ArrowDownTrayIcon className="w-8 h-8 text-secondary"/>
              <div>
                <p className="font-semibold">Exportar calendario</p>
                <p className="text-xs text-gray-500">Descarga un archivo .ics con tus fechas bloqueadas.</p>
              </div>
            </div>
            <input type="file" accept=".ics" ref={fileInputRef} onChange={handleICalImport} className="hidden" />
          </div>
        </section>
      </div>
    </div>
  );
} 
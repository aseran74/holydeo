"use client";

import DatePickerCustomDay from "@/components/DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import NcInputNumber from "@/components/NcInputNumber";
import React, { FC, useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ICAL from "ical.js";
import ical from "ical-generator";
import { supabase } from "@/utils/supabaseClient";

export interface PageAddListing9Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing9: FC<PageAddListing9Props> = ({ formData, updateFormData }) => {
  // Fechas bloqueadas
  const dates = formData.blockedDates || [];
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const propertyId = formData.propertyId;
  const [priceWeekday, setPriceWeekday] = useState<number | ''>('');
  const [priceWeekend, setPriceWeekend] = useState<number | ''>('');
  const [specialPrices, setSpecialPrices] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [specialPrice, setSpecialPrice] = useState<number | ''>('');
  const [showSpecialPriceModal, setShowSpecialPriceModal] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Handlers para noches mínimas y máximas
  const handleMinNights = (val: number) => {
    updateFormData({ minNights: val });
  };
  const handleMaxNights = (val: number) => {
    updateFormData({ maxNights: val });
  };

  // Handler para fechas bloqueadas
  const handleDateChange = (date: Date) => {
    let newDates = [];
    if (!date) return;
    const newTime = date.getTime();
    if (dates.includes(newTime)) {
      newDates = dates.filter((item: number) => item !== newTime);
    } else {
      newDates = [...dates, newTime];
    }
    updateFormData({ blockedDates: newDates });
  };

  // Handler para el campo de iCal
  const handleICalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ icalUrl: e.target.value });
  };

  // Importar iCal desde URL
  const handleImportICal = async () => {
    if (!formData.icalUrl) {
      alert("Por favor, introduce una URL de calendario iCal válida.");
      return;
    }
    setImporting(true);
    try {
      const res = await fetch(formData.icalUrl);
      if (!res.ok) throw new Error("No se pudo descargar el archivo iCal");
      const icsText = await res.text();
      const jcalData = ICAL.parse(icsText);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents("vevent");
      const newDates: number[] = [];
      vevents.forEach((vevent: any) => {
        const event = new ICAL.Event(vevent);
        if (event.startDate && event.endDate) {
          // Añade todos los días del rango como bloqueados
          let current = event.startDate.clone();
          const end = event.endDate.clone();
          while (current.compare(end) < 0) {
            newDates.push(current.toJSDate().setHours(0,0,0,0));
            current = current.clone();
            current.addDuration(new ICAL.Duration({days: 1}));
          }
        }
      });
      // Elimina duplicados y actualiza
      const uniqueDates = Array.from(new Set([...(dates || []), ...newDates]));
      updateFormData({ blockedDates: uniqueDates });
      alert("Fechas importadas correctamente");
    } catch (err: any) {
      alert("Error importando iCal: " + err.message);
    }
    setImporting(false);
  };

  // Exportar iCal
  const handleExportICal = () => {
    setExporting(true);
    try {
      const cal = ical({
        name: "Calendario de disponibilidad",
      });
      (dates || []).forEach((timestamp: number, idx: number) => {
        const date = new Date(timestamp);
        cal.createEvent({
          start: date,
          end: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          summary: "No disponible",
          id: `blocked-${idx}-${timestamp}`,
        });
      });
      const blob = new Blob([cal.toString()], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "calendario.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Error exportando iCal: " + err.message);
    }
    setExporting(false);
  };

  // Sincronización automática cada 20 minutos
  useEffect(() => {
    if (formData.icalUrl) {
      // Limpia intervalos previos
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Lanza la primera sincronización inmediata
      handleImportICal();
      // Programa la sincronización cada 20 minutos
      intervalRef.current = setInterval(() => {
        handleImportICal();
      }, 20 * 60 * 1000);
      // Limpia al desmontar o cambiar URL
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      // Si no hay URL, limpia cualquier intervalo
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [formData.icalUrl]);

  // Fetch precios base y especiales
  useEffect(() => {
    if (!propertyId) return;
    setLoadingPrices(true);
    (async () => {
      // Precios base
      const { data: property } = await supabase
        .from('properties')
        .select('price_weekday, price_weekend')
        .eq('id', propertyId)
        .single();
      setPriceWeekday(property?.price_weekday || '');
      setPriceWeekend(property?.price_weekend || '');
      // Precios especiales
      const { data: specials } = await supabase
        .from('special_prices')
        .select('date, price')
        .eq('property_id', propertyId);
      setSpecialPrices(specials || []);
      setLoadingPrices(false);
    })();
  }, [propertyId]);

  // Guardar precios base
  const handleSaveBasePrices = async () => {
    if (!propertyId) return;
    await supabase.from('properties').update({
      price_weekday: priceWeekday,
      price_weekend: priceWeekend,
    }).eq('id', propertyId);
  };

  // Guardar precio especial
  const handleSaveSpecialPrice = async () => {
    if (!propertyId || !selectedDay || !specialPrice) return;
    await supabase.from('special_prices').upsert([
      { property_id: propertyId, date: selectedDay.toISOString().slice(0, 10), price: specialPrice }
    ]);
    setShowSpecialPriceModal(false);
    setSpecialPrice('');
    setSelectedDay(null);
    // Refresca
    const { data: specials } = await supabase
      .from('special_prices')
      .select('date, price')
      .eq('property_id', propertyId);
    setSpecialPrices(specials || []);
  };

  // Render custom day para mostrar precios especiales
  const renderDayContents = (day: number, date: Date) => {
    const iso = date.toISOString().slice(0, 10);
    const sp = specialPrices.find((sp: any) => sp.date === iso);
    return (
      <div className="relative">
        <span>{day}</span>
        {sp && (
          <span className="absolute -right-2 -top-2 bg-primary-500 text-white text-xs rounded-full px-1">${sp.price}</span>
        )}
      </div>
    );
  };

  return (
    <>
      {!propertyId && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">Debes guardar la propiedad antes de gestionar precios y calendario.</div>
      )}
      {propertyId && (
        <div className="bg-white rounded-xl border shadow-md p-4 mb-6">
          <h3 className="text-base font-semibold mb-2">Precios base</h3>
          <div className="flex gap-4 mb-2">
            <div>
              <label className="block text-xs font-medium text-neutral-700">Precio base (L-V)</label>
              <input
                type="number"
                className="block w-24 px-2 py-1 border rounded text-center"
                value={priceWeekday}
                onChange={e => setPriceWeekday(Number(e.target.value))}
                onBlur={handleSaveBasePrices}
                disabled={loadingPrices}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700">Precio base (S-D)</label>
              <input
                type="number"
                className="block w-24 px-2 py-1 border rounded text-center"
                value={priceWeekend}
                onChange={e => setPriceWeekend(Number(e.target.value))}
                onBlur={handleSaveBasePrices}
                disabled={loadingPrices}
              />
            </div>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-semibold">¿Cuánto tiempo pueden alojarse los huéspedes?</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Establece el mínimo y máximo de noches por reserva.
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-7">
        <NcInputNumber label="Noches mínimas" defaultValue={formData.minNights || 1} onChange={handleMinNights} />
        <NcInputNumber label="Noches máximas" defaultValue={formData.maxNights || 99} onChange={handleMaxNights} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold">Configura tu disponibilidad</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Selecciona fechas para bloquear o desbloquear en tu calendario. Haz clic en un día para asignar un precio especial.
        </span>
      </div>

      <div className="addListingDatePickerExclude">
        <DatePicker
          onChange={handleDateChange}
          monthsShown={2}
          showPopperArrow={false}
          excludeDates={dates.filter(Boolean).map((item: number) => new Date(item))}
          inline
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={renderDayContents}
          onDayClick={(date: Date) => {
            setSelectedDay(date);
            const iso = date.toISOString().slice(0, 10);
            const sp = specialPrices.find((sp: any) => sp.date === iso);
            setSpecialPrice(sp ? sp.price : '');
            setShowSpecialPriceModal(true);
          }}
        />
      </div>

      {/* Modal para editar precio especial */}
      {showSpecialPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h4 className="mb-2">Precio especial para {selectedDay?.toLocaleDateString()}</h4>
            <input
              type="number"
              className="block w-32 px-2 py-1 border rounded text-center mb-2"
              value={specialPrice}
              onChange={e => setSpecialPrice(Number(e.target.value))}
            />
            <div className="flex gap-2">
              <button className="bg-primary-6000 text-white px-4 py-2 rounded" onClick={handleSaveSpecialPrice}>Guardar</button>
              <button className="bg-neutral-200 px-4 py-2 rounded" onClick={() => setShowSpecialPriceModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Sincronización iCal */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Sincronización con calendario externo (iCal)</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Input
            className="flex-1"
            placeholder="Pega aquí la URL de tu calendario iCal"
            value={formData.icalUrl || ""}
            onChange={handleICalChange}
          />
          <ButtonPrimary type="button" onClick={handleImportICal} disabled={importing}>
            {importing ? "Importando..." : "Importar iCal"}
          </ButtonPrimary>
          <ButtonPrimary type="button" onClick={handleExportICal} disabled={exporting}>
            {exporting ? "Exportando..." : "Exportar iCal"}
          </ButtonPrimary>
          <ButtonPrimary type="button" onClick={handleImportICal} disabled={importing || !formData.icalUrl}>
            {importing ? "Actualizando..." : "Refrescar iCal"}
          </ButtonPrimary>
        </div>
        <span className="block mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Puedes importar la disponibilidad de otros portales (Airbnb, Booking, etc) o exportar tu calendario para mantenerlo sincronizado.
        </span>
      </div>
    </>
  );
};

export default PageAddListing9;

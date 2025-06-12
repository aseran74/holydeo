"use client";
import React from "react";
import NumberStepper from "../../components/NumberStepper";
import dynamic from "next/dynamic";
import { HomeIcon, ArrowsPointingOutIcon, LifebuoyIcon, UserGroupIcon, HomeModernIcon, SunIcon } from '@heroicons/react/24/outline';

const GooglePlacesClient = dynamic(() => import("./GooglePlacesClient"), { ssr: false });

export default function PropertyStep1({ form, updateForm }: { form: any, updateForm: (fields: any) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = e.target.type === 'number' ? parseInt(value, 10) || 0 : value;
    updateForm({ [name]: finalValue });
  };

  const handleNumberChange = (name: string, value: number) => {
    updateForm({ [name]: value });
  };

  const handleAddressChange = (selected: any) => {
    updateForm({ address: selected ? selected.label : "" });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Información básica de la propiedad</h2>
        <p className="text-gray-500 mt-1">Comencemos con los detalles más importantes.</p>
      </div>
      <div className="space-y-6">
        {/* Input de Título mejorado con icono */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Nombre de la propiedad*</span>
          </label>
          <div className="relative">
            <HomeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="title" value={form.title} onChange={handleChange} placeholder="Ej: Villa con vistas al mar" required className="input input-bordered w-full pl-10" />
          </div>
        </div>
        {/* Textarea de Descripción */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Descripción*</span>
          </label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe tu propiedad de forma atractiva..." required className="textarea textarea-bordered w-full h-28" />
        </div>
        {/* Autocompletado de Google Maps */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Localización/Dirección*</span>
          </label>
          <GooglePlacesClient
            value={form.address ? { label: form.address, value: form.address } : null}
            onChange={handleAddressChange}
            onInputChange={(inputValue) => updateForm({ address: inputValue })}
          />
        </div>
        {/* Input de Superficie con icono */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Superficie (m²)*</span>
          </label>
          <div className="relative">
            <ArrowsPointingOutIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input name="acreage" type="number" value={form.acreage} onChange={handleChange} placeholder="0" required className="input input-bordered w-full pl-10" />
          </div>
        </div>
        {/* Grid para los contadores numéricos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <NumberStepper
            label="Nº Baños"
            name="bathrooms"
            value={form.bathrooms || 0}
            onChange={handleNumberChange}
            icon={<LifebuoyIcon className="w-6 h-6" />}
          />
          <NumberStepper
            label="Nº Dormitorios"
            name="bedrooms"
            value={form.bedrooms || 0}
            onChange={handleNumberChange}
            icon={<HomeModernIcon className="w-6 h-6" />}
          />
          <NumberStepper
            label="Nº Cocinas"
            name="kitchens"
            value={form.kitchens || 0}
            onChange={handleNumberChange}
            icon={<SunIcon className="w-6 h-6" />}
          />
          <NumberStepper
            label="Nº Huéspedes"
            name="guests"
            value={form.guests || 0}
            onChange={handleNumberChange}
            icon={<UserGroupIcon className="w-6 h-6" />}
          />
        </div>
      </div>
    </div>
  );
} 
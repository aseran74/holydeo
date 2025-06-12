import NcInputNumber from "@/components/NcInputNumber";
import React, { FC, ChangeEvent } from "react";
import FormItem from "../FormItem";

export interface PageAddListing3Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing3: FC<PageAddListing3Props> = ({ formData, updateFormData }) => {
  // Handler para el input de superficie
  const handleAcreageChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ acreage: e.target.value });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Tamaño y capacidad</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <FormItem label="Superficie (m2)">
          <input
            type="number"
            min="0"
            className="w-full border rounded px-3 py-2"
            placeholder="Introduce los metros cuadrados"
            value={formData.acreage || ""}
            onChange={handleAcreageChange}
          />
        </FormItem>
        <NcInputNumber label="Huéspedes" defaultValue={formData.guests || 0} onChange={val => updateFormData({ guests: val })} />
        <NcInputNumber label="Habitaciones" defaultValue={formData.bedrooms || 0} onChange={val => updateFormData({ bedrooms: val })} />
        <NcInputNumber label="Camas" defaultValue={formData.beds || 0} onChange={val => updateFormData({ beds: val })} />
        <NcInputNumber label="Baños" defaultValue={formData.bathrooms || 0} onChange={val => updateFormData({ bathrooms: val })} />
        <NcInputNumber label="Cocinas" defaultValue={formData.kitchens || 0} onChange={val => updateFormData({ kitchens: val })} />
      </div>
    </>
  );
};

export default PageAddListing3;

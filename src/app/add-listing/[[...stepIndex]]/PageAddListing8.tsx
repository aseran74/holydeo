import React, { FC, ChangeEvent } from "react";
import Input from "@/shared/Input";
import FormItem from "../FormItem";

export interface PageAddListing8Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing8: FC<PageAddListing8Props> = ({ formData, updateFormData }) => {
  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [field]: e.target.value });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Precio de tu alojamiento</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Elige el precio base para tu propiedad. Todos los precios serán en euros (€).
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <FormItem label="Moneda">
          <div className="flex items-center">
            <span className="text-lg font-semibold mr-2">€</span>
            <span className="text-neutral-500">(Solo euros)</span>
          </div>
        </FormItem>
        <FormItem label="Precio base (Lunes a Jueves)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">€</span>
            </div>
            <Input
              className="!pl-8 !pr-10"
              placeholder="0.00"
              type="number"
              min="0"
              value={formData.basePriceWeekday || ""}
              onChange={handleChange("basePriceWeekday")}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">por noche</span>
            </div>
          </div>
        </FormItem>
        {/* ----- */}
        <FormItem label="Precio base (Viernes a Domingo)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">€</span>
            </div>
            <Input
              className="!pl-8 !pr-10"
              placeholder="0.00"
              type="number"
              min="0"
              value={formData.basePriceWeekend || ""}
              onChange={handleChange("basePriceWeekend")}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">por noche</span>
            </div>
          </div>
        </FormItem>
        {/* ----- */}
        <FormItem label="Precio mensual (alquiler por mes)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">€</span>
            </div>
            <Input
              className="!pl-8 !pr-10"
              placeholder="0.00"
              type="number"
              min="0"
              value={formData.monthlyPrice || ""}
              onChange={handleChange("monthlyPrice")}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">al mes</span>
            </div>
          </div>
        </FormItem>
      </div>
    </>
  );
};

export default PageAddListing8;

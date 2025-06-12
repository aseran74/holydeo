import React, { FC, ChangeEvent } from "react";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";

export interface PageAddListing1Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing1: FC<PageAddListing1Props> = ({ formData, updateFormData }) => {
  // Handler para el select de tipo de propiedad
  const handlePropertyTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ propertyType: e.target.value });
  };

  // Handler para los checkboxes de temporadas
  const handleSeasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let newSeasons = [...(formData.seasons || [])];
    if (e.target.checked) {
      newSeasons.push(value);
    } else {
      newSeasons = newSeasons.filter((s) => s !== value);
    }
    updateFormData({ seasons: newSeasons });
  };

  // Handler para el nombre del lugar
  const handlePlaceNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateFormData({ placeName: e.target.value });
  };

  // Handler para el tipo de alquiler
  const handleRentalFormChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ rentalForm: e.target.value });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">Choosing listing categories</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* ITEM */}
        <FormItem
          label="Choose a property type"
          desc="Selecciona el tipo de propiedad"
        >
          <Select value={formData.propertyType} onChange={handlePropertyTypeChange}>
            <option value="">Selecciona...</option>
            <option value="Piso o apartamento">Piso o apartamento</option>
            <option value="Bajo con jardin">Bajo con jardin</option>
            <option value="Chalet adosado">Chalet adosado</option>
            <option value="Chalet individual">Chalet individual</option>
            <option value="Casa rural">Casa rural</option>
          </Select>
        </FormItem>
        {/* NUEVO: Temporadas disponibles */}
        <FormItem
          label="Temporadas disponibles"
          desc="Selecciona las temporadas en las que está disponible la propiedad"
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              "Sep a Julio",
              "Sep a Junio",
              "Sep a Mayo",
              "Oct a Julio",
              "Oct a Junio",
              "Oct a Mayo",
            ].map((season) => (
              <label key={season} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={season}
                  checked={formData.seasons?.includes(season) || false}
                  onChange={handleSeasonChange}
                  className="accent-blue-600"
                />
                {season}
              </label>
            ))}
          </div>
        </FormItem>
        <FormItem
          label="Zonas"
          desc="Selecciona la zona donde se encuentra la propiedad."
        >
          <Select value={formData.zone || ""} onChange={e => updateFormData({ zone: e.target.value })}>
            <option value="">Selecciona...</option>
            <option value="Asturias">Asturias</option>
            <option value="Baleares">Baleares</option>
            <option value="Canarias">Canarias</option>
            <option value="Costa Catalana">Costa Catalana</option>
            <option value="Costa de levante">Costa de levante</option>
            <option value="Euskadi">Euskadi</option>
            <option value="Galicia">Galicia</option>
            <option value="Marruecos">Marruecos</option>
            <option value="Murcia">Murcia</option>
            <option value="Propiedades en Zonas de interior">Propiedades en Zonas de interior</option>
          </Select>
        </FormItem>
        <FormItem
          label="Rental form"
          desc="Selecciona si alquilas la propiedad entera o solo una habitación."
        >
          <Select value={formData.rentalForm} onChange={handleRentalFormChange}>
            <option value="">Selecciona...</option>
            <option value="alojamiento_entero">Alojamiento entero</option>
            <option value="alquiler_habitacion">Alquiler habitación</option>
          </Select>
        </FormItem>
      </div>
    </>
  );
};

export default PageAddListing1;

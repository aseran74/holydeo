import React, { FC } from "react";
import Checkbox from "@/shared/Checkbox";
import { AMENITIES } from "@/data/amenities";

export interface PageAddListing4Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing4: FC<PageAddListing4Props> = ({ formData, updateFormData }) => {
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    let newAmenities = [...(formData.amenities || [])];
    if (checked) {
      if (!newAmenities.includes(amenity)) newAmenities.push(amenity);
    } else {
      newAmenities = newAmenities.filter((a) => a !== amenity);
    }
    updateFormData({ amenities: newAmenities });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Amenities </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Selecciona los servicios y comodidades que ofrece tu propiedad
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <div>
          <label className="text-lg font-semibold" htmlFor="">
            Servicios disponibles
          </label>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AMENITIES.map((amenity) => (
              <Checkbox
                key={amenity.key}
                label={amenity.label}
                name={amenity.key}
                defaultChecked={formData.amenities?.includes(amenity.key) || false}
                onChange={(checked) => handleAmenityChange(amenity.key, checked)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing4;

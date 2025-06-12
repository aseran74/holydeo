import React, { FC, ChangeEvent } from "react";
import Textarea from "@/shared/Textarea";

export interface PageAddListing6Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing6: FC<PageAddListing6Props> = ({ formData, updateFormData }) => {
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ description: e.target.value });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">
          Descripción del alojamiento para el cliente
        </h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Menciona las mejores características de tu alojamiento, cualquier servicio especial como wifi rápido o parking, y lo que más te gusta del barrio.
        </span>
      </div>

      <Textarea
        placeholder="..."
        rows={14}
        value={formData.description || ""}
        onChange={handleDescriptionChange}
      />
    </>
  );
};

export default PageAddListing6;

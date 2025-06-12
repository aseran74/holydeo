import React, { FC, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export interface PageAddListing7Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing7: FC<PageAddListing7Props> = ({ formData, updateFormData }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const urls: string[] = [];

    for (let file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("imagenes")
        .upload(fileName, file);

      if (error) {
        alert("Error subiendo imagen: " + error.message);
        continue;
      }
      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from("imagenes")
        .getPublicUrl(fileName);
      urls.push(publicUrlData.publicUrl);
    }

    // Actualiza el array de imágenes en el estado global
    updateFormData({ gallery: [...(formData.gallery || []), ...urls] });
    setUploading(false);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Pictures of the place</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Sube fotos bonitas para que tu propiedad destaque.
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        <div>
          <span className="text-lg font-semibold">Imágenes</span>
          <div className="mt-5 ">
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-6000 border-dashed rounded-md">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mb-2"
              />
              {uploading && <p className="text-blue-600">Subiendo imágenes...</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.gallery || []).map((url: string, i: number) => (
                  <img key={i} src={url} alt="" className="w-24 h-24 object-cover rounded" />
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              PNG, JPG, GIF hasta 10MB por imagen
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing7;

import React, { useRef } from "react";
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Puedes personalizar estos arrays e iconos según tu app
const AMENITIES = [
  "Wifi", "Piscina", "Parking", "Aire acondicionado", "Calefacción", "TV", "Cocina equipada", "Lavadora", "Secadora", "Ascensor"
];
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  Wifi: <span>📶</span>,
  Piscina: <span>🏊‍♂️</span>,
  Parking: <span>🅿️</span>,
  "Aire acondicionado": <span>❄️</span>,
  Calefacción: <span>🔥</span>,
  TV: <span>📺</span>,
  "Cocina equipada": <span>🍳</span>,
  Lavadora: <span>🧺</span>,
  Secadora: <span>🌀</span>,
  Ascensor: <span>🛗</span>,
};
const RULES = [
  "No fumar", "No mascotas", "No fiestas", "No niños pequeños"
];
const RULE_ICONS: Record<string, React.ReactNode> = {
  "No fumar": <span>🚭</span>,
  "No mascotas": <span>🐾</span>,
  "No fiestas": <span>🎉</span>,
  "No niños pequeños": <span>🚸</span>,
};

export default function PropertyStep2({ form, updateForm }: { form: any, updateForm: (fields: any) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejador para la selección de imágenes
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const currentFiles = form.gallery || [];
    const newFiles = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    updateForm({ gallery: [...currentFiles, ...newFiles] });
  };

  // Manejador para eliminar una imagen de la galería
  const handleRemoveImage = (index: number) => {
    const currentFiles = [...(form.gallery || [])];
    URL.revokeObjectURL(currentFiles[index].url);
    currentFiles.splice(index, 1);
    updateForm({ gallery: currentFiles });
  };

  // Manejador genérico para amenities y rules
  const handleToggle = (field: 'amenities' | 'rules', value: string) => {
    const current = form[field] || [];
    if (current.includes(value)) {
      updateForm({ [field]: current.filter((item: string) => item !== value) });
    } else {
      updateForm({ [field]: [...current, value] });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Galería, Servicios y Normas</h2>
        <p className="text-gray-500 mt-1">Añade los detalles que harán que tu propiedad destaque.</p>
      </div>
      <div className="space-y-10">
        {/* Sección de Galería de Imágenes */}
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-700">Galería de imágenes*</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400"/>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleGalleryChange}
              className="hidden"
            />
          </div>
          {form.gallery && form.gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {form.gallery.map((image: { url: string }, i: number) => (
                <div key={i} className="relative group">
                  <img src={image.url} alt={`Preview ${i}`} className="w-full h-32 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircleIcon className="w-5 h-5"/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Sección de Servicios/Amenities */}
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-700">Servicios que ofreces</label>
          <div className="flex flex-wrap gap-3">
            {AMENITIES.map((amenity) => (
              <button
                type="button"
                key={amenity}
                onClick={() => handleToggle('amenities', amenity)}
                className={`btn gap-2 ${form.amenities?.includes(amenity) ? 'btn-primary' : 'btn-outline'}`}
              >
                {AMENITY_ICONS[amenity]}
                {amenity}
              </button>
            ))}
          </div>
        </div>
        {/* Sección de Reglas de la casa */}
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-700">Normas de la casa</label>
          <div className="flex flex-wrap gap-3">
            {RULES.map((rule) => (
              <button
                type="button"
                key={rule}
                onClick={() => handleToggle('rules', rule)}
                className={`btn gap-2 ${form.rules?.includes(rule) ? 'btn-error btn-outline' : 'btn-outline'}`}
              >
                {RULE_ICONS[rule]}
                {rule}
              </button>
            ))}
          </div>
        </div>
        {/* Políticas - ahora son Textareas para más detalle */}
        <div className="space-y-3">
           <label className="text-lg font-semibold text-gray-700">Políticas adicionales (opcional)</label>
           <p className="text-sm text-gray-500">Si alguna norma necesita más detalle, explícala aquí.</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea name="smoking_policy" value={form.smoking_policy || ''} onChange={(e) => updateForm({ smoking_policy: e.target.value })} placeholder="Detalles sobre la política de fumar..." className="textarea textarea-bordered w-full" />
                <textarea name="pet_policy" value={form.pet_policy || ''} onChange={(e) => updateForm({ pet_policy: e.target.value })} placeholder="Detalles sobre la política de mascotas..." className="textarea textarea-bordered w-full" />
           </div>
        </div>
      </div>
    </div>
  );
} 
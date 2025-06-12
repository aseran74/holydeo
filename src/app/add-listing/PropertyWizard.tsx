import { useState } from "react";
import PropertyStep1 from "./PropertyStep1";
import PropertyStep2 from "./PropertyStep2";
import PropertyStep3 from "./PropertyStep3";
import PropertyStep4 from "./PropertyStep4";

const initialState = {
  // Página 1
  title: "",
  place_name: "",
  description: "",
  address: "",
  acreage: "",
  bathrooms: "",
  kitchens: "",
  bedrooms: "",
  beds: "",
  guests: "",
  // Página 2
  gallery: [],
  amenities: [],
  rules: [],
  smoking_policy: "",
  pet_policy: "",
  party_policy: "",
  cooking_policy: "",
  // Página 3
  price_weekday: "",
  price_weekend: "",
  price_monthly: "",
  currency: "",
  nights_min: "",
  nights_max: "",
  unavailable_dates: [],
  // Página 4
  special_prices: [], // [{date, price}]
};

export default function PropertyWizard({ property, onSaved }: { property?: any, onSaved?: (data: any) => void }) {
  const [form, setForm] = useState(property || initialState);
  const [step, setStep] = useState(1);

  const updateForm = (fields: Partial<typeof initialState>) => {
    setForm((prev) => ({ ...prev, ...fields }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // Validación de campos obligatorios en el paso 1
  const requiredStep1 = form.title && form.address && form.acreage && form.bathrooms && form.bedrooms && form.guests;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-8">
      <div className="flex justify-between mb-6">
        <div className="text-lg font-bold">Paso {step} de 4</div>
        <div className="space-x-2">
          {step > 1 && <button className="btn btn-secondary" onClick={prev}>Atrás</button>}
          {step < 4 && (
            <button
              className="btn btn-primary"
              onClick={next}
              disabled={step === 1 && !requiredStep1}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
      {step === 1 && <PropertyStep1 form={form} updateForm={updateForm} />}
      {step === 2 && <PropertyStep2 form={form} updateForm={updateForm} />}
      {step === 3 && <PropertyStep3 form={form} updateForm={updateForm} />}
      {step === 4 && <PropertyStep4 form={form} updateForm={updateForm} onSaved={onSaved} />}
    </div>
  );
} 
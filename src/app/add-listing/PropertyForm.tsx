import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

const initialState = {
  title: "",
  description: "",
  address: "",
  price: "",
  seasons: [],
  amenities: [],
  gallery: [],
  details: "",
  property_type: "",
  rental_form: "",
  place_name: "",
  acreage: "",
  guests: "",
  bedrooms: "",
  beds: "",
  bathrooms: "",
  kitchens: "",
  rules: [],
  smoking_policy: "",
  pet_policy: "",
  party_policy: "",
  cooking_policy: "",
  price_weekday: "",
  price_weekend: "",
  price_monthly: "",
  currency: "",
  nights_min: "",
  nights_max: "",
  unavailable_dates: [],
  map: null,
};

export default function PropertyForm({ property, onSaved }: { property?: any, onSaved?: (data: any) => void }) {
  const [form, setForm] = useState(property || initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name: string, value: any[]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Mapeo a snake_case y tipos correctos
    const dbData = {
      ...form,
      price: form.price ? Number(form.price) : null,
      acreage: form.acreage ? Number(form.acreage) : null,
      guests: form.guests ? Number(form.guests) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      beds: form.beds ? Number(form.beds) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      kitchens: form.kitchens ? Number(form.kitchens) : null,
      price_weekday: form.price_weekday ? Number(form.price_weekday) : null,
      price_weekend: form.price_weekend ? Number(form.price_weekend) : null,
      price_monthly: form.price_monthly ? Number(form.price_monthly) : null,
      nights_min: form.nights_min ? Number(form.nights_min) : null,
      nights_max: form.nights_max ? Number(form.nights_max) : null,
      unavailable_dates: form.unavailable_dates,
      map: form.map,
    };

    let result;
    if (form.id) {
      result = await supabase.from("properties").update(dbData).eq("id", form.id);
    } else {
      result = await supabase.from("properties").insert([dbData]);
    }

    if (result.error) {
      setMessage("Error: " + result.error.message);
    } else {
      setMessage("¡Guardado con éxito!");
      if (onSaved) onSaved(result.data?.[0]);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Formulario de Propiedad</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Título*" required className="input input-bordered w-full" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="textarea textarea-bordered w-full" />
      <input name="address" value={form.address} onChange={handleChange} placeholder="Dirección" className="input input-bordered w-full" />
      <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Precio" className="input input-bordered w-full" />
      <input name="place_name" value={form.place_name} onChange={handleChange} placeholder="Nombre del lugar" className="input input-bordered w-full" />
      <input name="property_type" value={form.property_type} onChange={handleChange} placeholder="Tipo de propiedad" className="input input-bordered w-full" />
      <input name="rental_form" value={form.rental_form} onChange={handleChange} placeholder="Forma de alquiler" className="input input-bordered w-full" />
      <input name="acreage" type="number" value={form.acreage} onChange={handleChange} placeholder="Superficie (m2)" className="input input-bordered w-full" />
      <input name="guests" type="number" value={form.guests} onChange={handleChange} placeholder="Huéspedes" className="input input-bordered w-full" />
      <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} placeholder="Habitaciones" className="input input-bordered w-full" />
      <input name="beds" type="number" value={form.beds} onChange={handleChange} placeholder="Camas" className="input input-bordered w-full" />
      <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} placeholder="Baños" className="input input-bordered w-full" />
      <input name="kitchens" type="number" value={form.kitchens} onChange={handleChange} placeholder="Cocinas" className="input input-bordered w-full" />
      <input name="price_weekday" type="number" value={form.price_weekday} onChange={handleChange} placeholder="Precio entre semana" className="input input-bordered w-full" />
      <input name="price_weekend" type="number" value={form.price_weekend} onChange={handleChange} placeholder="Precio fin de semana" className="input input-bordered w-full" />
      <input name="price_monthly" type="number" value={form.price_monthly} onChange={handleChange} placeholder="Precio mensual" className="input input-bordered w-full" />
      <input name="currency" value={form.currency} onChange={handleChange} placeholder="Moneda" className="input input-bordered w-full" />
      <input name="nights_min" type="number" value={form.nights_min} onChange={handleChange} placeholder="Noches mínimas" className="input input-bordered w-full" />
      <input name="nights_max" type="number" value={form.nights_max} onChange={handleChange} placeholder="Noches máximas" className="input input-bordered w-full" />
      <input name="smoking_policy" value={form.smoking_policy} onChange={handleChange} placeholder="Política de fumar" className="input input-bordered w-full" />
      <input name="pet_policy" value={form.pet_policy} onChange={handleChange} placeholder="Política de mascotas" className="input input-bordered w-full" />
      <input name="party_policy" value={form.party_policy} onChange={handleChange} placeholder="Política de fiestas" className="input input-bordered w-full" />
      <input name="cooking_policy" value={form.cooking_policy} onChange={handleChange} placeholder="Política de cocina" className="input input-bordered w-full" />
      <textarea name="details" value={form.details} onChange={handleChange} placeholder="Detalles adicionales" className="textarea textarea-bordered w-full" />
      {/* Arrays y campos especiales pueden tener componentes personalizados */}
      {/* Ejemplo para amenities (checkbox múltiple): */}
      <div>
        <label className="block font-semibold">Servicios/Amenities (separados por coma)</label>
        <input
          name="amenities"
          value={form.amenities.join(",")}
          onChange={e => handleArrayChange("amenities", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
          placeholder="wifi, piscina, parking..."
          className="input input-bordered w-full"
        />
      </div>
      {/* Repite para seasons, rules, gallery, unavailable_dates si lo necesitas */}
      <button type="submit" disabled={loading} className="btn btn-primary w-full">{loading ? "Guardando..." : "Guardar"}</button>
      {message && <div className="mt-2 text-center">{message}</div>}
    </form>
  );
} 
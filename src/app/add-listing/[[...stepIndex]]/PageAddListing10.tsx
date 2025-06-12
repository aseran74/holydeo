"use client";
import StayCard from "@/components/StayCard";
import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Route } from "@/routers/types";
import { supabase } from "@/utils/supabaseClient";

export interface PageAddListing10Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const PageAddListing10: FC<PageAddListing10Props> = ({ formData }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Obtiene el usuario y su rol
  React.useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Busca el perfil para saber el rol
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    })();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    // Obtiene el usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    let user_id = user?.id || null;
    // Si es admin y formData.user_id está presente, permite cambiar el propietario
    if (isAdmin && formData.user_id) {
      user_id = formData.user_id;
    }

    // Mapeo camelCase a snake_case para la tabla de Supabase
    const dbData = {
      id: formData.id,
      title: formData.title || formData.placeName || "Sin título",
      description: formData.description || formData.details || "",
      address: formData.address || "",
      price: formData.price ?? null,
      seasons: formData.seasons || [],
      amenities: formData.amenities || [],
      gallery: formData.gallery || [],
      details: formData.details || formData.description || "",
      property_type: formData.propertyType || "",
      rental_form: formData.rentalForm || "",
      place_name: formData.placeName || formData.title || "",
      acreage: formData.acreage ?? null,
      guests: formData.guests ?? null,
      bedrooms: formData.bedrooms ?? null,
      beds: formData.beds ?? null,
      bathrooms: formData.bathrooms ?? null,
      kitchens: formData.kitchens ?? null,
      rules: formData.rules || [],
      smoking_policy: formData.smoking_policy || "",
      pet_policy: formData.pet_policy || "",
      party_policy: formData.party_policy || "",
      cooking_policy: formData.cooking_policy || "",
      price_weekday: formData.basePriceWeekday ?? formData.price_weekday ?? null,
      price_weekend: formData.basePriceWeekend ?? formData.price_weekend ?? null,
      price_monthly_discount: formData.monthlyPrice ?? formData.price_monthly_discount ?? null,
      currency: formData.currency || "",
      nights_min: formData.minNights ?? formData.nights_min ?? 1,
      nights_max: formData.maxNights ?? formData.nights_max ?? 99,
      unavailable_dates: formData.blockedDates || formData.unavailable_dates || [],
      user_id: user_id,
    };

    console.log("[GUARDAR] dbData a enviar:", dbData);

    let data, error;
    if (formData.id) {
      // Edición: update
      ({ data, error } = await supabase
        .from("properties")
        .update(dbData)
        .eq("id", formData.id));
    } else {
      // Alta: insert (NO enviar id)
      const { id, ...insertData } = dbData;
      ({ data, error } = await supabase
        .from("properties")
        .insert([insertData]));
    }

    console.log("[GUARDAR] Respuesta Supabase:", { data, error });

    if (error) {
      setMessage("Error guardando: " + error.message);
    } else {
      setMessage(`¡Propiedad guardada con éxito! (${isAdmin ? "Admin" : "Usuario"})`);
    }
    setLoading(false);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">¡Felicidades 🎉!</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Has completado el alta, tu propiedad está lista para revisión y publicación.
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div>
        <h3 className="text-lg font-semibold">Resumen de tu propiedad</h3>
        <div className="max-w-xs">
          <StayCard
            className="mt-8"
            data={{ /* aquí deberías pasar los datos reales o props */ }}
          />
        </div>
        <div className="flex items-center space-x-5 mt-8">
          <ButtonSecondary href={"/add-listing/1" as Route}>
            <PencilSquareIcon className="h-5 w-5" />
            <span className="ml-3">Editar</span>
          </ButtonSecondary>

          <ButtonPrimary onClick={handleSave} disabled={loading}>
            <EyeIcon className="h-5 w-5" />
            <span className="ml-3">Guardar en Supabase</span>
          </ButtonPrimary>
        </div>
        {message && <div className="mt-4 text-green-600">{message}</div>}
      </div>
      {/*  */}
    </>
  );
};

export default PageAddListing10;

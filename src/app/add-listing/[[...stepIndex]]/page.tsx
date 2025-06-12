"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/utils/supabaseClient";
import PageAddListing1 from "./PageAddListing1";
import PageAddListing2 from "./PageAddListing2";
import PageAddListing3 from "./PageAddListing3";
import PageAddListing4 from "./PageAddListing4";
import PageAddListing5 from "./PageAddListing5";
import PageAddListing6 from "./PageAddListing6";
import PageAddListing7 from "./PageAddListing7";
import PageAddListing8 from "./PageAddListing8";
import PageAddListing9 from "./PageAddListing9";
import PageAddListing10 from "./PageAddListing10";
import { useParams } from "next/navigation";

const steps = [
  PageAddListing1,
  PageAddListing2,
  PageAddListing3,
  PageAddListing4,
  PageAddListing5,
  PageAddListing6,
  PageAddListing7,
  PageAddListing8,
  PageAddListing9,
  PageAddListing10,
];

const initialFormData = {};

const mapToCamelCase = (data: any) => {
  if (!data) return {};
  const {
    property_type, place_name, rental_form, price_weekday,
    price_weekend, price_monthly_discount, nights_min,
    nights_max, unavailable_dates, ...rest
  } = data;

  return {
    ...rest,
    propertyType: property_type,
    placeName: place_name,
    rentalForm: rental_form,
    basePriceWeekday: price_weekday,
    basePriceWeekend: price_weekend,
    monthlyPrice: price_monthly_discount,
    minNights: nights_min,
    maxNights: nights_max,
    blockedDates: unavailable_dates,
  };
};

export default function AddListingStepPage() {
  const params = useParams();
  const { stepIndex: stepParams } = params;
  
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);

  const { propertyId, currentStep } = useMemo(() => {
    let pid: string | undefined = undefined;
    let cStep: number = 1;

    if (Array.isArray(stepParams) && stepParams.length > 1) {
      pid = stepParams[0]; // UUID
      cStep = parseInt(stepParams[1], 10) || 1;
    } else if (Array.isArray(stepParams) && stepParams.length === 1) {
      const isNumeric = !isNaN(Number(stepParams[0]));
      if (isNumeric) {
        cStep = parseInt(stepParams[0], 10); // Modo creación
      } else {
        pid = stepParams[0]; // Modo edición, paso 1 implícito
        cStep = 1;
      }
    } else if (typeof stepParams === 'string' && !isNaN(Number(stepParams))) {
        cStep = parseInt(stepParams, 10);
    }

    return { propertyId: pid, currentStep: cStep };
  }, [stepParams]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) {
        setFormData(initialFormData);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();
      
      setFormData(data ? mapToCamelCase(data) : initialFormData);
      setLoading(false);
    };

    fetchPropertyData();
  }, [propertyId]);

  const updateFormData = (fields: Partial<any>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const StepComponent = steps[currentStep - 1] || steps[0];

  if (loading) {
    return <div>Cargando datos de la propiedad...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <StepComponent formData={formData} updateFormData={updateFormData} />
    </div>
  );
}

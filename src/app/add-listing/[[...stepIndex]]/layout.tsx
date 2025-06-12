"use client";
import React, { FC } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { Route } from "@/routers/types";
import { useParams } from "next/navigation";

export interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const params = useParams();
  const { stepIndex } = params;

  let propertyId: string | undefined = undefined;
  let currentStep: number = 1;

  if (Array.isArray(stepIndex)) {
    // Si la URL es /id/step
    if (stepIndex.length > 1) {
      propertyId = stepIndex[0];
      currentStep = parseInt(stepIndex[1], 10) || 1;
    } else {
      // Si la URL es /step (creación) o /id (edición, paso 1)
      const isNumeric = !isNaN(Number(stepIndex[0]));
      if (isNumeric) {
        currentStep = parseInt(stepIndex[0], 10);
      } else {
        propertyId = stepIndex[0];
        currentStep = 1; // Asumimos paso 1 si solo hay ID
      }
    }
  }

  const baseHref = propertyId ? `/add-listing/${propertyId}` : '/add-listing';
  
  const nextHref = (
    currentStep < 10 ? `${baseHref}/${currentStep + 1}` : `/add-listing/10`
  ) as Route;
  const backHref = (
    currentStep > 1 ? `${baseHref}/${currentStep - 1}` : `/add-listing/1`
  ) as Route;
  
  const nextBtnText = currentStep >= 10 ? "Guardar y finalizar" : "Continuar";
  
  return (
    <div
      className={`nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}
    >
      <div className="space-y-11">
        <div>
          <span className="text-4xl font-semibold">{currentStep}</span>{" "}
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            / 10
          </span>
        </div>

        {/* --------------------- */}
        <div className="listingSection__wrap ">{children}</div>

        {/* --------------------- */}
        <div className="flex justify-end space-x-5">
          <ButtonSecondary href={backHref}>Atrás</ButtonSecondary>
          <ButtonPrimary href={nextHref}>
            {nextBtnText}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;

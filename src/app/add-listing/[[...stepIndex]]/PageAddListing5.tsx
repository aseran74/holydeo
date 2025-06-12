import React, { FC, useState, ChangeEvent, FormEvent } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";

export interface PageAddListing5Props {
  formData: any;
  updateFormData: (fields: Partial<any>) => void;
}

const RULES = [
  { key: "smoking", label: "Smoking" },
  { key: "pet", label: "Pet" },
  { key: "party", label: "Party organizing" },
  { key: "cooking", label: "Cooking" },
];

const OPTIONS = [
  { value: "Do not allow", label: "No permitir" },
  { value: "Allow", label: "Permitir" },
  { value: "Charge", label: "Cobrar" },
];

const PageAddListing5: FC<PageAddListing5Props> = ({ formData, updateFormData }) => {
  const [newRule, setNewRule] = useState("");

  const handleRadioChange = (ruleKey: string, value: string) => {
    updateFormData({
      houseRules: {
        ...formData.houseRules,
        [ruleKey]: value,
      },
    });
  };

  const handleAddRule = (e: FormEvent) => {
    e.preventDefault();
    if (newRule.trim()) {
      updateFormData({
        additionalRules: [...(formData.additionalRules || []), newRule.trim()],
      });
      setNewRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    const updated = (formData.additionalRules || []).filter((_, i) => i !== index);
    updateFormData({ additionalRules: updated });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Reglas de la casa</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Los huéspedes deben aceptar estas reglas antes de reservar.
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {RULES.map((rule) => (
          <div key={rule.key}>
            <label className="text-lg font-semibold" htmlFor="">
              {rule.label}
            </label>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center">
                  <input
                    type="radio"
                    name={rule.key}
                    value={opt.value}
                    checked={formData.houseRules?.[rule.key] === opt.value}
                    onChange={() => handleRadioChange(rule.key, opt.value)}
                    className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300 !checked:bg-primary-500 bg-transparent"
                  />
                  <span className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className=" border-b border-neutral-200 dark:border-neutral-700"></div>
        <span className="block text-lg font-semibold">Reglas adicionales</span>
        <div className="flow-root">
          <div className="-my-3 divide-y divide-neutral-100 dark:divide-neutral-800">
            {(formData.additionalRules || []).map((rule: string, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <span className="text-neutral-6000 dark:text-neutral-400 font-medium">
                  {rule}
                </span>
                <i
                  className="text-2xl text-neutral-400 las la-times-circle hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer"
                  onClick={() => handleRemoveRule(idx)}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleAddRule} className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-5">
          <Input
            className="!h-full"
            placeholder="Ej: No fumar en zonas comunes..."
            value={newRule}
            onChange={e => setNewRule(e.target.value)}
          />
          <ButtonPrimary className="flex-shrink-0" type="submit">
            <i className="text-xl las la-plus"></i>
            <span className="ml-3">Añadir regla</span>
          </ButtonPrimary>
        </form>
      </div>
    </>
  );
};

export default PageAddListing5;

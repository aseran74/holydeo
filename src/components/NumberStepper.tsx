import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

interface NumberStepperProps {
  label: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  icon?: React.ReactNode;
}

export default function NumberStepper({ label, name, value, onChange, icon }: NumberStepperProps) {
  const handleIncrement = () => {
    onChange(name, value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) {
      onChange(name, value - 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center gap-3">
        {icon && <span className="text-primary">{icon}</span>}
        <label className="font-medium text-gray-700">{label}</label>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          className="btn btn-circle btn-outline btn-sm"
          disabled={value <= 0}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="text-lg font-bold w-8 text-center">{value}</span>
        <button
          type="button"
          onClick={handleIncrement}
          className="btn btn-circle btn-primary btn-sm"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
} 
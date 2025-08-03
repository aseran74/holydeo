import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  className?: string;
}

const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  label,
  className = ""
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const displayValue = value === 0 ? "Cualquiera" : value.toString();

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            value <= min
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow-md'
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="flex-1 text-center">
          <span className="text-lg font-semibold text-gray-800">
            {displayValue}
          </span>
        </div>
        
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
            value >= max
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 shadow-sm hover:shadow-md'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NumberStepper; 
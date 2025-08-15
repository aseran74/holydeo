import React from 'react';
import { Euro } from 'lucide-react';

interface PriceTagProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
  showPerDay?: boolean;
  className?: string;
}

const PriceTag: React.FC<PriceTagProps> = ({ 
  price, 
  size = 'md', 
  showPerDay = true,
  className = '' 
}) => {
  const formatPrice = (price: number) => {
    if (!price || price <= 0) return 'Consultar';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300 ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center justify-center space-x-1">
        <Euro className={`${iconSizes[size]} text-yellow-300`} />
        <span className="font-extrabold tracking-wide">
          {formatPrice(price)}
        </span>
      </div>
      {showPerDay && price > 0 && (
        <div className="text-xs text-blue-100 text-center mt-1 font-medium">
          por día
        </div>
      )}
    </div>
  );
};

export default PriceTag;

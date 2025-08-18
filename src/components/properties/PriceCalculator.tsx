import React, { useState, useEffect } from 'react';
import { Calendar, Calculator, Euro, CalendarDays } from 'lucide-react';
import { PriceCalculationService, PropertyPricing, PriceCalculationResult } from '../../services/priceCalculationService';

interface PriceCalculatorProps {
  pricing: PropertyPricing;
  onPriceCalculated?: (result: PriceCalculationResult) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ 
  pricing, 
  onPriceCalculated 
}) => {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [calculationResult, setCalculationResult] = useState<PriceCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Fechas mínimas (hoy y mañana)
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    if (checkIn && checkOut) {
      calculatePrice();
    }
  }, [checkIn, checkOut]);

  const calculatePrice = () => {
    if (!checkIn || !checkOut) return;

    setIsCalculating(true);
    
    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      if (checkInDate >= checkOutDate) {
        setCalculationResult(null);
        return;
      }

      const result = PriceCalculationService.calculatePriceForDateRange(
        checkInDate,
        checkOutDate,
        pricing
      );

      setCalculationResult(result);
      onPriceCalculated?.(result);
    } catch (error) {
      console.error('Error calculating price:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getDateRangeLabel = () => {
    if (!checkIn || !checkOut) return 'Selecciona fechas';
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return `${nights} ${nights === 1 ? 'noche' : 'noches'}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Calculadora de Precios</h3>
      </div>

      {/* Campos de fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="inline h-4 w-4 mr-2" />
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar className="inline h-4 w-4 mr-2" />
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || tomorrow}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Información de precios base */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Precio por noche</h4>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Precio por día:</span>
          <span className="font-medium text-lg">
            {PriceCalculationService.formatPrice(pricing.precio_dia || pricing.precio_entresemana)}
          </span>
        </div>
        {pricing.precio_dia ? (
          <p className="text-xs text-gray-500 mt-2">Usando precio por día configurado</p>
        ) : (
          <p className="text-xs text-gray-500 mt-2">Usando precio de entresemana como referencia</p>
        )}
      </div>

      {/* Resultado del cálculo */}
      {calculationResult && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Euro className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Precio calculado para {getDateRangeLabel()}
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {PriceCalculationService.formatPrice(calculationResult.totalPrice)}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {PriceCalculationService.formatPrice(calculationResult.breakdown.averagePricePerDay)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Por noche</div>
            </div>
          </div>

          {/* Desglose detallado */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {calculationResult.details.totalDays} noches × {PriceCalculationService.formatPrice(calculationResult.details.pricePerDay)}
              </span>
              <span className="font-medium">
                {PriceCalculationService.formatPrice(calculationResult.totalPrice)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {isCalculating && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Calculando precio...</p>
        </div>
      )}

      {/* Mensaje de error si las fechas son inválidas */}
      {checkIn && checkOut && new Date(checkIn) >= new Date(checkOut) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
          <p className="text-red-600 dark:text-red-400 text-sm">
            La fecha de salida debe ser posterior a la fecha de entrada
          </p>
        </div>
      )}
    </div>
  );
};

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

      // Usar el método de debug para ver qué está pasando
      const result = PriceCalculationService.debugCalculation(
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

  const getDailyBreakdown = () => {
    if (!checkIn || !checkOut || !calculationResult) return [];
    
    const dates = PriceCalculationService.getDatesBetween(new Date(checkIn), new Date(checkOut));
    return dates.map(date => {
      const dayPrice = PriceCalculationService.getPriceForDate(date, pricing);
      return {
        date,
        price: dayPrice.price,
        dayType: dayPrice.dayType,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'long' })
      };
    });
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
            {PriceCalculationService.formatPrice(PriceCalculationService.calculatePricePerNight(pricing))}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Promedio entre semana (€{pricing.precio_entresemana}) y fin de semana (€{pricing.precio_fin_de_semana})
        </p>
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
                {calculationResult.details.weekdays} días entre semana × {PriceCalculationService.formatPrice(calculationResult.details.weekdayPrice)}
              </span>
              <span className="font-medium">
                {PriceCalculationService.formatPrice(calculationResult.details.weekdays * calculationResult.details.weekdayPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {calculationResult.details.weekends} días fin de semana × {PriceCalculationService.formatPrice(calculationResult.details.weekendPrice)}
              </span>
              <span className="font-medium">
                {PriceCalculationService.formatPrice(calculationResult.details.weekends * calculationResult.details.weekendPrice)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span className="text-gray-700 dark:text-gray-300">Total:</span>
              <span className="text-blue-600 dark:text-blue-400">
                {PriceCalculationService.formatPrice(calculationResult.totalPrice)}
              </span>
            </div>
          </div>

          {/* Desglose día a día */}
          <div className="mt-4">
            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Desglose día a día:</h5>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {getDailyBreakdown().map((day, index) => (
                <div key={index} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{day.dayName}</span>
                    <span className="text-gray-500">
                      {day.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      day.dayType === 'Entre semana' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {day.dayType}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {PriceCalculationService.formatPrice(day.price)}
                  </span>
                </div>
              ))}
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

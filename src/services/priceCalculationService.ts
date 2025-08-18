export interface PropertyPricing {
  precio_entresemana: number;
  precio_fin_de_semana: number;
  precio_dia?: number;
  precio_mes?: number;
}

export interface PriceCalculationResult {
  totalPrice: number;
  breakdown: {
    totalDays: number;
    averagePricePerDay: number;
  };
  details: {
    totalDays: number;
    pricePerDay: number;
  };
}

export class PriceCalculationService {
  /**
   * Calcular el precio total para un rango de fechas usando precio_dia
   */
  static calculatePriceForDateRange(
    checkIn: Date,
    checkOut: Date,
    pricing: PropertyPricing
  ): PriceCalculationResult {
    const dates = this.getDatesBetween(checkIn, checkOut);
    const totalDays = dates.length;
    
    // Usar precio_dia si está disponible, sino usar precio_entresemana como fallback
    const pricePerDay = pricing.precio_dia || pricing.precio_entresemana;
    const totalPrice = totalDays * pricePerDay;
    const averagePricePerDay = totalDays > 0 ? totalPrice / totalDays : 0;

    return {
      totalPrice,
      breakdown: {
        totalDays,
        averagePricePerDay
      },
      details: {
        totalDays,
        pricePerDay
      }
    };
  }

  /**
   * Obtener todas las fechas entre check-in y check-out
   */
  static getDatesBetween(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    // No incluir la fecha de check-out (solo noches)
    while (currentDate < endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  /**
   * Formatear precio en formato de moneda
   */
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(price);
  }

  /**
   * Calcular precio por noche individual usando precio_dia
   */
  static calculatePricePerNight(pricing: PropertyPricing): number {
    return pricing.precio_dia || pricing.precio_entresemana;
  }

  /**
   * Obtener descripción del tipo de día (ahora siempre es "por día")
   */
  static getDayTypeDescription(): string {
    return 'Por día';
  }

  /**
   * Calcular descuento por estadía larga (si aplica)
   */
  static calculateLongStayDiscount(
    totalDays: number,
    basePrice: number,
    discountThreshold: number = 7,
    discountPercentage: number = 0.1
  ): { discountedPrice: number; discountAmount: number } {
    if (totalDays >= discountThreshold) {
      const discountAmount = basePrice * discountPercentage;
      const discountedPrice = basePrice - discountAmount;
      return { discountedPrice, discountAmount };
    }
    return { discountedPrice: basePrice, discountAmount: 0 };
  }
}

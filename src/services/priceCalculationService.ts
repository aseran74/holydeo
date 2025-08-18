export interface PropertyPricing {
  precio_entresemana: number;
  precio_fin_de_semana: number;
  precio_dia?: number;
  precio_mes?: number;
}

export interface PriceCalculationResult {
  totalPrice: number;
  breakdown: {
    weekdays: number;
    weekendDays: number;
    totalDays: number;
    averagePricePerDay: number;
  };
  details: {
    weekdaysCount: number;
    weekendDaysCount: number;
    weekdaysPrice: number;
    weekendPrice: number;
  };
}

export class PriceCalculationService {
  /**
   * Calcular si una fecha es fin de semana (sábado o domingo)
   */
  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = domingo, 6 = sábado
  }

  /**
   * Calcular el precio total para un rango de fechas
   */
  static calculatePriceForDateRange(
    checkIn: Date,
    checkOut: Date,
    pricing: PropertyPricing
  ): PriceCalculationResult {
    const dates = this.getDatesBetween(checkIn, checkOut);
    let weekdaysCount = 0;
    let weekendDaysCount = 0;

    // Contar días de entresemana y fin de semana
    dates.forEach(date => {
      if (this.isWeekend(date)) {
        weekendDaysCount++;
      } else {
        weekdaysCount++;
      }
    });

    // Calcular precios
    const weekdaysPrice = weekdaysCount * pricing.precio_entresemana;
    const weekendPrice = weekendDaysCount * pricing.precio_fin_de_semana;
    const totalPrice = weekdaysPrice + weekendPrice;
    const totalDays = dates.length;
    const averagePricePerDay = totalDays > 0 ? totalPrice / totalDays : 0;

    return {
      totalPrice,
      breakdown: {
        weekdays: weekdaysCount,
        weekendDays: weekendDaysCount,
        totalDays,
        averagePricePerDay
      },
      details: {
        weekdaysCount,
        weekendDaysCount,
        weekdaysPrice,
        weekendPrice
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
   * Calcular precio por noche individual
   */
  static calculatePricePerNight(
    date: Date,
    pricing: PropertyPricing
  ): number {
    return this.isWeekend(date) ? pricing.precio_fin_de_semana : pricing.precio_entresemana;
  }

  /**
   * Obtener descripción del tipo de día
   */
  static getDayTypeDescription(date: Date): string {
    return this.isWeekend(date) ? 'Fin de semana' : 'Entresemana';
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

export interface PropertyPricing {
  precio_entresemana: number;
  precio_fin_de_semana: number;
  precio_mes?: number;
}

export interface PriceCalculationResult {
  totalPrice: number;
  breakdown: {
    totalDays: number;
    weekdays: number;
    weekends: number;
    averagePricePerDay: number;
  };
  details: {
    totalDays: number;
    weekdays: number;
    weekends: number;
    weekdayPrice: number;
    weekendPrice: number;
  };
}

export class PriceCalculationService {
  /**
   * Calcular el precio total para un rango de fechas día a día
   */
  static calculatePriceForDateRange(
    checkIn: Date,
    checkOut: Date,
    pricing: PropertyPricing
  ): PriceCalculationResult {
    const dates = this.getDatesBetween(checkIn, checkOut);
    const totalDays = dates.length;
    
    let weekdays = 0;
    let weekends = 0;
    let totalPrice = 0;
    const dailyPrices: { date: Date; price: number; dayType: string }[] = [];
    
    // Calcular precio para cada día individual
    dates.forEach(date => {
      const dayOfWeek = date.getDay();
      let dayPrice: number;
      let dayType: string;
      
      // getDay() devuelve: 0=domingo, 1=lunes, 2=martes, 3=miércoles, 4=jueves, 5=viernes, 6=sábado
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Entre semana (lunes=1 a viernes=5)
        dayPrice = pricing.precio_entresemana;
        dayType = 'Entre semana';
        weekdays++;
      } else {
        // Fin de semana (sábado=6, domingo=0)
        dayPrice = pricing.precio_fin_de_semana;
        dayType = 'Fin de semana';
        weekends++;
      }
      
      totalPrice += dayPrice;
      dailyPrices.push({ date, price: dayPrice, dayType });
    });
    
    const averagePricePerDay = totalDays > 0 ? totalPrice / totalDays : 0;

    return {
      totalPrice,
      breakdown: {
        totalDays,
        weekdays,
        weekends,
        averagePricePerDay
      },
      details: {
        totalDays,
        weekdays,
        weekends,
        weekdayPrice: pricing.precio_entresemana,
        weekendPrice: pricing.precio_fin_de_semana
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
   * Calcular precio promedio por noche (promedio entre entre semana y fin de semana)
   */
  static calculatePricePerNight(pricing: PropertyPricing): number {
    return (pricing.precio_entresemana + pricing.precio_fin_de_semana) / 2;
  }

  /**
   * Obtener el precio para un día específico
   */
  static getPriceForDate(date: Date, pricing: PropertyPricing): { price: number; dayType: string } {
    const dayOfWeek = date.getDay();
    
    // getDay() devuelve: 0=domingo, 1=lunes, 2=martes, 3=miércoles, 4=jueves, 5=viernes, 6=sábado
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Entre semana (lunes=1 a viernes=5)
      return { price: pricing.precio_entresemana, dayType: 'Entre semana' };
    } else {
      // Fin de semana (sábado=6, domingo=0)
      return { price: pricing.precio_fin_de_semana, dayType: 'Fin de semana' };
    }
  }

  /**
   * Obtener descripción del tipo de día (ahora siempre es "por día")
   */
  static getDayTypeDescription(): string {
    return 'Por día (entre semana/fin de semana)';
  }

  /**
   * Método de debug para probar el cálculo
   */
  static debugCalculation(checkIn: Date, checkOut: Date, pricing: PropertyPricing) {
    console.log('=== DEBUG PRICE CALCULATION ===');
    console.log('Check-in:', checkIn.toLocaleDateString('es-ES'));
    console.log('Check-out:', checkOut.toLocaleDateString('es-ES'));
    console.log('Precio entre semana (lunes-viernes):', pricing.precio_entresemana);
    console.log('Precio fin de semana (sábado-domingo):', pricing.precio_fin_de_semana);
    
    const dates = this.getDatesBetween(checkIn, checkOut);
    console.log('Número de días:', dates.length);
    
    dates.forEach((date, index) => {
      const dayOfWeek = date.getDay();
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
      const dayPrice = this.getPriceForDate(date, pricing);
      console.log(`Día ${index + 1}: ${dayName} (${dayOfWeek}) - ${dayPrice.dayType} - €${dayPrice.price}`);
    });
    
    const result = this.calculatePriceForDateRange(checkIn, checkOut, pricing);
    console.log('Resultado total:', result.totalPrice);
    console.log('Días entre semana:', result.details.weekdays);
    console.log('Días fin de semana:', result.details.weekends);
    console.log('================================');
    
    return result;
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

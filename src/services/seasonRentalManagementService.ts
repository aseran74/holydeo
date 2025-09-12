import { supabase } from '../supabaseClient';

export interface SeasonRental {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  start_date: string;
  end_date: string;
  guests_count: number;
  monthly_price: number;
  total_months: number;
  total_price: number;
  message?: string;
  source: string;
  user_id?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface SeasonRentalWithProperty extends SeasonRental {
  properties: {
    title: string;
    location: string;
    main_image_path?: string;
  };
}

export class SeasonRentalManagementService {
  /**
   * Confirma una reserva de larga estancia
   */
  static async confirmSeasonRental(rentalId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Iniciando confirmación de reserva de larga estancia:', rentalId);
      
      // 1. Obtener la reserva
      const { data: rental, error: fetchError } = await supabase
        .from('season_rentals')
        .select('*')
        .eq('id', rentalId)
        .single();

      if (fetchError || !rental) {
        console.error('❌ Error al obtener la reserva de larga estancia:', fetchError);
        return { success: false, message: 'Reserva de larga estancia no encontrada' };
      }

      console.log('📋 Reserva de larga estancia obtenida:', rental);

      // 2. Verificar que la reserva esté pendiente
      if (rental.status !== 'pending') {
        console.log('⚠️ La reserva ya no está pendiente, estado actual:', rental.status);
        return { success: false, message: 'La reserva ya no está pendiente' };
      }

      console.log('✅ Reserva está pendiente, procediendo a confirmar...');

      // 3. Actualizar el estado de la reserva a confirmada
      const { error: updateError } = await supabase
        .from('season_rentals')
        .update({ 
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', rentalId);

      if (updateError) {
        console.error('❌ Error al actualizar la reserva de larga estancia:', updateError);
        return { success: false, message: 'Error al confirmar la reserva de larga estancia' };
      }

      console.log('✅ Reserva de larga estancia actualizada exitosamente');
      return { 
        success: true, 
        message: 'Reserva de larga estancia confirmada exitosamente' 
      };

    } catch (error) {
      console.error('💥 Error inesperado en confirmSeasonRental:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Rechaza una reserva de larga estancia
   */
  static async rejectSeasonRental(rentalId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('season_rentals')
        .update({ 
          status: 'rejected',
          message: reason ? `Rechazada: ${reason}` : 'Rechazada por el administrador',
          updated_at: new Date().toISOString()
        })
        .eq('id', rentalId);

      if (error) {
        return { success: false, message: 'Error al rechazar la reserva de larga estancia' };
      }

      return { success: true, message: 'Reserva de larga estancia rechazada exitosamente' };
    } catch (error) {
      console.error('Error rejecting season rental:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Cancela una reserva de larga estancia confirmada
   */
  static async cancelSeasonRental(rentalId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Obtener la reserva
      const { data: rental, error: fetchError } = await supabase
        .from('season_rentals')
        .select('*')
        .eq('id', rentalId)
        .single();

      if (fetchError || !rental) {
        return { success: false, message: 'Reserva de larga estancia no encontrada' };
      }

      // 2. Verificar que la reserva esté confirmada
      if (rental.status !== 'confirmed') {
        return { success: false, message: 'Solo se pueden cancelar reservas confirmadas' };
      }

      // 3. Actualizar el estado de la reserva a cancelada
      const { error: updateError } = await supabase
        .from('season_rentals')
        .update({ 
          status: 'cancelled',
          message: reason ? `Cancelada: ${reason}` : 'Cancelada por el administrador',
          updated_at: new Date().toISOString()
        })
        .eq('id', rentalId);

      if (updateError) {
        return { success: false, message: 'Error al cancelar la reserva de larga estancia' };
      }

      return { 
        success: true, 
        message: 'Reserva de larga estancia cancelada exitosamente' 
      };

    } catch (error) {
      console.error('Error cancelling season rental:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene todas las reservas de larga estancia con información de la propiedad
   */
  static async getAllSeasonRentals(): Promise<{ data: SeasonRentalWithProperty[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('season_rentals')
        .select(`
          *,
          properties (
            title,
            location,
            main_image_path
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching season rentals:', error);
      return { data: null, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene las reservas de larga estancia por estado
   */
  static async getSeasonRentalsByStatus(status: string): Promise<{ data: SeasonRentalWithProperty[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('season_rentals')
        .select(`
          *,
          properties (
            title,
            location,
            main_image_path
          )
        `)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching season rentals by status:', error);
      return { data: null, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene estadísticas de reservas de larga estancia
   */
  static async getSeasonRentalStats(): Promise<{ data: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('season_rentals')
        .select('status');

      if (error) {
        return { data: null, error: error.message };
      }

      const stats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        confirmed: data.filter(r => r.status === 'confirmed').length,
        rejected: data.filter(r => r.status === 'rejected').length,
        cancelled: data.filter(r => r.status === 'cancelled').length
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching season rental stats:', error);
      return { data: null, error: 'Error interno del servidor' };
    }
  }
}

import { supabase } from '../supabaseClient';

export interface Booking {
  id: string;
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  message?: string;
  source: string;
  user_id?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
  nights: number;
  notes?: string;
}

export interface BlockedDate {
  id: string;
  property_id: string;
  date: string;
  source: 'manual' | 'ical' | 'booking';
  created_at: string;
}

export class BookingManagementService {
  /**
   * Confirma una reserva y bloquea automáticamente las fechas
   */
  static async confirmBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Iniciando confirmación de reserva:', bookingId);
      
      // 1. Obtener la reserva
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError || !booking) {
        console.error('❌ Error al obtener la reserva:', fetchError);
        return { success: false, message: 'Reserva no encontrada' };
      }

      console.log('📋 Reserva obtenida:', booking);

      // 2. Verificar que la reserva esté pendiente
      if (booking.status !== 'pending') {
        console.log('⚠️ La reserva ya no está pendiente, estado actual:', booking.status);
        return { success: false, message: 'La reserva ya no está pendiente' };
      }

      console.log('✅ Reserva está pendiente, procediendo a confirmar...');

      // 3. Actualizar el estado de la reserva a confirmada
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('❌ Error al actualizar la reserva:', updateError);
        return { success: false, message: 'Error al confirmar la reserva' };
      }

      console.log('✅ Reserva actualizada exitosamente');

      // 4. Bloquear las fechas de la reserva
      console.log('🔒 Iniciando bloqueo de fechas...');
      const blockedDatesResult = await this.blockDatesForBooking(booking);
      
      if (!blockedDatesResult.success) {
        console.error('❌ Error al bloquear fechas:', blockedDatesResult.message);
        // Si falla el bloqueo de fechas, revertir la confirmación
        console.log('🔄 Revertiendo confirmación...');
        const { error: revertError } = await supabase
          .from('bookings')
          .update({ 
            status: 'pending',
            updated_at: new Date().toISOString()
          })
          .eq('id', bookingId);
        
        if (revertError) {
          console.error('❌ Error al revertir la confirmación:', revertError);
        }
          
        return { 
          success: false, 
          message: `Reserva confirmada pero error al bloquear fechas: ${blockedDatesResult.message}` 
        };
      }

      console.log('✅ Fechas bloqueadas exitosamente');
      return { 
        success: true, 
        message: 'Reserva confirmada y fechas bloqueadas exitosamente' 
      };

    } catch (error) {
      console.error('💥 Error inesperado en confirmBooking:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Rechaza una reserva
   */
  static async rejectBooking(bookingId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'rejected',
          notes: reason ? `Rechazada: ${reason}` : 'Rechazada por el administrador',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        return { success: false, message: 'Error al rechazar la reserva' };
      }

      return { success: true, message: 'Reserva rechazada exitosamente' };
    } catch (error) {
      console.error('Error rejecting booking:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Cancela una reserva confirmada y desbloquea las fechas
   */
  static async cancelConfirmedBooking(bookingId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Obtener la reserva
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (fetchError || !booking) {
        return { success: false, message: 'Reserva no encontrada' };
      }

      // 2. Verificar que la reserva esté confirmada
      if (booking.status !== 'confirmed') {
        return { success: false, message: 'Solo se pueden cancelar reservas confirmadas' };
      }

      // 3. Actualizar el estado de la reserva a cancelada
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          notes: reason ? `Cancelada: ${reason}` : 'Cancelada por el administrador',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (updateError) {
        return { success: false, message: 'Error al cancelar la reserva' };
      }

      // 4. Desbloquear las fechas de la reserva
      const unblockResult = await this.unblockDatesForBooking(booking);
      
      if (!unblockResult.success) {
        return { 
          success: false, 
          message: `Reserva cancelada pero error al desbloquear fechas: ${unblockResult.message}` 
        };
      }

      return { 
        success: true, 
        message: 'Reserva cancelada y fechas desbloqueadas exitosamente' 
      };

    } catch (error) {
      console.error('Error cancelling booking:', error);
      return { success: false, message: 'Error interno del servidor' };
    }
  }

  /**
   * Bloquea las fechas de una reserva confirmada
   */
  private static async blockDatesForBooking(booking: Booking): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📅 Iniciando bloqueo de fechas para reserva:', booking.id);
      console.log('📅 Fechas de la reserva:', { check_in: booking.check_in, check_out: booking.check_out });
      
      const startDate = new Date(booking.check_in);
      const endDate = new Date(booking.check_out);
      const datesToBlock: Omit<BlockedDate, 'id' | 'created_at'>[] = [];

      console.log('📅 Fechas parseadas:', { startDate, endDate });

      // Generar todas las fechas entre check_in y check_out (inclusive)
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        datesToBlock.push({
          property_id: booking.property_id,
          date: dateString,
          source: 'booking'
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      console.log('📅 Fechas a bloquear:', datesToBlock);

      // Insertar las fechas bloqueadas
      const { error } = await supabase
        .from('blocked_dates')
        .insert(datesToBlock);

      if (error) {
        console.error('❌ Error al insertar fechas bloqueadas:', error);
        return { success: false, message: 'Error al bloquear las fechas' };
      }

      console.log('✅ Fechas bloqueadas insertadas exitosamente');
      return { success: true, message: 'Fechas bloqueadas exitosamente' };
    } catch (error) {
      console.error('💥 Error inesperado en blockDatesForBooking:', error);
      return { success: false, message: 'Error interno al bloquear fechas' };
    }
  }

  /**
   * Desbloquea las fechas de una reserva cancelada
   */
  private static async unblockDatesForBooking(booking: Booking): Promise<{ success: boolean; message: string }> {
    try {
      const startDate = new Date(booking.check_in);
      const endDate = new Date(booking.check_out);

      // Eliminar las fechas bloqueadas de esta reserva
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('property_id', booking.property_id)
        .eq('source', 'booking')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

      if (error) {
        console.error('Error unblocking dates:', error);
        return { success: false, message: 'Error al desbloquear las fechas' };
      }

      return { success: true, message: 'Fechas desbloqueadas exitosamente' };
    } catch (error) {
      console.error('Error in unblockDatesForBooking:', error);
      return { success: false, message: 'Error interno al desbloquear fechas' };
    }
  }

  /**
   * Obtiene todas las reservas con información de la propiedad
   */
  static async getAllBookings(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
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
      console.error('Error fetching bookings:', error);
      return { data: null, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene las reservas por estado
   */
  static async getBookingsByStatus(status: string): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
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
      console.error('Error fetching bookings by status:', error);
      return { data: null, error: 'Error interno del servidor' };
    }
  }

  /**
   * Obtiene estadísticas de reservas
   */
  static async getBookingStats(): Promise<{ data: any | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('status');

      if (error) {
        return { data: null, error: error.message };
      }

      const stats = {
        total: data.length,
        pending: data.filter(b => b.status === 'pending').length,
        confirmed: data.filter(b => b.status === 'confirmed').length,
        rejected: data.filter(b => b.status === 'rejected').length,
        cancelled: data.filter(b => b.status === 'cancelled').length
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      return { data: null, error: 'Error interno del servidor' };
    }
  }
}

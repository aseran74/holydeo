import { supabase } from '../supabaseClient';

export interface BookingRequest {
  property_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  message?: string;
  source: 'landing_page' | 'dashboard';
  user_id?: string; // Si el usuario está logueado
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface SeasonRentalRequest {
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
  source: 'landing_page' | 'dashboard';
  user_id?: string; // Si el usuario está logueado
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

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
  status: string;
  created_at: string;
  updated_at: string;
  property?: {
    name: string;
    location: string;
    images: string[];
  };
}

export class BookingService {
  // Crear reserva desde landing page (usuario no logueado)
  static async createBookingFromLanding(bookingData: Omit<BookingRequest, 'status' | 'source'>): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        source: 'landing_page',
        status: 'pending'
      })
      .select(`
        *,
        property:properties(name, location, images)
      `)
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    return data;
  }

  // Crear reserva de temporada desde landing page
  static async createSeasonRentalFromLanding(rentalData: Omit<SeasonRentalRequest, 'status' | 'source'>): Promise<any> {
    const { data, error } = await supabase
      .from('season_rentals')
      .insert({
        ...rentalData,
        source: 'landing_page',
        status: 'pending'
      })
      .select(`
        *,
        property:properties(title, location, main_image_path)
      `)
      .single();

    if (error) {
      console.error('Error creating season rental:', error);
      throw error;
    }

    return data;
  }

  // Crear reserva desde dashboard (usuario logueado)
  static async createBookingFromDashboard(bookingData: Omit<BookingRequest, 'status' | 'source'>, userId: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        user_id: userId,
        source: 'dashboard',
        status: 'pending'
      })
      .select(`
        *,
        property:properties(name, location, images)
      `)
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }

    return data;
  }

  // Obtener todas las reservas (para admin)
  static async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        property:properties(name, location, images)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }

    return data || [];
  }

  // Obtener reservas de un usuario específico
  static async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        property:properties(name, location, images)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }

    return data || [];
  }

  // Obtener reservas de una propiedad específica
  static async getPropertyBookings(propertyId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        property:properties(name, location, images)
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching property bookings:', error);
      throw error;
    }

    return data || [];
  }

  // Actualizar estado de una reserva
  static async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select(`
        *,
        property:properties(name, location, images)
      `)
      .single();

    if (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }

    return data;
  }

  // Eliminar una reserva
  static async deleteBooking(bookingId: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Obtener estadísticas de reservas
  static async getBookingStats() {
    const { data, error } = await supabase
      .from('bookings')
      .select('status, source, created_at');

    if (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(b => b.status === 'pending').length || 0,
      confirmed: data?.filter(b => b.status === 'confirmed').length || 0,
      cancelled: data?.filter(b => b.status === 'cancelled').length || 0,
      completed: data?.filter(b => b.status === 'completed').length || 0,
      fromLanding: data?.filter(b => b.source === 'landing_page').length || 0,
      fromDashboard: data?.filter(b => b.source === 'dashboard').length || 0
    };

    return stats;
  }
}

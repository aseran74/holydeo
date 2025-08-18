import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Building, 
  Users, 
  MessageSquare, 
  Briefcase, 
  MapPin,
  Euro
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface DashboardStats {
  totalBookings: number;
  totalOwners: number;
  totalProperties: number;
  totalMessages: number;
  totalAgencies: number;
  totalExperiences: number;
  last30DaysRevenue: number;
  yearRevenue: number;
}

export default function PropertyMetrics() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalOwners: 0,
    totalProperties: 0,
    totalMessages: 0,
    totalAgencies: 0,
    totalExperiences: 0,
    last30DaysRevenue: 0,
    yearRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value || 0);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas de reservas
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Obtener estadísticas de propiedades
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      // Obtener estadísticas de experiencias
      const { count: experiencesCount } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true });

      // Obtener estadísticas de usuarios (propietarios)
      const { count: ownersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'owner');

      // Obtener estadísticas de agencias desde tabla agencies
      const { count: agenciesCount } = await supabase
        .from('agencies')
        .select('*', { count: 'exact', head: true });

      // Obtener estadísticas de mensajes (posts sociales)
      const { count: messagesCount } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true });

      // Ingresos: últimos 30 días y año actual (reservas confirmadas)
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const { data: confirmedBookingsSinceYearStart } = await supabase
        .from('bookings')
        .select('total_price, created_at')
        .eq('status', 'confirmed')
        .gte('created_at', yearStart.toISOString());

      const yearRevenue = (confirmedBookingsSinceYearStart || []).reduce((sum, b: any) => {
        const amount = typeof b.total_price === 'string' ? parseFloat(b.total_price) : (b.total_price || 0);
        return sum + (amount || 0);
      }, 0);

      const last30DaysRevenue = (confirmedBookingsSinceYearStart || [])
        .filter((b: any) => new Date(b.created_at) >= thirtyDaysAgo)
        .reduce((sum, b: any) => {
          const amount = typeof b.total_price === 'string' ? parseFloat(b.total_price) : (b.total_price || 0);
          return sum + (amount || 0);
        }, 0);

      setStats({
        totalBookings: bookingsCount || 0,
        totalOwners: ownersCount || 0,
        totalProperties: propertiesCount || 0,
        totalMessages: messagesCount || 0,
        totalAgencies: agenciesCount || 0,
        totalExperiences: experiencesCount || 0,
        last30DaysRevenue,
        yearRevenue
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {/* Nº de Reservas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/20">
          <Calendar className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Nº de Reservas
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {stats.totalBookings.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Nº de Propietarios */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl dark:bg-green-900/20">
          <Users className="text-green-600 size-6 dark:text-green-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Nº de Propietarios
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {stats.totalOwners.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Nº de Propiedades */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
          <Building className="text-purple-600 size-6 dark:text-purple-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Nº de Propiedades
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {stats.totalProperties.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Nº de Mensajes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
          <MessageSquare className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Últimos Mensajes
          </span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {stats.totalMessages.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Nº de Agencias */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl dark:bg-indigo-900/20">
          <Briefcase className="text-indigo-600 size-6 dark:text-indigo-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Nº de Agencias
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {stats.totalAgencies.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Nº de Experiencias */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl dark:bg-pink-900/20">
          <MapPin className="text-pink-600 size-6 dark:text-pink-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Nº de Experiencias
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {stats.totalExperiences.toLocaleString()}
          </h4>
        </div>
      </div>

      {/* Importe reservas - Últimos 30 días */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl dark:bg-emerald-900/20">
          <Euro className="text-emerald-600 size-6 dark:text-emerald-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Importe reservas (últimos 30 días)
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatCurrency(stats.last30DaysRevenue)}
          </h4>
        </div>
      </div>

      {/* Importe reservas - Año actual */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl dark:bg-teal-900/20">
          <Euro className="text-teal-600 size-6 dark:text-teal-400" />
        </div>
        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Importe reservas (año)
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {formatCurrency(stats.yearRevenue)}
          </h4>
        </div>
      </div>
    </div>
  );
}

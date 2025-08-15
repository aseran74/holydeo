import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Calendar, 
  User, 
  Home, 
  Euro, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Check,
  X,
  Clock3,
  Filter,
  Search
} from 'lucide-react';

interface Booking {
  id: string;
  property_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  notes?: string;
  created_at: string;
  property?: {
    title: string;
    location: string;
  };
  guest?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

interface OwnerBookingsPanelProps {
  ownerId: string;
  className?: string;
}

const OwnerBookingsPanel: React.FC<OwnerBookingsPanelProps> = ({ 
  ownerId, 
  className = '' 
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOwnerBookings();
  }, [ownerId]);

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);
      
      // Obtener todas las propiedades del propietario
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', ownerId);

      if (propertiesError) {
        console.error('Error obteniendo propiedades:', propertiesError);
        return;
      }

      if (!properties || properties.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const propertyIds = properties.map(p => p.id);

      // Obtener reservas de las propiedades del propietario
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(id, title, location),
          guest:profiles(id, full_name, email, phone)
        `)
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error obteniendo reservas:', bookingsError);
      } else {
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        console.error('Error actualizando estado:', error);
        alert('Error al actualizar el estado de la reserva');
      } else {
        // Actualizar el estado local
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus as any }
            : booking
        ));
        
        // Mostrar mensaje de éxito
        const statusMessages = {
          'confirmed': 'Reserva confirmada exitosamente',
          'rejected': 'Reserva rechazada',
          'cancelled': 'Reserva cancelada'
        };
        
        alert(statusMessages[newStatus as keyof typeof statusMessages] || 'Estado actualizado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock3 size={16} className="text-yellow-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Desconocido';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status: string) => {
    return bookings.filter(booking => booking.status === status).length;
  };

  const getTotalCount = () => bookings.length;

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Gestión de Reservas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Administra las reservas de tus propiedades
          </p>
        </div>
        
        {/* Contadores de estado */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <span className="font-medium">Total: {getTotalCount()}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <Clock3 size={14} />
            <span>{getStatusCount('pending')}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle size={14} />
            <span>{getStatusCount('confirmed')}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <XCircle size={14} />
            <span>{getStatusCount('cancelled') + getStatusCount('rejected')}</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por propiedad, huésped o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="cancelled">Canceladas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Lista de reservas */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'No se encontraron reservas con los filtros aplicados'
              : 'No hay reservas para tus propiedades'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Información principal */}
                <div className="flex-1 space-y-3">
                  {/* Propiedad y huésped */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Home size={16} className="text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {booking.property?.title || 'Propiedad desconocida'}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {getStatusLabel(booking.status)}
                      </div>
                    </div>
                  </div>

                  {/* Huésped */}
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {booking.guest?.full_name || 'Huésped desconocido'}
                    </span>
                    {booking.guest?.email && (
                      <span className="text-sm text-gray-500">
                        ({booking.guest.email})
                      </span>
                    )}
                  </div>

                  {/* Fechas y detalles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-purple-500" />
                      <div>
                        <div className="font-medium">Entrada:</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {new Date(booking.check_in).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-purple-500" />
                      <div>
                        <div className="font-medium">Salida:</div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {new Date(booking.check_out).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Precio y huéspedes */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Euro size={16} className="text-green-500" />
                      <span className="font-medium">
                        {booking.total_price.toFixed(2)}€
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-blue-500" />
                      <span>
                        {booking.guests_count} huésped{booking.guests_count !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Fecha de solicitud */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Solicitado el {new Date(booking.created_at).toLocaleDateString('es-ES')} a las {new Date(booking.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  {/* Notas */}
                  {booking.notes && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <span className="font-medium">Notas:</span> {booking.notes}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                {booking.status === 'pending' && (
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      disabled={updatingStatus === booking.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updatingStatus === booking.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Check size={16} />
                      )}
                      Aprobar
                    </button>
                    
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'rejected')}
                      disabled={updatingStatus === booking.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updatingStatus === booking.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <X size={16} />
                      )}
                      Rechazar
                    </button>
                  </div>
                )}

                {booking.status === 'confirmed' && (
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      disabled={updatingStatus === booking.id}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updatingStatus === booking.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <X size={16} />
                      )}
                      Cancelar
                    </button>
                  </div>
                )}

                {booking.status === 'rejected' && (
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'pending')}
                      disabled={updatingStatus === booking.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updatingStatus === booking.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Clock3 size={16} />
                      )}
                      Revisar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      {filteredBookings.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredBookings.length} de {bookings.length} reservas
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookingsPanel;

import React, { useEffect, useState } from 'react';
import { Calendar, User, Home, Euro, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Booking {
  id: string;
  property_id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
  total_price: number;
  created_at: string;
}

interface Property {
  id: string;
  title: string;
  location: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
}

interface RecentBookingsProps {
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ 
  limit = 5, 
  showTitle = true,
  className = ''
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      setLoading(true);
      
      // Obtener las últimas reservas
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      } else {
        setBookings(bookingsData || []);
      }

      // Obtener propiedades
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title, location');

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
        setProperties([]);
      } else {
        setProperties(propertiesData || []);
      }

      // Obtener huéspedes
      // Comentado temporalmente - la tabla 'clients' no existe
      /*
      const { data: guestsData, error: guestsError } = await supabase
        .from('clients')
        .select('id, name, email');

      if (guestsError) {
        console.error('Error fetching guests:', guestsError);
      } else {
        setGuests(guestsData || []);
      }
      */
      
      // Por ahora, usar datos mock para guests
      setGuests([]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmada':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pendiente':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'cancelada':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        {showTitle && (
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Últimas Reservas</h3>
          </div>
        )}
        <div className="space-y-3">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border p-6 ${className}`}>
        {showTitle && (
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Últimas Reservas</h3>
          </div>
        )}
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay reservas recientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {showTitle && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Últimas Reservas</h3>
            </div>
            <span className="text-sm text-gray-500">{bookings.length} reservas</span>
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-100">
        {bookings.map((booking) => {
          const property = properties.find(p => p.id === booking.property_id);
          const guest = guests.find(g => g.id === booking.client_id);
          
          return (
            <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <h4 className="font-medium text-gray-900 truncate">
                      {property?.title || 'Propiedad no encontrada'}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {guest?.name || 'Huésped no encontrado'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Euro className="w-4 h-4" />
                      <span>€{(booking.total_price || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="capitalize">{booking.status}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(booking.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {bookings.length >= limit && (
        <div className="px-6 py-3 border-t border-gray-200">
          <button 
            onClick={() => window.location.href = '/bookings'}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Ver todas las reservas →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentBookings; 
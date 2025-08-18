import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye,
  Calendar,
  Users,
  Euro,
  MapPin,
  Building,
  Filter,
  Search
} from 'lucide-react';
import { BookingManagementService, Booking } from '../../services/bookingManagementService';
import useToast from '../../hooks/useToast';

interface BookingWithProperty extends Booking {
  properties: {
  title: string;
    location: string;
    main_image_path?: string;
  };
}

const Bookings = () => {
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithProperty | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const toast = useToast();

  useEffect(() => {
    loadBookings();
    loadStats();
  }, [selectedStatus]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      let result;
      if (selectedStatus === 'all') {
        result = await BookingManagementService.getAllBookings();
      } else {
        result = await BookingManagementService.getBookingsByStatus(selectedStatus);
      }

      if (result.error) {
        toast.error('Error al cargar reservas', result.error);
      } else {
        setBookings(result.data || []);
      }
    } catch (error) {
      toast.error('Error al cargar reservas', 'Error interno del servidor');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await BookingManagementService.getBookingStats();
      if (result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleConfirmBooking = async (booking: BookingWithProperty) => {
    setActionLoading(true);
    try {
      const result = await BookingManagementService.confirmBooking(booking.id);
      
      if (result.success) {
        toast.success('Reserva confirmada', result.message);
        await loadBookings();
        await loadStats();
      } else {
        toast.error('Error al confirmar', result.message);
      }
    } catch (error) {
      toast.error('Error al confirmar', 'Error interno del servidor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking) return;
    
    setActionLoading(true);
    try {
      const result = await BookingManagementService.rejectBooking(selectedBooking.id, rejectReason);
      
      if (result.success) {
        toast.success('Reserva rechazada', result.message);
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedBooking(null);
        await loadBookings();
        await loadStats();
    } else {
        toast.error('Error al rechazar', result.message);
      }
    } catch (error) {
      toast.error('Error al rechazar', 'Error interno del servidor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    setActionLoading(true);
    try {
      const result = await BookingManagementService.cancelConfirmedBooking(selectedBooking.id, cancelReason);
      
      if (result.success) {
        toast.success('Reserva cancelada', result.message);
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedBooking(null);
        await loadBookings();
        await loadStats();
      } else {
        toast.error('Error al cancelar', result.message);
      }
    } catch (error) {
      toast.error('Error al cancelar', 'Error interno del servidor');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'rejected':
        return 'Rechazada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.properties.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.properties.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Reservas
              </h1>
              <p className="text-gray-600">
                Administra y gestiona todas las reservas de propiedades
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
            <button
                onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'table' ? 'Vista Grid' : 'Vista Tabla'}
            </button>
          </div>
        </div>
      </div>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Canceladas</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y Búsqueda */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por huésped, propiedad o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las reservas</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
                <option value="rejected">Rechazadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Reservas */}
        {/* Mobile: siempre tarjetas */}
        <div className="block md:hidden">
          <div className="grid grid-cols-1 gap-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {booking.properties.main_image_path ? (
                      <img
                        className="h-12 w-12 rounded-lg object-cover mr-3"
                        src={booking.properties.main_image_path}
                        alt={booking.properties.title}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.properties.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {booking.properties.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(booking.status)}
                    <span className={`ml-2 ${getStatusBadge(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Huésped</p>
                    <p className="text-sm text-gray-900">{booking.guest_name}</p>
                    <p className="text-xs text-gray-500">{booking.guest_email}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Check-in</p>
                      <p className="text-sm text-gray-900">{formatDate(booking.check_in)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Check-out</p>
                      <p className="text-sm text-gray-900">{formatDate(booking.check_out)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Huéspedes</p>
                      <p className="text-sm text-gray-900">{booking.guests_count}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Noches</p>
                      <p className="text-sm text-gray-900">{booking.nights}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-500">Precio Total</p>
                    <p className="text-lg font-bold text-green-600">{formatPrice(booking.total_price)}</p>
                  </div>
      </div>

                <div className="flex space-x-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleConfirmBooking(booking)}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirmar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowRejectModal(true);
                        }}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowCancelModal(true);
                      }}
                      disabled={actionLoading}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Cancelar
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      console.log('Ver detalles:', booking);
                    }}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: tabla o tarjetas según selección */}
        <div className="hidden md:block">
          {viewMode === 'table' ? (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Propiedad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Huésped
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fechas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Detalles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
              </tr>
            </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              {booking.properties.main_image_path ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={booking.properties.main_image_path}
                                  alt={booking.properties.title}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Building className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.properties.title}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {booking.properties.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.guest_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.guest_email}
                            </div>
                            {booking.guest_phone && (
                              <div className="text-sm text-gray-500">
                                {booking.guest_phone}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="font-medium">Check-in:</span>
                            </div>
                            <div className="ml-6 mb-2">{formatDate(booking.check_in)}</div>
                            
                            <div className="flex items-center mb-1">
                              <Calendar className="w-4 h-4 mr-2 text-red-500" />
                              <span className="font-medium">Check-out:</span>
                            </div>
                            <div className="ml-6">{formatDate(booking.check_out)}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 space-y-1">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{booking.guests_count} huéspedes</span>
                            </div>
                            <div className="flex items-center">
                              <Euro className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{formatPrice(booking.total_price)}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.nights} noches
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(booking.status)}
                            <span className={`ml-2 ${getStatusBadge(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleConfirmBooking(booking)}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowRejectModal(true);
                                  }}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Rechazar
                                </button>
                              </>
                            )}
                            
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowCancelModal(true);
                                }}
                                disabled={actionLoading}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                              >
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Cancelar
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                console.log('Ver detalles:', booking);
                              }}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                      </button>
                          </div>
                    </td>
                  </tr>
                    ))}
            </tbody>
          </table>
        </div>
              
              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reservas</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedStatus === 'all' 
                      ? 'No se han encontrado reservas en el sistema.'
                      : `No hay reservas con estado "${getStatusText(selectedStatus)}".`
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {booking.properties.main_image_path ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover mr-3"
                          src={booking.properties.main_image_path}
                          alt={booking.properties.title}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                          <Building className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                <div>
                        <h3 className="font-semibold text-gray-900">{booking.properties.title}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {booking.properties.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(booking.status)}
                      <span className={`ml-2 ${getStatusBadge(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Huésped</p>
                      <p className="text-sm text-gray-900">{booking.guest_name}</p>
                      <p className="text-xs text-gray-500">{booking.guest_email}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Check-in</p>
                        <p className="text-sm text-gray-900">{formatDate(booking.check_in)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Check-out</p>
                        <p className="text-sm text-gray-900">{formatDate(booking.check_out)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Huéspedes</p>
                        <p className="text-sm text-gray-900">{booking.guests_count}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Noches</p>
                        <p className="text-sm text-gray-900">{booking.nights}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500">Precio Total</p>
                      <p className="text-lg font-bold text-green-600">{formatPrice(booking.total_price)}</p>
                    </div>
                </div>

                  <div className="flex space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleConfirmBooking(booking)}
                          disabled={actionLoading}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirmar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowRejectModal(true);
                          }}
                          disabled={actionLoading}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rechazar
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Cancelar
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        console.log('Ver detalles:', booking);
                      }}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="w-4 h-4" />
                  </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Rechazo */}
      {showRejectModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Rechazar Reserva
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que quieres rechazar la reserva de <strong>{selectedBooking.guest_name}</strong>?
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo del rechazo (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                rows={3}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejectBooking}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
                >
                  {actionLoading ? 'Rechazando...' : 'Rechazar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelación */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cancelar Reserva Confirmada
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>⚠️ Advertencia:</strong> Al cancelar esta reserva confirmada, las fechas se desbloquearán automáticamente y estarán disponibles para nuevas reservas.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que quieres cancelar la reserva de <strong>{selectedBooking.guest_name}</strong>?
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Motivo de la cancelación (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                rows={3}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg disabled:opacity-50"
                >
                  {actionLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings; 
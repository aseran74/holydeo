import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Users,
  Euro,
  MapPin,
  Building,
  Home
} from 'lucide-react';
import { BookingManagementService, Booking } from '../../services/bookingManagementService';
import { SeasonRentalManagementService, SeasonRentalWithProperty } from '../../services/seasonRentalManagementService';
import useToast from '../../hooks/useToast';

interface BookingWithProperty extends Booking {
  properties: {
    title: string;
    location: string;
    main_image_path?: string;
  };
}

interface CombinedBooking extends BookingWithProperty {
  type: 'booking';
}

interface CombinedSeasonRental extends SeasonRentalWithProperty {
  type: 'season_rental';
}

type CombinedReservation = CombinedBooking | CombinedSeasonRental;

const CombinedBookingManagement: React.FC = () => {
  const [reservations, setReservations] = useState<CombinedReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all'); // 'all', 'booking', 'season_rental'
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<CombinedReservation | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    loadReservations();
    loadStats();
  }, [selectedStatus, selectedType]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const [bookingsResult, seasonRentalsResult] = await Promise.all([
        selectedType === 'all' || selectedType === 'booking' 
          ? (selectedStatus === 'all' 
              ? BookingManagementService.getAllBookings()
              : BookingManagementService.getBookingsByStatus(selectedStatus))
          : { data: [], error: null },
        selectedType === 'all' || selectedType === 'season_rental'
          ? (selectedStatus === 'all'
              ? SeasonRentalManagementService.getAllSeasonRentals()
              : SeasonRentalManagementService.getSeasonRentalsByStatus(selectedStatus))
          : { data: [], error: null }
      ]);

      const combinedReservations: CombinedReservation[] = [];

      if (bookingsResult.data) {
        const bookingsWithType = bookingsResult.data.map((booking: BookingWithProperty) => ({
          ...booking,
          type: 'booking' as const
        }));
        combinedReservations.push(...bookingsWithType);
      }

      if (seasonRentalsResult.data) {
        const seasonRentalsWithType = seasonRentalsResult.data.map((rental: SeasonRentalWithProperty) => ({
          ...rental,
          type: 'season_rental' as const
        }));
        combinedReservations.push(...seasonRentalsWithType);
      }

      // Ordenar por fecha de creación (más recientes primero)
      combinedReservations.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setReservations(combinedReservations);
    } catch (error) {
      toast.error('Error al cargar reservas', 'Error interno del servidor');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [bookingsStats, seasonRentalsStats] = await Promise.all([
        BookingManagementService.getBookingStats(),
        SeasonRentalManagementService.getSeasonRentalStats()
      ]);

      if (bookingsStats.data && seasonRentalsStats.data) {
        const combinedStats = {
          total: bookingsStats.data.total + seasonRentalsStats.data.total,
          pending: bookingsStats.data.pending + seasonRentalsStats.data.pending,
          confirmed: bookingsStats.data.confirmed + seasonRentalsStats.data.confirmed,
          rejected: bookingsStats.data.rejected + seasonRentalsStats.data.rejected,
          cancelled: bookingsStats.data.cancelled + seasonRentalsStats.data.cancelled,
          bookings: bookingsStats.data,
          seasonRentals: seasonRentalsStats.data
        };
        setStats(combinedStats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleConfirmReservation = async (reservation: CombinedReservation) => {
    setActionLoading(true);
    try {
      let result;
      if (reservation.type === 'booking') {
        result = await BookingManagementService.confirmBooking(reservation.id);
      } else {
        result = await SeasonRentalManagementService.confirmSeasonRental(reservation.id);
      }

      if (result.success) {
        toast.success('Reserva confirmada', result.message);
        loadReservations();
        loadStats();
      } else {
        toast.error('Error al confirmar', result.message);
      }
    } catch (error) {
      toast.error('Error al confirmar', 'Error interno del servidor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectReservation = async () => {
    if (!selectedReservation) return;
    
    setActionLoading(true);
    try {
      let result;
      if (selectedReservation.type === 'booking') {
        result = await BookingManagementService.rejectBooking(selectedReservation.id, rejectReason);
      } else {
        result = await SeasonRentalManagementService.rejectSeasonRental(selectedReservation.id, rejectReason);
      }

      if (result.success) {
        toast.success('Reserva rechazada', result.message);
        loadReservations();
        loadStats();
        setShowRejectModal(false);
        setRejectReason('');
      } else {
        toast.error('Error al rechazar', result.message);
      }
    } catch (error) {
      toast.error('Error al rechazar', 'Error interno del servidor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    
    setActionLoading(true);
    try {
      let result;
      if (selectedReservation.type === 'booking') {
        result = await BookingManagementService.cancelConfirmedBooking(selectedReservation.id, cancelReason);
      } else {
        result = await SeasonRentalManagementService.cancelSeasonRental(selectedReservation.id, cancelReason);
      }

      if (result.success) {
        toast.success('Reserva cancelada', result.message);
        loadReservations();
        loadStats();
        setShowCancelModal(false);
        setCancelReason('');
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
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getReservationTypeIcon = (type: string) => {
    return type === 'booking' ? <Calendar className="w-4 h-4" /> : <Home className="w-4 h-4" />;
  };

  const getReservationTypeLabel = (type: string) => {
    return type === 'booking' ? 'Reserva corta' : 'Larga estancia';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="rejected">Rechazadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="booking">Reservas cortas</option>
              <option value="season_rental">Larga estancia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
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
              {reservations.map((reservation) => (
                <tr key={`${reservation.type}-${reservation.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getReservationTypeIcon(reservation.type)}
                      <span className="ml-2 text-sm text-gray-900">
                        {getReservationTypeLabel(reservation.type)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {reservation.properties.main_image_path ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={reservation.properties.main_image_path}
                            alt={reservation.properties.title}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Building className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.properties.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {reservation.properties.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.guest_name}</div>
                    <div className="text-sm text-gray-500">{reservation.guest_email}</div>
                    {reservation.guest_phone && (
                      <div className="text-sm text-gray-500">{reservation.guest_phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reservation.type === 'booking' 
                        ? `${formatDate(reservation.check_in)} - ${formatDate(reservation.check_out)}`
                        : `${formatDate(reservation.start_date)} - ${formatDate(reservation.end_date)}`
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.type === 'booking' 
                        ? `${reservation.nights} noches`
                        : `${reservation.total_months} meses`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {reservation.guests_count} huésped{reservation.guests_count > 1 ? 'es' : ''}
                      </div>
                    </div>
                    <div className="text-sm text-gray-900 font-medium">
                      <div className="flex items-center">
                        <Euro className="w-4 h-4 mr-1" />
                        {formatPrice(reservation.total_price)}€
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1 capitalize">{reservation.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {reservation.status === 'pending' && (
                        <button
                          onClick={() => handleConfirmReservation(reservation)}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {reservation.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowRejectModal(true);
                          }}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowCancelModal(true);
                          }}
                          disabled={actionLoading}
                          className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                        >
                          <AlertTriangle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {/* Modal de rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rechazar Reserva</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo del rechazo (opcional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Explica el motivo del rechazo..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejectReservation}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Rechazando...' : 'Rechazar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cancelar Reserva</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la cancelación (opcional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Explica el motivo de la cancelación..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancelReservation}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Cancelando...' : 'Cancelar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedBookingManagement;

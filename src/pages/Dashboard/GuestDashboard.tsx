import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import GuestNotificationDropdown from '../../components/notifications/GuestNotificationDropdown';

interface Booking {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

interface SocialPost {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

const GuestDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchGuestData();
    }
  }, [currentUser]);

  const fetchGuestData = async () => {
    try {
      setLoading(true);
      
      if (!currentUser) {
        console.error('Usuario no autenticado');
        return;
      }
      
      // Obtener reservas del usuario
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          property_id,
          start_date,
          end_date,
          total_price,
          status,
          created_at
        `)
        .eq('user_id', currentUser.uid)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) {
        console.error('Error obteniendo reservas:', bookingsError);
      } else {
        setBookings(bookingsData || []);
      }

      // Obtener posts sociales recientes
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select(`
          id,
          content,
          author_id,
          created_at,
          likes_count,
          comments_count
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (postsError) {
        console.error('Error obteniendo posts sociales:', postsError);
      } else {
        setSocialPosts(postsData || []);
      }

    } catch (error) {
      console.error('Error obteniendo datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard de Huésped
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Bienvenido, {currentUser?.email}
            </p>
          </div>
          <GuestNotificationDropdown />
        </div>
      </div>

                        {/* Sección de Búsqueda Rápida */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      Búsqueda Rápida
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Buscar Propiedades */}
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="text-xl font-semibold">Propiedades</h3>
                          </div>
                        </div>
                        <p className="text-blue-100 mb-4">
                          Encuentra tu próxima estancia perfecta
                        </p>
                        <button
                          onClick={() => window.location.href = '/search?type=properties'}
                          className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                        >
                          Buscar Propiedades
                        </button>
                      </div>

                      {/* Buscar Experiencias */}
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h3 className="text-xl font-semibold">Experiencias</h3>
                          </div>
                        </div>
                        <p className="text-purple-100 mb-4">
                          Descubre actividades únicas y emocionantes
                        </p>
                        <button
                          onClick={() => window.location.href = '/search?type=experiences'}
                          className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors duration-200"
                        >
                          Buscar Experiencias
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Mis Reservas */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mis Reservas
            </h2>
            <span className="text-sm text-gray-500">
              {bookings.length} reserva{bookings.length !== 1 ? 's' : ''}
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500">No tienes reservas aún</p>
              <p className="text-sm text-gray-400">¡Explora nuestras propiedades y haz tu primera reserva!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Reserva #{booking.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Precio: €{booking.total_price}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(booking.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Red Social */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Red Social
            </h2>
            <span className="text-sm text-gray-500">
              {socialPosts.length} post{socialPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {socialPosts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500">No hay posts aún</p>
              <p className="text-sm text-gray-400">¡Sé el primero en compartir algo!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {socialPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white mb-3 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post.likes_count}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments_count}
                      </span>
                    </div>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;

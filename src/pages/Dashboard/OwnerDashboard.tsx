import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  Home, 
  Calendar, 
  TrendingUp, 
  Star,
  Building,
  MapPin,
  Eye,
  Plus
} from 'lucide-react';
import PageMeta from '../../components/common/PageMeta';
import OwnerBookingsPanel from '../../components/dashboard/OwnerBookingsPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Property {
  id: string;
  title: string;
  location: string;
  precio_mes: number;
  precio_entresemana: number;
  precio_fin_de_semana: number;
  main_image_path?: string;
  destacada: boolean;
  created_at: string;
}

interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  monthlyRevenue: number;
  averageRating: number;
}

const OwnerDashboard: React.FC = () => {
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    monthlyRevenue: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'properties'>('overview');

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setOwnerId(user.id);

      // Obtener propiedades del propietario
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) {
        console.error('Error obteniendo propiedades:', propertiesError);
      } else {
        setProperties(propertiesData || []);
      }

      // Obtener estadísticas
      await fetchDashboardStats(user.id);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async (userId: string) => {
    try {
      // Obtener IDs de propiedades del propietario
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', userId);

      if (!properties || properties.length === 0) {
        setStats({
          totalProperties: 0,
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          monthlyRevenue: 0,
          averageRating: 0
        });
        return;
      }

      const propertyIds = properties.map(p => p.id);

      // Obtener estadísticas de reservas
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('status, total_price, created_at')
        .in('property_id', propertyIds);

      if (bookingsData) {
        const totalBookings = bookingsData.length;
        const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
        const confirmedBookings = bookingsData.filter(b => b.status === 'confirmed').length;
        
        // Calcular ingresos del mes actual
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = bookingsData
          .filter(b => {
            const bookingDate = new Date(b.created_at);
            return b.status === 'confirmed' && 
                   bookingDate.getMonth() === currentMonth && 
                   bookingDate.getFullYear() === currentYear;
          })
          .reduce((sum, b) => sum + (b.total_price || 0), 0);

        setStats({
          totalProperties: properties.length,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          monthlyRevenue,
          averageRating: 0 // TODO: Implementar cálculo de rating promedio
        });
      }
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!ownerId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Home size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Acceso denegado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No tienes permisos para acceder al dashboard de propietarios
        </p>
      </div>
    );
  }

  return (
    <>
      <PageMeta 
        title="Dashboard de Propietario - Holydeo" 
        description="Panel de control para propietarios de propiedades" 
      />
      
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard de Propietario
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus propiedades y reservas desde un solo lugar
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reservas
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis Propiedades
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Propiedades
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalProperties}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Reservas Pendientes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.pendingBookings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Ingresos del Mes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(stats.monthlyRevenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Rating Promedio
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Propiedades recientes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Propiedades Recientes
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver todas
                </button>
              </div>
              
              {properties.length === 0 ? (
                <div className="text-center py-8">
                  <Building size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No tienes propiedades registradas
                  </p>
                  <button className="btn btn-primary">
                    <Plus size={16} className="mr-2" />
                    Agregar Propiedad
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.slice(0, 6).map((property) => (
                    <div
                      key={property.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {property.title}
                        </h4>
                        {property.destacada && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            Destacada
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin size={14} />
                        <span>{property.location}</span>
                      </div>
                      
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex justify-between">
                          <span>Mensual:</span>
                          <span className="font-medium">{formatPrice(property.precio_mes)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Entre semana:</span>
                          <span className="font-medium">{formatPrice(property.precio_entresemana)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fin de semana:</span>
                          <span className="font-medium">{formatPrice(property.precio_fin_de_semana)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel de reservas recientes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reservas Recientes
                </h3>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todas
                </button>
              </div>
              
              <OwnerBookingsPanel 
                ownerId={ownerId} 
                className="!p-0 !shadow-none !border-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <OwnerBookingsPanel ownerId={ownerId} />
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Mis Propiedades
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Gestiona todas tus propiedades inmobiliarias
                  </p>
                </div>
                <button className="btn btn-primary">
                  <Plus size={16} className="mr-2" />
                  Nueva Propiedad
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <Building size={64} className="mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No tienes propiedades
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Comienza agregando tu primera propiedad para empezar a recibir reservas
                  </p>
                  <button className="btn btn-primary">
                    <Plus size={16} className="mr-2" />
                    Agregar Primera Propiedad
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Imagen de la propiedad */}
                      <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {property.main_image_path ? (
                          <img
                            src={property.main_image_path}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building size={48} className="text-gray-400" />
                        )}
                      </div>

                      {/* Información de la propiedad */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {property.title}
                          </h4>
                          {property.destacada && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              Destacada
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <MapPin size={14} />
                          <span>{property.location}</span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                          <div className="flex justify-between">
                            <span>Precio mensual:</span>
                            <span className="font-medium">{formatPrice(property.precio_mes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Entre semana:</span>
                            <span className="font-medium">{formatPrice(property.precio_entresemana)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fin de semana:</span>
                            <span className="font-medium">{formatPrice(property.precio_fin_de_semana)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="btn btn-outline flex-1">
                            <Eye size={16} className="mr-2" />
                            Ver
                          </button>
                          <button className="btn btn-primary flex-1">
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OwnerDashboard;

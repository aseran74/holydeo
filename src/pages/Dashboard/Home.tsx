import PropertyMetrics from "../../components/dashboard/PropertyMetrics";
import RecentBookings from '../../components/common/RecentBookings';
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <PageMeta
        title="Dashboard | HolyDeo - Sistema de Gestión de Alojamientos"
        description="Dashboard principal del sistema de gestión de alojamientos y experiencias"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Métricas del Sistema */}
        <div className="col-span-12">
          <PropertyMetrics />
        </div>

        {/* Reservas Recientes */}
        <div className="col-span-12 xl:col-span-8">
          <RecentBookings />
        </div>

        {/* Panel de Acciones Rápidas */}
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <button type="button" onClick={() => navigate('/bookings')} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Ver Todas las Reservas
              </button>
              <button type="button" onClick={() => navigate('/properties')} className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Gestionar Propiedades
              </button>
              <button type="button" onClick={() => navigate('/experiences')} className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Administrar Experiencias
              </button>
              <button type="button" onClick={() => navigate('/social')} className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Ver Mensajes Sociales
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

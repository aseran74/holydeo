import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import AdvancedCalendarManager from '../../components/CalendarManagement/AdvancedCalendarManager';
import ICalConfiguration from '../../components/CalendarManagement/ICalConfiguration';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { 
  CalenderIcon, 
  PlugInIcon, 
  BoltIcon, 
  DownloadIcon,
  DocsIcon,
  UserIcon,
  DollarLineIcon
} from '../../icons';

interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  price?: number;
  price_weekday?: number;
  price_weekend?: number;
  monthly_price?: number;
}

const CalendarManagement = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'ical' | 'reservations' | 'pricing'>('calendar');

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      
      if (error) {
        console.error('Error al obtener la propiedad:', error);
      } else {
        setProperty(data);
      }
    } catch (error) {
      console.error('Error en fetchProperty:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-600">Propiedad no encontrada</h2>
        <p className="text-gray-500 mt-2">La propiedad que buscas no existe o no tienes permisos para acceder a ella.</p>
      </div>
    );
  }

  const tabs = [
    {
      id: 'calendar',
      name: 'Calendario',
      icon: CalenderIcon,
      description: 'Gestiona fechas bloqueadas, precios especiales y reservas'
    },
    {
      id: 'ical',
      name: 'Configuración iCal',
      icon: PlugInIcon,
      description: 'Sincroniza con Airbnb, Booking.com y otras plataformas'
    },
    {
      id: 'reservations',
      name: 'Reservas',
      icon: UserIcon,
      description: 'Gestiona reservas y huéspedes'
    },
    {
      id: 'pricing',
      name: 'Precios',
      icon: DollarLineIcon,
      description: 'Configura precios especiales y temporadas'
    }
  ];

  return (
    <div>
      <PageMeta 
        title={`Gestión de Calendario - ${property.title}`} 
        description={`Gestiona el calendario de ${property.title}`} 
      />
      <PageBreadcrumb 
        pageTitle="Gestión de Calendario" 
      />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestión de Calendario
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {property.title} - {property.address}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="btn btn-outline btn-sm flex items-center gap-2">
                <DownloadIcon className="w-4 h-4" />
                Exportar
              </button>
              <button className="btn btn-outline btn-sm flex items-center gap-2">
                <DocsIcon className="w-4 h-4" />
                Importar
              </button>
              <button className="btn btn-primary btn-sm flex items-center gap-2">
                <BoltIcon className="w-4 h-4" />
                Sincronizar
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'calendar' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Gestión de Calendario</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Bloquea fechas, asigna precios especiales y gestiona reservas directamente desde el calendario.
                </p>
              </div>
              <AdvancedCalendarManager 
                propertyId={propertyId!} 
                propertyName={property.title}
              />
            </div>
          )}

          {activeTab === 'ical' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Configuración iCal</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Sincroniza el calendario de esta propiedad con Airbnb, Booking.com, VRBO y otras plataformas.
                </p>
              </div>
              <ICalConfiguration 
                propertyId={propertyId!} 
                propertyName={property.title}
              />
            </div>
          )}

          {activeTab === 'reservations' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Gestión de Reservas</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Gestiona todas las reservas de esta propiedad, incluyendo huéspedes, fechas y estados.
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  🚧 En Desarrollo
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  La gestión avanzada de reservas estará disponible próximamente. 
                  Por ahora, puedes gestionar las reservas desde el calendario principal.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Gestión de Precios</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Configura precios especiales, temporadas y reglas de precios para esta propiedad.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  💡 Información
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Los precios especiales se pueden configurar directamente desde el calendario. 
                  Para configuraciones más avanzadas, usa la pestaña "Calendario".
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center">
                             <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                 <CalenderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
               </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reservas Activas</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center">
                             <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                 <CalenderIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
               </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Días Bloqueados</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center">
                             <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                 <DollarLineIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
               </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Precios Especiales</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center">
                             <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                 <BoltIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
               </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sincronizaciones</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement; 
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface DatabaseStats {
  properties: number;
  users: number;
  bookings: number;
  agencies: number;
  agents: number;
  owners: number;
  guests: number;
}

export default function SupabaseConnectionTest() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sampleProperties, setSampleProperties] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDatabaseStats() {
      try {
        setLoading(true);
        
        // Obtener estadísticas de la base de datos
        const [
          { count: properties },
          { count: users },
          { count: bookings },
          { count: agencies },
          { count: agents },
          { count: owners },
          { count: guests }
        ] = await Promise.all([
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('agencies').select('*', { count: 'exact', head: true }),
          supabase.from('agents').select('*', { count: 'exact', head: true }),
          supabase.from('owners').select('*', { count: 'exact', head: true }),
          supabase.from('guests').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          properties: properties || 0,
          users: users || 0,
          bookings: bookings || 0,
          agencies: agencies || 0,
          agents: agents || 0,
          owners: owners || 0,
          guests: guests || 0
        });

        // Obtener algunas propiedades de ejemplo
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id, title, location, price, bedrooms, bathrooms')
          .limit(3);

        setSampleProperties(propertiesData || []);
        
      } catch (err) {
        setError(`Error conectando a Supabase: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    fetchDatabaseStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Error de Conexión
        </h3>
        <p className="text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        ✅ Conexión Supabase Exitosa
      </h2>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
            {stats?.properties}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">Propiedades</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900">
          <div className="text-2xl font-bold text-green-600 dark:text-green-300">
            {stats?.users}
          </div>
          <div className="text-sm text-green-800 dark:text-green-200">Usuarios</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-900">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
            {stats?.bookings}
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-200">Reservas</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg dark:bg-orange-900">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-300">
            {stats?.agencies}
          </div>
          <div className="text-sm text-orange-800 dark:text-orange-200">Agencias</div>
        </div>
      </div>

      {/* Propiedades de ejemplo */}
      {sampleProperties.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Propiedades de Ejemplo:
          </h3>
          <div className="space-y-3">
            {sampleProperties.map((property) => (
              <div key={property.id} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <div className="font-medium text-gray-800 dark:text-white">
                  {property.title}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {property.location} | 💰 €{property.price} | 🛏️ {property.bedrooms} hab | 🚿 {property.bathrooms} baños
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información de conexión */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">
          Información de Conexión:
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <div>🌐 URL: {import.meta.env.VITE_SUPABASE_URL}</div>
          <div>🔑 Clave configurada: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Sí' : '❌ No'}</div>
          <div>📊 Estado: Conectado y funcionando</div>
        </div>
      </div>
    </div>
  );
} 
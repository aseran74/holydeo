import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const DebugBookingsStructure: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [guestBookings, setGuestBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      if (!currentUser) {
        console.error('Usuario no autenticado');
        return;
      }
      
      // Probar primero con user_id
      let { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', currentUser.uid);

      if (bookingsError) {
        console.error('Error obteniendo reservas con user_id:', bookingsError);
        setError(bookingsError.message || 'Error desconocido');
      } else {
        console.log('Datos de reservas obtenidos:', bookingsData);
        setBookingsData(bookingsData || []);
      }

      // Probar con guest_id
      const { data: guestBookings, error: guestError } = await supabase
        .from('bookings')
        .select('*')
        .eq('guest_id', currentUser.uid);

      if (guestError) {
        console.error('Error obteniendo reservas con guest_id:', guestError);
      } else {
        console.log('Datos de reservas con guest_id:', guestBookings);
        setGuestBookings(guestBookings || []);
      }

    } catch (error) {
      console.error('Error general:', error);
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const testColumnExistence = async (columnName: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .select(columnName)
        .limit(1);
      
      if (error) {
        console.log(`❌ Columna ${columnName} NO existe:`, error.message);
        return false;
      } else {
        console.log(`✅ Columna ${columnName} SÍ existe`);
        return true;
      }
    } catch (err) {
      console.log(`❌ Error verificando columna ${columnName}:`, err);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Debug: Estructura de Reservas
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Información de depuración para el usuario: {currentUser?.email}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Información del usuario */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Información del Usuario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Email:</strong> {currentUser?.email}</p>
            <p><strong>UID:</strong> {currentUser?.uid}</p>
          </div>
          <div>
            <p><strong>Display Name:</strong> {currentUser?.displayName || 'No disponible'}</p>
            <p><strong>Photo URL:</strong> {currentUser?.photoURL || 'No disponible'}</p>
          </div>
        </div>
      </div>

      {/* Botones de prueba */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Verificar Estructura de la Base de Datos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => testColumnExistence('user_id')}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Verificar user_id
          </button>
          <button
            onClick={() => testColumnExistence('guest_id')}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Verificar guest_id
          </button>
          <button
            onClick={() => testColumnExistence('check_in')}
            className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Verificar check_in
          </button>
          <button
            onClick={() => testColumnExistence('check_out')}
            className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Verificar check_out
          </button>
          <button
            onClick={() => testColumnExistence('start_date')}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Verificar start_date
          </button>
          <button
            onClick={() => testColumnExistence('end_date')}
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Verificar end_date
          </button>
        </div>
      </div>

      {/* Reservas encontradas con user_id */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Reservas con user_id ({bookingsData.length})
        </h2>
        {bookingsData.length === 0 ? (
          <p className="text-gray-500">No se encontraron reservas con user_id</p>
        ) : (
          <div className="space-y-3">
            {bookingsData.map((booking, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(booking, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservas encontradas con guest_id */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Reservas con guest_id ({guestBookings.length})
        </h2>
        {guestBookings.length === 0 ? (
          <p className="text-gray-500">No se encontraron reservas con guest_id</p>
        ) : (
          <div className="space-y-3">
            {guestBookings.map((booking, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(booking, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón de recarga */}
      <div className="text-center">
        <button
          onClick={fetchBookings}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Recargar Datos
        </button>
      </div>
    </div>
  );
};

export default DebugBookingsStructure;

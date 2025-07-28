import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>('Probando conexión...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Prueba básica de conexión
        const { data: testData, error: testError } = await supabase
          .from('test_table')
          .select('*')
          .limit(1);

        if (testError) {
          // Si la tabla no existe, intenta crear una
          if (testError.code === 'PGRST116') {
            setStatus('Tabla no encontrada, creando tabla de prueba...');
            
            // Crear tabla de prueba usando RPC (si tienes permisos)
            const { error: createError } = await supabase.rpc('create_test_table');
            
            if (createError) {
              setError(`Error creando tabla: ${createError.message}`);
              setStatus('Error en la conexión');
            } else {
              setStatus('Tabla creada exitosamente');
              setData({ message: 'Tabla de prueba creada' });
            }
          } else {
            setError(`Error de conexión: ${testError.message}`);
            setStatus('Error en la conexión');
          }
        } else {
          setStatus('Conexión exitosa');
          setData(testData);
        }
      } catch (err) {
        setError(`Error inesperado: ${err}`);
        setStatus('Error en la conexión');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Prueba de Conexión Supabase
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Estado: <span className="font-medium">{status}</span>
        </p>
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="p-4 bg-green-100 rounded-lg dark:bg-green-900">
          <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">
            Datos recibidos:
          </h3>
          <pre className="text-sm text-green-700 dark:text-green-300 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>URL: {import.meta.env.VITE_SUPABASE_URL}</p>
        <p>Clave configurada: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Sí' : 'No'}</p>
      </div>
    </div>
  );
} 
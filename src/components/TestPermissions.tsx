import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function TestPermissions() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    // Test 1: Leer propiedades
    try {
      const { data, error } = await supabase.from('properties').select('*').limit(1);
      results.read = { success: !error, data, error };
    } catch (err) {
      results.read = { success: false, error: err };
    }

    // Test 2: Intentar crear una propiedad de prueba
    try {
      const testProperty = {
        title: 'Propiedad de Prueba',
        location: 'Madrid, España',
        price_weekday: 100,
        price_weekend: 150,
        bathrooms: 1,
        beds: 1,
        guests: 2,
        bedrooms: 1,
        description: 'Propiedad de prueba para verificar permisos'
      };
      
      const { data, error } = await supabase.from('properties').insert(testProperty).select();
      results.create = { success: !error, data, error };
      
      // Si se creó, intentar eliminarla
      if (data && data[0]) {
        const { error: deleteError } = await supabase.from('properties').delete().eq('id', data[0].id);
        results.delete = { success: !deleteError, error: deleteError };
      }
    } catch (err) {
      results.create = { success: false, error: err };
    }

    // Test 3: Intentar actualizar una propiedad existente
    try {
      const { data: existingProperties } = await supabase.from('properties').select('id, title').limit(1);
      if (existingProperties && existingProperties.length > 0) {
        const { error } = await supabase
          .from('properties')
          .update({ title: existingProperties[0].title + ' (test)' })
          .eq('id', existingProperties[0].id);
        results.update = { success: !error, error };
        
        // Revertir el cambio
        if (!error) {
          await supabase
            .from('properties')
            .update({ title: existingProperties[0].title })
            .eq('id', existingProperties[0].id);
        }
      } else {
        results.update = { success: false, error: 'No hay propiedades para actualizar' };
      }
    } catch (err) {
      results.update = { success: false, error: err };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold mb-4 text-blue-800">🔐 Prueba de Permisos de Supabase</h3>
      
      <div className="space-y-3">
        {/* Test de Lectura */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">📖 Permiso de Lectura:</h4>
          <div className="text-sm">
            {testResults.read ? (
              <div className={`p-2 rounded ${testResults.read.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">
                  {testResults.read.success ? '✅ LECTURA PERMITIDA' : '❌ LECTURA DENEGADA'}
                </div>
                {testResults.read.error && (
                  <div className="text-xs mt-1">Error: {JSON.stringify(testResults.read.error)}</div>
                )}
              </div>
            ) : (
              <div className="text-gray-600">Cargando...</div>
            )}
          </div>
        </div>

        {/* Test de Creación */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">➕ Permiso de Creación:</h4>
          <div className="text-sm">
            {testResults.create ? (
              <div className={`p-2 rounded ${testResults.create.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">
                  {testResults.create.success ? '✅ CREACIÓN PERMITIDA' : '❌ CREACIÓN DENEGADA'}
                </div>
                {testResults.create.error && (
                  <div className="text-xs mt-1">Error: {JSON.stringify(testResults.create.error)}</div>
                )}
              </div>
            ) : (
              <div className="text-gray-600">Cargando...</div>
            )}
          </div>
        </div>

        {/* Test de Actualización */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">✏️ Permiso de Actualización:</h4>
          <div className="text-sm">
            {testResults.update ? (
              <div className={`p-2 rounded ${testResults.update.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-medium">
                  {testResults.update.success ? '✅ ACTUALIZACIÓN PERMITIDA' : '❌ ACTUALIZACIÓN DENEGADA'}
                </div>
                {testResults.update.error && (
                  <div className="text-xs mt-1">Error: {JSON.stringify(testResults.update.error)}</div>
                )}
              </div>
            ) : (
              <div className="text-gray-600">Cargando...</div>
            )}
          </div>
        </div>

        {/* Botón para reejecutar pruebas */}
        <div className="flex justify-center">
          <button 
            onClick={runTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : '🔄 Reejecutar Pruebas'}
          </button>
        </div>

        {/* Resumen */}
        {Object.keys(testResults).length > 0 && (
          <div className="p-3 bg-gray-100 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">📊 Resumen:</h4>
            <div className="text-sm space-y-1">
              <div>Lectura: {testResults.read?.success ? '✅' : '❌'}</div>
              <div>Creación: {testResults.create?.success ? '✅' : '❌'}</div>
              <div>Actualización: {testResults.update?.success ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
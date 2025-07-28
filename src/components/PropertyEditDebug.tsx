import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PropertyEditDebug() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('properties').select('*').limit(5);
    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const testUpdateProperty = async (property: any) => {
    setLoading(true);
    const testTitle = property.title + ' (TEST EDIT)';
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ title: testTitle })
        .eq('id', property.id)
        .select();
      
      if (error) {
        setTestResults(prev => ({
          ...prev,
          update: { success: false, error: error.message, property: property.id }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          update: { success: true, data, property: property.id }
        }));
        
        // Revertir el cambio
        await supabase
          .from('properties')
          .update({ title: property.title })
          .eq('id', property.id);
      }
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        update: { success: false, error: err.message, property: property.id }
      }));
    }
    
    setLoading(false);
  };

  const testCreateProperty = async () => {
    setLoading(true);
    const testProperty = {
      title: 'Propiedad de Prueba ' + Date.now(),
      location: 'Madrid, España',
      price_weekday: 100,
      price_weekend: 150,
      bathrooms: 1,
      beds: 1,
      guests: 2,
      bedrooms: 1,
      description: 'Propiedad de prueba para verificar permisos'
    };
    
    try {
      const { data, error } = await supabase.from('properties').insert(testProperty).select();
      
      if (error) {
        setTestResults(prev => ({
          ...prev,
          create: { success: false, error: error.message }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          create: { success: true, data }
        }));
        
        // Eliminar la propiedad de prueba
        if (data && data[0]) {
          await supabase.from('properties').delete().eq('id', data[0].id);
        }
      }
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        create: { success: false, error: err.message }
      }));
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="font-bold mb-4 text-green-800">🔧 Debug de Edición de Propiedades</h3>
      
      <div className="space-y-4">
        {/* Cargar Propiedades */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">📋 Propiedades Disponibles:</h4>
          <button 
            onClick={fetchProperties}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : '🔄 Cargar Propiedades'}
          </button>
          
          {properties.length > 0 && (
            <div className="mt-3 space-y-2">
              {properties.map((prop) => (
                <div key={prop.id} className="p-2 bg-gray-50 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{prop.title}</strong>
                      <div className="text-sm text-gray-600">{prop.location}</div>
                    </div>
                    <button
                      onClick={() => testUpdateProperty(prop)}
                      disabled={loading}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      Probar Edición
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test de Creación */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">➕ Test de Creación:</h4>
          <button 
            onClick={testCreateProperty}
            disabled={loading}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Creando...' : '➕ Crear Propiedad de Prueba'}
          </button>
          
          {testResults.create && (
            <div className={`mt-2 p-2 rounded ${testResults.create.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">
                {testResults.create.success ? '✅ CREACIÓN EXITOSA' : '❌ ERROR EN CREACIÓN'}
              </div>
              {testResults.create.error && (
                <div className="text-xs mt-1">Error: {testResults.create.error}</div>
              )}
            </div>
          )}
        </div>

        {/* Test de Actualización */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">✏️ Test de Actualización:</h4>
          
          {testResults.update && (
            <div className={`p-2 rounded ${testResults.update.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-medium">
                {testResults.update.success ? '✅ ACTUALIZACIÓN EXITOSA' : '❌ ERROR EN ACTUALIZACIÓN'}
              </div>
              <div className="text-xs mt-1">Propiedad ID: {testResults.update.property}</div>
              {testResults.update.error && (
                <div className="text-xs mt-1">Error: {testResults.update.error}</div>
              )}
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Instrucciones:</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>1. Haz clic en "Cargar Propiedades" para ver las propiedades disponibles</div>
            <div>2. Haz clic en "Probar Edición" en cualquier propiedad para verificar la actualización</div>
            <div>3. Haz clic en "Crear Propiedad de Prueba" para verificar la creación</div>
            <div>4. Si todos los tests son exitosos, la edición debería funcionar en la aplicación</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
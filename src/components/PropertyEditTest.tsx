import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PropertyEditTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('properties').select('*').limit(3);
    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const testEditProperty = async (property: any) => {
    setLoading(true);
    const originalTitle = property.title;
    const testTitle = property.title + ' (EDITADO)';
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ 
          title: testTitle,
          precio_entresemana: property.precio_entresemana + 10,
          description: property.description + ' - Editado en prueba'
        })
        .eq('id', property.id)
        .select();
      
      if (error) {
        setTestResults(prev => ({
          ...prev,
          [property.id]: { success: false, error: error.message }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [property.id]: { success: true, data }
        }));
        
        // Revertir el cambio después de 2 segundos
        setTimeout(async () => {
          await supabase
            .from('properties')
            .update({ 
              title: originalTitle,
              precio_entresemana: property.precio_entresemana,
              description: property.description
            })
            .eq('id', property.id);
        }, 2000);
      }
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [property.id]: { success: false, error: err.message }
      }));
    }
    
    setLoading(false);
  };

  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <h3 className="font-bold mb-4 text-purple-800">🧪 Prueba de Edición de Propiedades</h3>
      
      <div className="space-y-4">
        {/* Cargar Propiedades */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">📋 Propiedades para Probar:</h4>
          <button 
            onClick={fetchProperties}
            disabled={loading}
            className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : '🔄 Cargar Propiedades'}
          </button>
          
          {properties.length > 0 && (
            <div className="mt-3 space-y-2">
              {properties.map((prop) => (
                <div key={prop.id} className="p-3 bg-gray-50 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{prop.title}</strong>
                      <div className="text-sm text-gray-600">{prop.location}</div>
                      <div className="text-xs text-gray-500">
                        Precio: €{prop.precio_entresemana} | Hab: {prop.bedrooms} | Baños: {prop.bathrooms}
                      </div>
                    </div>
                    <button
                      onClick={() => testEditProperty(prop)}
                      disabled={loading}
                      className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 disabled:opacity-50"
                    >
                      Probar Edición
                    </button>
                  </div>
                  
                  {/* Resultado del test */}
                  {testResults[prop.id] && (
                    <div className={`mt-2 p-2 rounded text-xs ${
                      testResults[prop.id].success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="font-medium">
                        {testResults[prop.id].success ? '✅ EDICIÓN EXITOSA' : '❌ ERROR EN EDICIÓN'}
                      </div>
                      {testResults[prop.id].error && (
                        <div className="mt-1">Error: {testResults[prop.id].error}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Instrucciones:</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>1. Haz clic en "Cargar Propiedades" para ver las propiedades disponibles</div>
            <div>2. Haz clic en "Probar Edición" en cualquier propiedad</div>
            <div>3. El sistema modificará temporalmente el título y precio</div>
            <div>4. Después de 2 segundos, se revertirán los cambios</div>
            <div>5. Si ves "EDICIÓN EXITOSA", la funcionalidad de edición funciona</div>
          </div>
        </div>

        {/* Resumen */}
        {Object.keys(testResults).length > 0 && (
          <div className="p-3 bg-gray-100 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">📊 Resumen de Pruebas:</h4>
            <div className="text-sm space-y-1">
              {Object.entries(testResults).map(([id, result]: [string, any]) => (
                <div key={id} className="flex justify-between">
                  <span>Propiedad {id.substring(0, 8)}...</span>
                  <span>{result.success ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
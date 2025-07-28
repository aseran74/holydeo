import { useState } from 'react';
import { supabase } from '../supabaseClient';
import SimplePropertyForm from './SimplePropertyForm';

export default function FinalPropertyTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

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

  const handleSave = async (property: any) => {
    setLoading(true);
    try {
      if (property.id) {
        // Update
        const { data, error } = await supabase
          .from('properties')
          .update(property)
          .eq('id', property.id)
          .select();
        
        if (error) {
          setTestResults(prev => ({
            ...prev,
            update: { success: false, error: error.message }
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            update: { success: true, data }
          }));
        }
      } else {
        // Create
        const { data, error } = await supabase
          .from('properties')
          .insert(property)
          .select();
        
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
        }
      }
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        error: { success: false, error: err.message }
      }));
    }
    
    setLoading(false);
    setShowForm(false);
    setEditingProperty(null);
    fetchProperties();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  return (
    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
      <h3 className="font-bold mb-4 text-indigo-800">🎯 Prueba Final de Edición de Propiedades</h3>
      
      <div className="space-y-4">
        {/* Cargar Propiedades */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">📋 Propiedades Disponibles:</h4>
          <button 
            onClick={fetchProperties}
            disabled={loading}
            className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 disabled:opacity-50"
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
                      onClick={() => {
                        setEditingProperty(prop);
                        setShowForm(true);
                      }}
                      disabled={loading}
                      className="px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 disabled:opacity-50"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="p-3 bg-white rounded border">
            <SimplePropertyForm
              property={editingProperty}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Resultados de las pruebas */}
        {Object.keys(testResults).length > 0 && (
          <div className="p-3 bg-gray-100 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">📊 Resultados de Pruebas:</h4>
            <div className="space-y-2">
              {testResults.update && (
                <div className={`p-2 rounded ${testResults.update.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="font-medium">
                    {testResults.update.success ? '✅ ACTUALIZACIÓN EXITOSA' : '❌ ERROR EN ACTUALIZACIÓN'}
                  </div>
                  {testResults.update.error && (
                    <div className="text-xs mt-1">Error: {testResults.update.error}</div>
                  )}
                </div>
              )}
              
              {testResults.create && (
                <div className={`p-2 rounded ${testResults.create.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="font-medium">
                    {testResults.create.success ? '✅ CREACIÓN EXITOSA' : '❌ ERROR EN CREACIÓN'}
                  </div>
                  {testResults.create.error && (
                    <div className="text-xs mt-1">Error: {testResults.create.error}</div>
                  )}
                </div>
              )}
              
              {testResults.error && (
                <div className="p-2 rounded bg-red-100 text-red-800">
                  <div className="font-medium">❌ ERROR GENERAL</div>
                  <div className="text-xs mt-1">Error: {testResults.error.error}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="p-3 bg-yellow-100 border border-yellow-300 rounded">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Instrucciones:</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>1. Haz clic en "Cargar Propiedades" para ver las propiedades disponibles</div>
            <div>2. Haz clic en "Editar" en cualquier propiedad</div>
            <div>3. Modifica algunos campos en el formulario</div>
            <div>4. Haz clic en "Guardar"</div>
            <div>5. Si ves "ACTUALIZACIÓN EXITOSA", la edición funciona correctamente</div>
          </div>
        </div>

        {/* Botón para crear nueva propiedad */}
        <div className="p-3 bg-white rounded border">
          <h4 className="font-semibold text-gray-800 mb-2">➕ Crear Nueva Propiedad:</h4>
          <button 
            onClick={() => {
              setEditingProperty(null);
              setShowForm(true);
            }}
            disabled={loading}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
          >
            ➕ Crear Nueva Propiedad
          </button>
        </div>
      </div>
    </div>
  );
} 
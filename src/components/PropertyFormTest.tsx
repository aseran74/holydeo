import { useState } from 'react';
import SimplePropertyForm from './SimplePropertyForm';

export default function PropertyFormTest() {
  const [showForm, setShowForm] = useState(false);
  const [testProperty, setTestProperty] = useState<any>(null);

  const handleSave = (property: any) => {
    console.log('Property saved:', property);
    setTestProperty(property);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <h3 className="font-bold mb-4 text-orange-800">🧪 Prueba del Formulario de Propiedades</h3>
      
      <div className="space-y-4">
        {/* Botón para mostrar/ocultar formulario */}
        <div className="p-3 bg-white rounded border">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            {showForm ? '❌ Ocultar Formulario' : '📝 Mostrar Formulario'}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="p-3 bg-white rounded border">
            <SimplePropertyForm 
              property={null}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Resultado del test */}
        {testProperty && (
          <div className="p-3 bg-green-100 border border-green-300 rounded">
            <h4 className="font-semibold text-green-800 mb-2">✅ Formulario Funcionando</h4>
            <div className="text-sm text-green-700">
              <div><strong>Título:</strong> {testProperty.title}</div>
              <div><strong>Ubicación:</strong> {testProperty.location}</div>
              <div><strong>Precio entre semana:</strong> €{testProperty.precio_entresemana}</div>
              <div><strong>Precio fin de semana:</strong> €{testProperty.precio_fin_de_semana}</div>
              <div><strong>Habitaciones:</strong> {testProperty.bedrooms}</div>
              <div><strong>Baños:</strong> {testProperty.bathrooms}</div>
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="p-3 bg-blue-100 border border-blue-300 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Instrucciones:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>1. Haz clic en "Mostrar Formulario"</div>
            <div>2. Completa algunos campos del formulario</div>
            <div>3. Haz clic en "Guardar"</div>
            <div>4. Si no hay errores y ves los datos, el formulario funciona correctamente</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { useNearbyServices, NearbyService } from '../../hooks/useNearbyServices';
import useToast from '../../hooks/useToast';

interface NearbyServicesManagerProps {
  propertyId: string;
  onServicesChange?: (services: NearbyService[]) => void;
}

const NearbyServicesManager: React.FC<NearbyServicesManagerProps> = ({ 
  propertyId, 
  onServicesChange 
}) => {
  const { 
    nearbyServices, 
    loading, 
    createNearbyService, 
    updateNearbyService, 
    deleteNearbyService, 
    getServiceTypes 
  } = useNearbyServices(propertyId);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NearbyService>>({
    service_type: 'restaurant',
    name: '',
    distance_minutes: 5,
    description: '',
    icon_name: 'UtensilsCrossed',
    color: '#F97316',
    external_url: '',
    is_active: true
  });
  
  const toast = useToast();
  const serviceTypes = getServiceTypes();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateNearbyService(editingId, formData);
        toast.success('Servicio actualizado correctamente');
      } else {
        await createNearbyService({
          ...formData,
          property_id: propertyId
        } as Omit<NearbyService, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Servicio agregado correctamente');
      }
      
      resetForm();
      if (onServicesChange) {
        onServicesChange(nearbyServices);
      }
    } catch (error) {
      toast.error('Error al guardar el servicio');
    }
  };

  const handleEdit = (service: NearbyService) => {
    setEditingId(service.id);
    setFormData({
      service_type: service.service_type,
      name: service.name,
      distance_minutes: service.distance_minutes,
      description: service.description || '',
      icon_name: service.icon_name || 'UtensilsCrossed',
      color: service.color || '#F97316',
      external_url: service.external_url || '',
      is_active: service.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        await deleteNearbyService(id);
        toast.success('Servicio eliminado correctamente');
        if (onServicesChange) {
          onServicesChange(nearbyServices);
        }
      } catch (error) {
        toast.error('Error al eliminar el servicio');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      service_type: 'restaurant',
      name: '',
      distance_minutes: 5,
      description: '',
      icon_name: 'UtensilsCrossed',
      color: '#F97316',
      external_url: '',
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getServiceTypeInfo = (type: string) => {
    return serviceTypes.find(st => st.value === type) || serviceTypes[0];
  };

  if (loading) {
    return <div className="text-center py-4">Cargando servicios...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Servicios Cercanos
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary-modern flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Servicio
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900 dark:text-white">
              {editingId ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de servicio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Servicio
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => {
                    const type = e.target.value;
                    const typeInfo = getServiceTypeInfo(type);
                    setFormData(prev => ({
                      ...prev,
                      service_type: type,
                      icon_name: typeInfo.icon,
                      color: typeInfo.color
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {serviceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Restaurante El Rincón"
                  required
                />
              </div>

              {/* Distancia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distancia (minutos)
                </label>
                <input
                  type="number"
                  value={formData.distance_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, distance_minutes: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="120"
                  required
                />
              </div>

              {/* URL externa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Externa (opcional)
                </label>
                <input
                  type="url"
                  value={formData.external_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Descripción del servicio..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary-modern"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary-modern flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de servicios */}
      <div className="space-y-3">
        {nearbyServices.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No hay servicios cercanos configurados</p>
            <p className="text-sm">Haz clic en "Agregar Servicio" para comenzar</p>
          </div>
        ) : (
          nearbyServices.map((service) => {
            const typeInfo = getServiceTypeInfo(service.service_type);
            return (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: service.color || typeInfo.color }}
                    >
                      <span className="text-sm font-semibold">
                        {service.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {typeInfo.label} • {service.distance_minutes} min
                      </p>
                      {service.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NearbyServicesManager;

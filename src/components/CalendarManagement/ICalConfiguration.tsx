import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { 
  PlugInIcon, 
  CopyIcon, 
  BoltIcon, 
  TrashBinIcon,
  PlusIcon,
  ArrowRightIcon
} from '../../icons';

interface ICalConfigurationProps {
  propertyId: string;
  propertyName?: string;
}

type ICalConfig = {
  id: string;
  property_id: string;
  name: string;
  url: string;
  type: 'import' | 'export';
  is_active: boolean;
  sync_interval: number;
  last_sync?: string;
  created_at: string;
  updated_at: string;
};

const ICalConfiguration: React.FC<ICalConfigurationProps> = ({ 
  propertyId, 
}) => {
  const [configs, setConfigs] = useState<ICalConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: '',
    url: '',
    type: 'import' as const,
    sync_interval: 24
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchICalConfigs();
  }, [propertyId]);

  const fetchICalConfigs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ical_configs')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error al obtener configuraciones iCal:', error);
      } else if (data) {
        setConfigs(data);
      }
    } catch (error) {
      console.error('Error en fetchICalConfigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddConfig = async () => {
    if (!newConfig.name || !newConfig.url) return;
    
    try {
      const { error } = await supabase
        .from('ical_configs')
        .insert({
          property_id: propertyId,
          name: newConfig.name,
          url: newConfig.url,
          type: newConfig.type,
          sync_interval: newConfig.sync_interval,
          is_active: true
        });
      
      if (error) throw error;
      
      setShowAddForm(false);
      setNewConfig({ name: '', url: '', type: 'import', sync_interval: 24 });
      fetchICalConfigs();
    } catch (error) {
      console.error('Error agregando configuración iCal:', error);
      alert('Error al agregar la configuración iCal');
    }
  };

  const handleToggleConfig = async (configId: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('ical_configs')
        .update({ is_active })
        .eq('id', configId);
      
      if (error) throw error;
      
      fetchICalConfigs();
    } catch (error) {
      console.error('Error actualizando configuración iCal:', error);
      alert('Error al actualizar la configuración');
    }
  };

  const handleDeleteConfig = async (configId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta configuración?')) return;
    
    try {
      const { error } = await supabase
        .from('ical_configs')
        .delete()
        .eq('id', configId);
      
      if (error) throw error;
      
      fetchICalConfigs();
    } catch (error) {
      console.error('Error eliminando configuración iCal:', error);
      alert('Error al eliminar la configuración');
    }
  };

  const handleSyncNow = async (configId: string) => {
    try {
      // Aquí implementarías la lógica de sincronización
      console.log('Sincronizando configuración:', configId);
      alert('Sincronización iniciada. Esto puede tomar unos minutos.');
    } catch (error) {
      console.error('Error en sincronización:', error);
      alert('Error durante la sincronización');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copiada al portapapeles');
  };

  const generatePropertyICalUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/ical/${propertyId}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'import':
        return '📥';
      case 'export':
        return '📤';
      default:
        return '🔗';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'import':
        return 'Importación';
      case 'export':
        return 'Exportación';
      default:
        return 'Otro';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <PlugInIcon className="w-5 h-5" />
          Configuración iCal
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Agregar Configuración
        </button>
      </div>

      {/* URL de Sincronización de la Propiedad */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold mb-2">URL de Sincronización de la Propiedad</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Usa esta URL para sincronizar el calendario de esta propiedad con otras plataformas:
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={generatePropertyICalUrl()}
            readOnly
            className="input input-bordered flex-1 text-sm"
          />
          <button
            onClick={() => copyToClipboard(generatePropertyICalUrl())}
            className="btn btn-outline btn-sm flex items-center gap-1"
          >
            <CopyIcon className="w-4 h-4" />
            Copiar
          </button>
        </div>
      </div>

      {/* Lista de Configuraciones */}
      {loading ? (
        <div className="text-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-2 text-gray-500">Cargando configuraciones...</p>
        </div>
      ) : configs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay configuraciones iCal para esta propiedad.</p>
          <p className="text-sm mt-1">Agrega una configuración para sincronizar con otras plataformas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {configs.map(config => (
            <div key={config.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(config.type)}</span>
                  <div>
                    <h5 className="font-semibold">{config.name}</h5>
                    <p className="text-sm text-gray-500">{getTypeName(config.type)}</p>
                                         <p className="text-xs text-gray-400">Sincronización: cada {config.sync_interval}h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="label cursor-pointer">
                                         <input
                       type="checkbox"
                       className="toggle toggle-primary toggle-sm"
                       checked={config.is_active}
                       onChange={(e) => handleToggleConfig(config.id, e.target.checked)}
                     />
                    <span className="label-text text-xs ml-2">Activo</span>
                  </label>
                  
                                     <button
                     onClick={() => handleSyncNow(config.id)}
                     className="btn btn-outline btn-sm"
                     title="Sincronizar ahora"
                   >
                     <BoltIcon className="w-4 h-4" />
                   </button>
                  
                                     <a
                     href={config.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="btn btn-outline btn-sm"
                     title="Ver URL"
                   >
                     <ArrowRightIcon className="w-4 h-4" />
                   </a>
                  
                                     <button
                     onClick={() => handleDeleteConfig(config.id)}
                     className="btn btn-outline btn-sm text-red-500 hover:text-red-700"
                     title="Eliminar"
                   >
                     <TrashBinIcon className="w-4 h-4" />
                   </button>
                </div>
              </div>
              
              {config.last_sync && (
                <div className="mt-2 text-xs text-gray-500">
                  Última sincronización: {new Date(config.last_sync).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal para Agregar Configuración */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h4 className="font-bold mb-4">Agregar Configuración iCal</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                  placeholder="Ej: Airbnb Calendar"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL del Calendario</label>
                <input
                  type="url"
                  className="input input-bordered w-full"
                  value={newConfig.url}
                  onChange={(e) => setNewConfig({...newConfig, url: e.target.value})}
                  placeholder="https://calendar.google.com/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                                 <select
                   className="select select-bordered w-full"
                   value={newConfig.type}
                   onChange={(e) => setNewConfig({...newConfig, type: e.target.value as any})}
                 >
                   <option value="import">Importación</option>
                   <option value="export">Exportación</option>
                 </select>
              </div>
              
              <div>
                                 <label className="block text-sm font-medium mb-1">Intervalo de Sincronización (horas)</label>
                 <input
                   type="number"
                   className="input input-bordered w-full"
                   value={newConfig.sync_interval}
                   onChange={(e) => setNewConfig({...newConfig, sync_interval: parseInt(e.target.value)})}
                   min="1"
                   max="168"
                 />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                className="btn btn-primary flex-1"
                onClick={handleAddConfig}
                disabled={!newConfig.name || !newConfig.url}
              >
                Agregar
              </button>
              <button
                className="btn btn-outline flex-1"
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ICalConfiguration; 
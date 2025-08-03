import React, { useState, useEffect } from 'react';
import { Plus, Eye, Search, Calendar, Building, Euro } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import PageMeta from '../../components/common/PageMeta';
import PropertiesTable from '../Properties/PropertiesTable';
import PropertiesCards from '../Properties/PropertiesCards';
import PropertyForm from '../Properties/PropertyForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Property } from '../../types';

const AdminDashboard: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Cargar propiedades
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando propiedades:', error);
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar propiedades
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || property.tipo === filterType;
    const matchesRegion = !filterRegion || property.region === filterRegion;
    
    return matchesSearch && matchesType && matchesRegion;
  });

  // Obtener tipos y regiones únicos
  const propertyTypes = [...new Set(properties.map(p => p.tipo).filter(Boolean))];
  const regions = [...new Set(properties.map(p => p.region).filter(Boolean))];

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
    toast.info(`📝 Editando: ${property.title}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleDelete = async (propertyId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
      try {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', propertyId);

        if (error) {
          console.error('Error eliminando propiedad:', error);
          toast.error('❌ Error al eliminar la propiedad', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.success('✅ Propiedad eliminada correctamente', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          loadProperties();
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('❌ Error inesperado al eliminar la propiedad', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handleSave = async (property: any) => {
    try {
      if (property.id) {
        // Update
        const { error } = await supabase
          .from('properties')
          .update(property)
          .eq('id', property.id);
        
        if (error) {
          console.error('Error updating property:', error);
          toast.error('❌ Error al actualizar la propiedad', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.success('✅ Propiedad actualizada correctamente', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        // Create
        const { error } = await supabase
          .from('properties')
          .insert([property]);
        
        if (error) {
          console.error('Error creating property:', error);
          toast.error('❌ Error al crear la propiedad', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.success('✅ Propiedad creada correctamente', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
      
      loadProperties();
      setShowForm(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ Error en la operación', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProperty(null);
    toast.info('❌ Edición cancelada', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <PageMeta
        title="Dashboard Administrativo | Gestión de Propiedades"
        description="Panel de administración para gestión completa de propiedades"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Gestión completa de propiedades</p>
          </div>
          
          <button
            onClick={() => {
              setShowForm(true);
              toast.info('📝 Creando nueva propiedad...', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Propiedad
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar propiedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por tipo */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Filtro por región */}
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las regiones</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            {/* Botón limpiar filtros */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('');
                setFilterRegion('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Propiedades</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tipos Únicos</p>
                <p className="text-2xl font-bold text-gray-900">{propertyTypes.length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Regiones</p>
                <p className="text-2xl font-bold text-gray-900">{regions.length}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Precio Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + (p.price || 0), 0) / properties.length) : 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Euro className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Vista de Propiedades */}
        {showForm ? (
          <PropertyForm
            property={editingProperty}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Propiedades ({filteredProperties.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 rounded text-sm ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Lista
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded text-sm ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Tarjetas
                  </button>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando propiedades...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No se encontraron propiedades que coincidan con los filtros.
              </div>
            ) : viewMode === "list" ? (
              <PropertiesTable
                properties={filteredProperties}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <PropertiesCards
                properties={filteredProperties}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminDashboard; 
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ListIcon, GridIcon, Phone, Mail, Calendar, User } from "lucide-react";

interface Guest {
  id: string;
  user_id: string | null;
  phone?: string;
  created_at?: string;
  users?: {
    full_name?: string;
    email?: string;
  };
  bookings_count?: number;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 md:p-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error en el componente</h2>
            <p className="text-red-600 mb-4">Ha ocurrido un error al cargar los huéspedes.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Guests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadGuests = async () => {
      try {
        await fetchGuests();
      } catch (err) {
        console.error('❌ Error in useEffect:', err);
        setError('Error al inicializar el componente');
      }
    };
    
    loadGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    setError(null);
    console.log('🔍 Fetching guests...');
    
    try {
      // Obtener huéspedes con datos de usuarios y conteo de reservas
      const { data: guestsData, error } = await supabase
        .from('guests')
        .select(`
          id, 
          user_id, 
          phone, 
          created_at,
          users(id, full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching guests:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log('📊 Guests data:', guestsData);

      // Validar que guestsData existe y es un array
      if (!guestsData || !Array.isArray(guestsData)) {
        console.log('📊 No guests data or invalid format');
        setGuests([]);
        setLoading(false);
        return;
      }

      // Obtener conteo de reservas para cada huésped
      const guestsWithBookings = await Promise.all(
        guestsData.map(async (guest: any) => {
          try {
            // Validar que guest tiene un id válido
            if (!guest || !guest.id) {
              console.warn('⚠️ Guest without valid ID:', guest);
              return null;
            }

            const { count: bookingsCount } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('guest_id', guest.id);
            
            return {
              id: guest.id,
              user_id: guest.user_id || null,
              phone: guest.phone || '',
              created_at: guest.created_at || null,
              users: guest.users ? {
                full_name: guest.users.full_name || '',
                email: guest.users.email || ''
              } : undefined,
              bookings_count: bookingsCount || 0
            };
          } catch (guestError) {
            console.error('❌ Error processing guest:', guest, guestError);
            return null;
          }
        })
      );

      // Filtrar los huéspedes válidos
      const validGuests = guestsWithBookings.filter(guest => guest !== null) as Guest[];

      console.log('🎯 Combined data with bookings:', validGuests);
      setGuests(validGuests);
    } catch (err) {
      console.error('❌ Error in fetchGuests:', err);
      setError('Error al cargar los huéspedes');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGuest({ id: '', user_id: null, phone: '' });
    setModalOpen(true);
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest({ ...guest });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingGuest) return;
    
    // Validar que user_id no esté vacío para nuevos huéspedes
    if (!editingGuest.id && (!editingGuest.user_id || editingGuest.user_id.trim() === '')) {
      setError('El ID de usuario es requerido');
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      if (editingGuest.id) {
        const { error } = await supabase.from('guests').update({
          phone: editingGuest.phone
        }).eq('id', editingGuest.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('guests').insert([{
          user_id: editingGuest.user_id,
          phone: editingGuest.phone
        }]);
        if (error) throw error;
      }
      await fetchGuests();
      setModalOpen(false);
      setEditingGuest(null);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredGuests = filter.trim() === ''
    ? guests
    : guests.filter((g) => {
        if (!g) return false;
        const search = filter.toLowerCase();
        return (
          (g.users?.full_name && g.users.full_name.toLowerCase().includes(search)) ||
          (g.users?.email && g.users.email.toLowerCase().includes(search)) ||
          (g.phone && g.phone.toLowerCase().includes(search))
        );
      });

  return (
    <ErrorBoundary>
      <div className="p-6 md:p-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Huéspedes</h1>
            <p className="text-gray-600 mt-1">Gestiona los huéspedes registrados en el sistema</p>
          </div>
          <button 
            onClick={handleAdd} 
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
          >
            Añadir huésped
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              title="Vista de lista"
            >
              <ListIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              title="Vista de cuadrícula"
            >
              <GridIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando huéspedes...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {filteredGuests.length} de {guests.length} huéspedes
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredGuests.filter(guest => guest).map(guest => (
                  <div key={guest.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {guest.users?.full_name || `Huésped ${guest.user_id?.slice(0, 8) || 'N/A'}`}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{guest.users?.email || 'Sin email'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{guest.phone || 'Sin teléfono'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Registrado: {guest.created_at ? formatDate(guest.created_at) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {guest.bookings_count || 0} reserva{guest.bookings_count !== 1 ? 's' : ''}
                        </span>
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium" 
                          onClick={() => handleEdit(guest)}
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Huésped
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registro
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reservas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGuests.filter(guest => guest).map(guest => (
                        <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {guest.users?.full_name || `Huésped ${guest.user_id?.slice(0, 8) || 'N/A'}`}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {guest.id.slice(0, 8)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{guest.users?.email || 'Sin email'}</div>
                            <div className="text-sm text-gray-500">{guest.phone || 'Sin teléfono'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guest.created_at ? formatDate(guest.created_at) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {guest.bookings_count || 0} reserva{guest.bookings_count !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-blue-600 hover:text-blue-900 transition-colors" 
                              onClick={() => handleEdit(guest)}
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !error && filteredGuests.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron huéspedes</h3>
            <p className="text-gray-500">
              {filter ? 'Intenta con otros términos de búsqueda.' : 'Aún no hay huéspedes registrados.'}
            </p>
          </div>
        )}

        {modalOpen && editingGuest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingGuest.id ? 'Editar huésped' : 'Añadir huésped'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID de Usuario
                  </label>
                  <input
                    type="text"
                    value={editingGuest.user_id || ''}
                    onChange={e => setEditingGuest({ ...editingGuest, user_id: e.target.value || null })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="UUID del usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={editingGuest.phone || ''}
                    onChange={e => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de teléfono"
                  />
                </div>
                {editingGuest.users && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-900 mb-2">Información del usuario:</div>
                    <div className="text-sm text-blue-800">
                      <div>Nombre: {editingGuest.users.full_name}</div>
                      <div>Email: {editingGuest.users.email}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => setModalOpen(false)} 
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Guests; 
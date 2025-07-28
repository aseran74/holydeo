import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ImageUploader from "../components/common/ImageUploader";
import { ListIcon, GridIcon } from "../icons";

interface Guest {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  photo_url?: string;
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
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, email, phone, photo_url, role')
      .eq('role', 'client');
    setGuests(data || []);
    setLoading(false);
    if (error) setError(error.message);
  };

  const handleAdd = () => {
    setEditingGuest({ user_id: '', full_name: '', email: '', phone: '', photo_url: '' });
    setModalOpen(true);
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest({ ...guest });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingGuest) return;
    setSaving(true);
    setError(null);
    let success = false;
    try {
      if (editingGuest.user_id) {
        const { error } = await supabase.from('profiles').update({
          full_name: editingGuest.full_name,
          email: editingGuest.email,
          phone: editingGuest.phone,
          photo_url: editingGuest.photo_url
        }).eq('user_id', editingGuest.user_id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert([{ ...editingGuest, role: 'client', user_id: editingGuest.user_id }]);
        if (error) throw error;
      }
      success = true;
      await fetchGuests();
      setModalOpen(false);
      setEditingGuest(null);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const filteredGuests = filter.trim() === ''
    ? guests
    : guests.filter((g) => {
        const search = filter.toLowerCase();
        return (
          (g.full_name && g.full_name.toLowerCase().includes(search)) ||
          (g.email && g.email.toLowerCase().includes(search)) ||
          (g.phone && g.phone.toLowerCase().includes(search))
        );
      });

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Huéspedes</h1>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <button onClick={handleAdd} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Añadir huésped</button>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Filtrar por nombre, email o teléfono..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <ListIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            <GridIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {loading ? <p>Cargando...</p> : null}
      {error ? <p className="text-red-500">{error}</p> : null}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGuests.map(guest => (
            <div key={guest.user_id} className="bg-white rounded-xl shadow p-5 text-center flex flex-col items-center">
              <img src={guest.photo_url || '/images/user/user-01.jpg'} alt="foto" className="w-24 h-24 object-cover rounded-full mb-4" />
              <h3 className="font-bold text-lg">{guest.full_name || 'Sin nombre'}</h3>
              <p className="text-sm text-gray-500">{guest.email || 'Sin email'}</p>
              <p className="text-sm text-gray-500 mt-1">{guest.phone || 'Sin teléfono'}</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800" onClick={() => handleEdit(guest)}>Editar</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mt-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Foto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map(guest => (
                <tr key={guest.user_id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-3 align-middle">
                    <img src={guest.photo_url || '/images/user/user-01.jpg'} alt="foto" className="w-10 h-10 object-cover rounded-full" />
                  </td>
                  <td className="px-6 py-3 align-middle">{guest.full_name || 'Sin nombre'}</td>
                  <td className="px-6 py-3 align-middle">{guest.email || 'Sin email'}</td>
                  <td className="px-6 py-3 align-middle">{guest.phone || 'Sin teléfono'}</td>
                  <td className="px-6 py-3 align-middle">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(guest)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modalOpen && editingGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingGuest.user_id ? 'Editar huésped' : 'Añadir huésped'}</h2>
            <div className="space-y-4">
              <ImageUploader
                bucketName="profile-photos"
                initialUrl={editingGuest.photo_url}
                onUpload={url => setEditingGuest({ ...editingGuest, photo_url: url })}
                label="Foto de perfil"
              />
              <div>
                <label className="block text-sm font-medium">Nombre completo</label>
                <input
                  type="text"
                  value={editingGuest.full_name}
                  onChange={e => setEditingGuest({ ...editingGuest, full_name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editingGuest.email}
                  onChange={e => setEditingGuest({ ...editingGuest, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="text"
                  value={editingGuest.phone || ''}
                  onChange={e => setEditingGuest({ ...editingGuest, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests; 
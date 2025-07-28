import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ImageUploader from "../../components/common/ImageUploader";
import { ListIcon, GridIcon, PencilIcon, PaperPlaneIcon } from "../../icons";
import PageMeta from "../../components/common/PageMeta";
import MessagingModal from "../../components/common/MessagingModal";

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo_url?: string;
  role?: string;
}

interface Property {
  id: string;
  title: string;
  owner_id: string;
}

const Owners = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [messagingOwner, setMessagingOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, phone, photo_url, role')
        .eq('role', 'owner');
      const owners = (data || []).map(a => ({
        ...a,
        id: a.user_id,
        name: a.full_name
      }));
      setOwners(owners);
      setLoading(false);
      if (error) setError(error.message);
    };
    fetchOwners();
  }, []);

  const handleEdit = (owner: Owner) => {
    setCurrentOwner({ ...owner });
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentOwner) return;
    const { id, ...updates } = currentOwner;
    const { error } = await supabase.from("profiles").update(updates).eq("id", id);
    if (error) {
      console.error("Error updating owner:", error);
    } else {
      setEditModalOpen(false);
      fetchData();
    }
  };

  const handleAddOwner = () => {
    setCurrentOwner({ id: '', name: '', email: '', phone: '', photo_url: '', role: 'owner' });
    setEditModalOpen(true);
  };

  const handleSaveOwner = async (updated: Owner) => {
    setSaving(true);
    setError(null);
    try {
      if (updated.id) {
        const { error } = await supabase.from('profiles').update({
          full_name: updated.name,
          email: updated.email,
          phone: updated.phone,
          photo_url: updated.photo_url
        }).eq('user_id', updated.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert([{
          full_name: updated.name,
          email: updated.email,
          phone: updated.phone,
          photo_url: updated.photo_url,
          role: 'owner',
          user_id: updated.id
        }]);
        if (error) throw error;
      }
      const { data } = await supabase
        .from('profiles')
        .select('user_id as id, full_name as name, email, phone, photo_url, role')
        .eq('role', 'owner');
      setOwners(data || []);
      setEditModalOpen(false);
      setCurrentOwner(null);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const filteredOwners = owners.filter((owner) => {
    const searchTerm = filter.toLowerCase();
    return (
      owner.name?.toLowerCase().includes(searchTerm) ||
      owner.email?.toLowerCase().includes(searchTerm) ||
      owner.phone?.toLowerCase().includes(searchTerm)
    );
  });

  const getOwnerProperties = (ownerId: string) => {
    return properties
      .filter((p) => p.owner_id === ownerId)
      .map((p) => p.title)
      .join(", ");
  };

  return (
    <>
      <PageMeta title="Propietarios" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Propietarios</h1>
          <div className="flex items-center gap-2">
            <button onClick={handleAddOwner} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Añadir propietario</button>
            <input
              type="text"
              placeholder="Buscar propietario..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full sm:w-auto"
            />
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <ListIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <GridIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 dark:bg-meta-4">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Foto</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Propiedades
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOwners.map((owner) => (
                    <tr
                      key={owner.id}
                      className="border-b border-gray-200 dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4"
                    >
                      <td className="px-4 py-3">
                        <img
                          src={
                            owner.photo_url || "/images/user/user-01.jpg"
                          }
                          alt={owner.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">{owner.name}</td>
                      <td className="px-4 py-3">{owner.email}</td>
                      <td className="px-4 py-3">{owner.phone}</td>
                      <td className="px-4 py-3">
                        {getOwnerProperties(owner.id) || "Sin propiedades"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(owner)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setMessagingOwner(owner)}
                          className="text-purple-600 hover:text-purple-800 ml-2"
                        >
                          <PaperPlaneIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredOwners.map((owner) => (
              <div
                key={owner.id}
                className="bg-white dark:bg-boxdark rounded-lg shadow-md p-5 text-center flex flex-col items-center"
              >
                <img
                  src={owner.photo_url || "/images/user/user-01.jpg"}
                  alt={owner.name}
                  className="h-24 w-24 rounded-full object-cover mb-4"
                />
                <h3 className="font-bold text-lg">{owner.name}</h3>
                <p className="text-sm text-gray-500">{owner.email}</p>
                <p className="text-sm text-gray-500 mt-1">{owner.phone}</p>
                <div className="mt-4 pt-4 border-t w-full">
                  <h4 className="font-semibold text-sm mb-2">
                    Propiedades
                  </h4>
                  <p className="text-xs text-gray-600">
                    {getOwnerProperties(owner.id) || "Sin propiedades"}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(owner)}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setMessagingOwner(owner)}
                  className="mt-4 text-purple-600 hover:text-purple-800 ml-2"
                >
                  <PaperPlaneIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editModalOpen && currentOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{currentOwner.id ? 'Editar Propietario' : 'Añadir Propietario'}</h2>
            <div className="space-y-4">
              <ImageUploader
                bucketName="profile-photos"
                initialUrl={currentOwner.photo_url}
                onUpload={(url) => setCurrentOwner({ ...currentOwner, photo_url: url })}
                label="Foto del propietario"
              />
              <div>
                <label className="block text-sm font-medium">Nombre completo</label>
                <input
                  type="text"
                  value={currentOwner.name || ''}
                  onChange={e => setCurrentOwner({ ...currentOwner, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={currentOwner.email || ''}
                  onChange={e => setCurrentOwner({ ...currentOwner, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="text"
                  value={currentOwner.phone || ''}
                  onChange={e => setCurrentOwner({ ...currentOwner, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
              <button onClick={() => handleSaveOwner(currentOwner)} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
      {messagingOwner && (
        <MessagingModal
            recipientId={messagingOwner.id}
            recipientName={messagingOwner.name}
            recipientType="owners"
            onClose={() => setMessagingOwner(null)}
        />
      )}
    </>
  );
};

export default Owners; 
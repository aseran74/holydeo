import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import ImageUploader from '../../components/common/ImageUploader';
import { ListIcon, GridIcon, PencilIcon, EyeIcon, PaperPlaneIcon } from "../../icons";
import MessagingModal from "../../components/common/MessagingModal";

interface AgencyProfile {
  id: string;
  name: string;
  contact_email?: string;
  phone?: string;
  logo_url?: string;
}

interface AgentProfile {
  id: string;
  user_id: string;
  agency_id?: string;
  phone?: string;
  avatar_url?: string;
}

const Agencies = () => {
  const [agencies, setAgencies] = useState<AgencyProfile[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<AgencyProfile | null>(null);
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [messagingAgency, setMessagingAgency] = useState<AgencyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchAgencies();
    fetchAgents();
  }, []);

  const fetchAgencies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('agencies')
      .select('id, name, contact_email, phone, logo_url');
    console.log('Agencias data:', data, 'Error:', error);
    setAgencies(data || []);
    setLoading(false);
    if (error) setError(error.message);
  };
  const fetchAgents = async () => {
    const { data: agentsData, error } = await supabase
      .from('agents')
      .select('id, user_id, agency_id, phone, avatar_url');
    console.log('Agentes data:', agentsData, 'Error:', error);
    setAgents(agentsData || []);
  };

  const getAgentsForAgency = (agencyId: string) =>
    agents.filter((a) => a.agency_id === agencyId);

  const filteredAgencies = agencies.filter((agency) => {
    const search = filter.toLowerCase();
    return (
      agency.name?.toLowerCase().includes(search) ||
      agency.contact_email?.toLowerCase().includes(search) ||
      agency.phone?.toLowerCase().includes(search)
    );
  });

  const handleEditAgency = (agency: AgencyProfile) => {
    setSelectedAgency(agency);
  };

  const handleAddAgency = () => {
    setSelectedAgency({ id: '', name: '', contact_email: '', phone: '', logo_url: '' });
    setEditModalOpen(true);
  };

  const handleSaveAgency = async (updated: AgencyProfile) => {
    if (updated.id) {
      await supabase.from('agencies').update(updated).eq('id', updated.id);
    } else {
      const { data, error } = await supabase.from('agencies').insert([updated]);
      if (error) console.error(error);
    }
    setEditModalOpen(false);
    setSelectedAgency(null);
    // Recargar lista
    const { data } = await supabase
      .from('agencies')
      .select('id, name, contact_email, phone, logo_url');
    setAgencies(data || []);
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-8">Agencias</h1>
      {!selectedAgency ? (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Agencias</h1>
            <div className="flex items-center gap-2">
              <button onClick={handleAddAgency} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Añadir agencia</button>
              <input
                type="text"
                placeholder="Filtrar..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto"
              />
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  <GridIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Foto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgencies.map((agency) => (
                    <tr key={agency.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-3 align-middle">
                        <img src={agency.logo_url || '/images/user/user-01.jpg'} alt={agency.name || 'Agencia'} className="w-12 h-12 object-contain rounded" />
                      </td>
                      <td className="px-6 py-3 align-middle">{agency.name}</td>
                      <td className="px-6 py-3 align-middle">{agency.phone}</td>
                      <td className="px-6 py-3 align-middle">{agency.contact_email}</td>
                      <td className="px-6 py-3 align-middle flex items-center gap-2">
                        <button className="text-blue-600" onClick={() => setSelectedAgency(agency)}>
                          <EyeIcon className="w-5 h-5"/>
                        </button>
                        <button className="text-green-600" onClick={() => { setSelectedAgency(agency); setEditModalOpen(true); }}>
                          <PencilIcon className="w-5 h-5"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAgencies.map((agency) => (
                <div key={agency.id} className="bg-white rounded-xl shadow p-5 text-center flex flex-col items-center">
                  <img src={agency.logo_url || '/images/user/user-01.jpg'} alt={agency.name || 'Agencia'} className="w-24 h-24 object-contain rounded-full mb-4" />
                  <h3 className="font-bold text-lg">{agency.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{agency.contact_email}</p>
                  <p className="text-sm text-gray-500">{agency.phone}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button className="text-blue-600" onClick={() => setSelectedAgency(agency)}>
                      <EyeIcon className="w-6 h-6"/>
                    </button>
                    <button className="text-green-600" onClick={() => { setSelectedAgency(agency); setEditModalOpen(true); }}>
                      <PencilIcon className="w-6 h-6"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <button className="mb-4 text-blue-600 underline" onClick={() => setSelectedAgency(null)}>
            ← Volver al listado
          </button>
          <h2 className="text-xl font-semibold mb-2">{selectedAgency.name}</h2>
          <div className="mb-2">Teléfono: {selectedAgency.phone}</div>
          <div className="mb-2">Email: {selectedAgency.contact_email}</div>
          <h3 className="mt-6 mb-2 font-bold">Agentes vinculados</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>ID Agente</TableCell>
                <TableCell isHeader>Teléfono</TableCell>
                <TableCell isHeader>Avatar</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getAgentsForAgency(selectedAgency.id).map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.user_id}</TableCell>
                  <TableCell>{agent.phone}</TableCell>
                  <TableCell>
                    {agent.avatar_url && (
                      <img src={agent.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {messagingAgency && (
        <MessagingModal
          recipientId={messagingAgency.user_id}
          recipientName={messagingAgency.username || messagingAgency.full_name || 'Agencia'}
          recipientType="agencies"
          onClose={() => setMessagingAgency(null)}
        />
      )}
      {editModalOpen && selectedAgency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{selectedAgency.id ? 'Editar Agencia' : 'Añadir Agencia'}</h2>
            <div className="space-y-4">
              <ImageUploader
                bucketName="agency-logos"
                initialUrl={selectedAgency.logo_url}
                onUpload={(url) => setSelectedAgency({ ...selectedAgency, logo_url: url })}
                label="Logo de la agencia"
              />
              <div>
                <label className="block text-sm font-medium">Nombre de la agencia</label>
                <input
                  type="text"
                  value={selectedAgency.name || ''}
                  onChange={e => setSelectedAgency({ ...selectedAgency, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email de contacto</label>
                <input
                  type="email"
                  value={selectedAgency.contact_email || ''}
                  onChange={e => setSelectedAgency({ ...selectedAgency, contact_email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="text"
                  value={selectedAgency.phone || ''}
                  onChange={e => setSelectedAgency({ ...selectedAgency, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
              <button onClick={() => handleSaveAgency(selectedAgency)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agencies; 
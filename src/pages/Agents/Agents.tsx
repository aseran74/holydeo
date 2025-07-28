import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import ImageUploader from '../../components/common/ImageUploader';
import { ListIcon, GridIcon, PencilIcon, EyeIcon, PaperPlaneIcon } from "../../icons";
import MessagingModal from "../../components/common/MessagingModal";

interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  agency_id?: string;
  photo_url?: string;
  role?: string;
}

interface Agency {
  id: string;
  name: string;
}

interface Property {
  id: string;
  title: string;
  agent_id?: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [messagingAgent, setMessagingAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
    fetchAgencies();
    fetchProperties();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, email, phone, agency_id, role')
      .eq('role', 'agent');
    const agents = (data || []).map(a => ({
      ...a,
      id: a.user_id,
      name: a.full_name
    }));
    setAgents(agents);
    setLoading(false);
    if (error) setError(error.message);
  };
  const fetchAgencies = async () => {
    const { data: agenciesData } = await supabase.from('profiles').select('user_id, full_name').eq('role', 'agency');
    const agencies = (agenciesData || []).map(a => ({
      ...a,
      id: a.user_id,
      name: a.full_name
    }));
    setAgencies(agencies);
  };
  const fetchProperties = async () => {
    const { data } = await supabase.from("properties").select("id, title, agent_id");
    setProperties(data || []);
  };

  const getAgencyName = (agencyId?: string) =>
    agencies.find((a) => a.id === agencyId)?.name || "-";

  const getPropertiesForAgent = (agentId: string) =>
    properties.filter((p) => p.agent_id === agentId);

  const filteredAgents = agents.filter((agent) => {
    const search = filter.toLowerCase();
    return (
      agent.name?.toLowerCase().includes(search) ||
      agent.email?.toLowerCase().includes(search) ||
      agent.phone?.toLowerCase().includes(search)
    );
  });

  const handleEditAgent = (agent: Agent) => {
    setEditAgent(agent);
    setEditModalOpen(true);
  };

  const handleSaveAgent = async (updated: Agent) => {
    await supabase.from('profiles').update(updated).eq('user_id', updated.id);
    setEditModalOpen(false);
    setEditAgent(null);
    fetchAgents();
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold self-start">Agentes Inmobiliarios</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditAgent({ id: '', name: '', email: '', phone: '', agency_id: '', photo_url: '', role: 'agent' }); setEditModalOpen(true); }} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Añadir agente</button>
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

      {!selectedAgent ? (
        <>
          {viewMode === 'list' ? (
            <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Foto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Agencia</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-3 align-middle">
                        <img src={agent.photo_url || '/images/user/user-01.jpg'} alt={agent.name} className="w-10 h-10 object-cover rounded-full" />
                      </td>
                      <td className="px-6 py-3 align-middle">{agent.name}</td>
                      <td className="px-6 py-3 align-middle">{agent.email}</td>
                      <td className="px-6 py-3 align-middle">{agent.phone}</td>
                      <td className="px-6 py-3 align-middle">{getAgencyName(agent.agency_id)}</td>
                      <td className="px-6 py-3 align-middle flex items-center gap-2">
                        <button className="text-blue-600" onClick={() => setSelectedAgent(agent)}>
                          <EyeIcon className="w-5 h-5"/>
                        </button>
                        <button className="text-green-600" onClick={() => { setEditAgent(agent); setEditModalOpen(true); }}>
                          <PencilIcon className="w-5 h-5"/>
                        </button>
                        <button className="text-purple-600" onClick={() => setMessagingAgent(agent)}>
                          <PaperPlaneIcon className="w-5 h-5"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-xl shadow p-5 text-center flex flex-col items-center">
                  <img src={agent.photo_url || '/images/user/user-01.jpg'} alt={agent.name} className="w-24 h-24 object-cover rounded-full mb-4" />
                  <h3 className="font-bold text-lg">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.email}</p>
                  <p className="text-sm text-gray-500 mt-1">{getAgencyName(agent.agency_id)}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button className="text-blue-600" onClick={() => setSelectedAgent(agent)}>
                      <EyeIcon className="w-6 h-6"/>
                    </button>
                    <button className="text-green-600" onClick={() => { setEditAgent(agent); setEditModalOpen(true); }}>
                      <PencilIcon className="w-6 h-6"/>
                    </button>
                    <button className="text-purple-600" onClick={() => setMessagingAgent(agent)}>
                      <PaperPlaneIcon className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <button className="mb-4 text-blue-600 underline" onClick={() => setSelectedAgent(null)}>
            ← Volver al listado
          </button>
          <h2 className="text-xl font-semibold mb-2">{selectedAgent.name}</h2>
          <div className="mb-2">Email: {selectedAgent.email}</div>
          <div className="mb-2">Teléfono: {selectedAgent.phone}</div>
          <div className="mb-2">Agencia: {getAgencyName(selectedAgent.agency_id)}</div>
          <h3 className="mt-6 mb-2 font-bold">Propiedades que gestiona</h3>
          <ul className="list-disc ml-6">
            {getPropertiesForAgent(selectedAgent.id).length > 0 ? (
              getPropertiesForAgent(selectedAgent.id).map((p) => (
                <li key={p.id}>
                  <a href={`/properties/${p.id}`} className="text-blue-600 underline">{p.title}</a>
                </li>
              ))
            ) : (
              <li className="text-gray-400">Ninguna</li>
            )}
          </ul>
        </div>
      )}
      {editModalOpen && editAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editAgent.id ? 'Editar Agente' : 'Añadir Agente'}</h2>
            <div className="space-y-4">
              <ImageUploader
                bucketName="profile-photos"
                initialUrl={editAgent.photo_url}
                onUpload={(url) => setEditAgent({ ...editAgent, photo_url: url })}
                label="Foto del agente"
              />
              <div>
                <label className="block text-sm font-medium">Nombre completo</label>
                <input
                  type="text"
                  value={editAgent.name || ''}
                  onChange={e => setEditAgent({ ...editAgent, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editAgent.email || ''}
                  onChange={e => setEditAgent({ ...editAgent, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Teléfono</label>
                <input
                  type="text"
                  value={editAgent.phone || ''}
                  onChange={e => setEditAgent({ ...editAgent, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Agencia</label>
                <select
                  value={editAgent.agency_id || ''}
                  onChange={e => setEditAgent({ ...editAgent, agency_id: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                >
                  <option value="">Sin agencia</option>
                  {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
              <button onClick={() => handleSaveAgent(editAgent)} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
      {messagingAgent && (
        <MessagingModal
          recipientId={messagingAgent.id}
          recipientName={messagingAgent.name}
          recipientType="real_estate_agents"
          onClose={() => setMessagingAgent(null)}
        />
      )}
    </div>
  );
};

export default Agents; 
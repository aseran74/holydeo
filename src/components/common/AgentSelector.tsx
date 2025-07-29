import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { UserCheck, Loader2 } from 'lucide-react';

interface Agent {
  id: string;
  user_id: string;
  agency_id?: string;
  phone?: string;
  avatar_url?: string;
  user?: {
    full_name?: string;
    email?: string;
  };
  agency?: {
    name?: string;
  };
}

interface AgentSelectorProps {
  value: string;
  onChange: (agentId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAgency?: boolean;
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar agente...",
  className = "",
  disabled = false,
  showAgency = true
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agents')
        .select(`
          id,
          user_id,
          agency_id,
          phone,
          avatar_url,
          user:users!agents_user_id_fkey (
            full_name,
            email
          ),
          agency:agencies!agents_agency_id_fkey (
            name
          )
        `)
        .order('user.full_name');

      if (error) {
        console.error('Error fetching agents:', error);
        setError('Error al cargar los agentes');
        return;
      }

      setAgents(data || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Error al cargar los agentes');
    } finally {
      setLoading(false);
    }
  };

  const selectedAgent = agents.find(agent => agent.id === value);

  return (
    <div className={`relative ${className}`}>
      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
        Agente
      </label>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          <option value="">{placeholder}</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.user?.full_name || agent.user?.email || `Agente ${agent.id.slice(0, 8)}`}
              {showAgency && agent.agency?.name && ` - ${agent.agency.name}`}
            </option>
          ))}
        </select>
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        )}
        
        {!loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <UserCheck className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {selectedAgent && (
        <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
          <div className="flex items-center gap-2">
            {selectedAgent.avatar_url && (
              <img 
                src={selectedAgent.avatar_url} 
                alt={selectedAgent.user?.full_name || 'Agente'}
                className="w-4 h-4 rounded-full"
              />
            )}
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span className="font-medium">
              {selectedAgent.user?.full_name || selectedAgent.user?.email || `Agente ${selectedAgent.id.slice(0, 8)}`}
            </span>
          </div>
          {selectedAgent.user?.email && (
            <div className="text-gray-600 dark:text-gray-400">
              📧 {selectedAgent.user.email}
            </div>
          )}
          {selectedAgent.phone && (
            <div className="text-gray-600 dark:text-gray-400">
              📞 {selectedAgent.phone}
            </div>
          )}
          {showAgency && selectedAgent.agency?.name && (
            <div className="text-gray-600 dark:text-gray-400">
              🏢 {selectedAgent.agency.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentSelector; 
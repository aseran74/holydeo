import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Building2, Loader2 } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  contact_email?: string;
  phone?: string;
  logo_url?: string;
}

interface AgencySelectorProps {
  value: string;
  onChange: (agencyId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const AgencySelector: React.FC<AgencySelectorProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar agencia...",
  className = "",
  disabled = false
}) => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching agencies:', error);
        setError('Error al cargar las agencias');
        return;
      }

      setAgencies(data || []);
    } catch (err) {
      console.error('Error fetching agencies:', err);
      setError('Error al cargar las agencias');
    } finally {
      setLoading(false);
    }
  };

  const selectedAgency = agencies.find(agency => agency.id === value);

  return (
    <div className={`relative ${className}`}>
      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
        Agencia
      </label>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          <option value="">{placeholder}</option>
          {agencies.map((agency) => (
            <option key={agency.id} value={agency.id}>
              {agency.name}
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
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {selectedAgency && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
          <div className="flex items-center gap-2">
            {selectedAgency.logo_url && (
              <img 
                src={selectedAgency.logo_url} 
                alt={selectedAgency.name}
                className="w-4 h-4 rounded"
              />
            )}
            <span className="font-medium">{selectedAgency.name}</span>
          </div>
          {selectedAgency.contact_email && (
            <div className="text-gray-600 dark:text-gray-400">
              📧 {selectedAgency.contact_email}
            </div>
          )}
          {selectedAgency.phone && (
            <div className="text-gray-600 dark:text-gray-400">
              📞 {selectedAgency.phone}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencySelector; 
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredAgencies = agencies.filter(agency => {
    const search = searchTerm.toLowerCase();
    return (
      agency.name.toLowerCase().includes(search) ||
      agency.contact_email?.toLowerCase().includes(search) ||
      agency.phone?.toLowerCase().includes(search)
    );
  });

  return (
    <div className={`relative ${className}`}>
      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
        Agencia
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline disabled:opacity-50 text-left flex justify-between items-center"
        >
          <span className={value ? '' : 'text-gray-500'}>
            {selectedAgency ? selectedAgency.name : placeholder}
          </span>
          <div className="flex items-center">
            {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin mr-2" />}
            {!loading && <Building2 className="w-4 h-4 text-gray-400" />}
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar agencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {placeholder}
              </button>
              {filteredAgencies.map((agency) => (
                <button
                  key={agency.id}
                  type="button"
                  onClick={() => {
                    onChange(agency.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium">{agency.name}</div>
                  {agency.contact_email && (
                    <div className="text-xs text-gray-500">{agency.contact_email}</div>
                  )}
                </button>
              ))}
              {filteredAgencies.length === 0 && searchTerm && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No se encontraron agencias
                </div>
              )}
            </div>
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
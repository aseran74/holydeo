import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { User, Loader2 } from 'lucide-react';

interface Owner {
  id: string;
  user_id: string;
  phone?: string;
  user?: {
    full_name?: string;
    email?: string;
  };
}

interface OwnerSelectorProps {
  value: string;
  onChange: (ownerId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const OwnerSelector: React.FC<OwnerSelectorProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar propietario...",
  className = "",
  disabled = false
}) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('owners')
        .select(`
          id,
          user_id,
          phone,
          user:users!owners_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('user.full_name');

      if (error) {
        console.error('Error fetching owners:', error);
        setError('Error al cargar los propietarios');
        return;
      }

      setOwners(data || []);
    } catch (err) {
      console.error('Error fetching owners:', err);
      setError('Error al cargar los propietarios');
    } finally {
      setLoading(false);
    }
  };

  const selectedOwner = owners.find(owner => owner.id === value);

  return (
    <div className={`relative ${className}`}>
      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
        Propietario
      </label>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          <option value="">{placeholder}</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.user?.full_name || owner.user?.email || `Propietario ${owner.id.slice(0, 8)}`}
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
            <User className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {selectedOwner && (
        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-green-600" />
            <span className="font-medium">
              {selectedOwner.user?.full_name || selectedOwner.user?.email || `Propietario ${selectedOwner.id.slice(0, 8)}`}
            </span>
          </div>
          {selectedOwner.user?.email && (
            <div className="text-gray-600 dark:text-gray-400">
              📧 {selectedOwner.user.email}
            </div>
          )}
          {selectedOwner.phone && (
            <div className="text-gray-600 dark:text-gray-400">
              📞 {selectedOwner.phone}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerSelector; 
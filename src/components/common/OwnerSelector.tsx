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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      console.log('🔍 OwnerSelector: Fetching owners...');
      const { data: ownersData, error } = await supabase
        .from('owners')
        .select('id, user_id, phone')
        .order('user_id');

      if (error) {
        console.error('❌ Error fetching owners:', error);
        setError('Error al cargar los propietarios');
        return;
      }

      console.log('📊 OwnerSelector: Owners data:', ownersData);

      // Obtener los datos de usuarios para los propietarios
      if (ownersData && ownersData.length > 0) {
        const userIds = ownersData.map(owner => owner.user_id);
        console.log('👥 OwnerSelector: User IDs:', userIds);
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .in('id', userIds);

        if (usersError) {
          console.error('❌ Error fetching users:', usersError);
          setError('Error al cargar los usuarios');
          return;
        }

        console.log('👤 OwnerSelector: Users data:', usersData);

        // Combinar los datos
        const combinedData: Owner[] = ownersData.map(owner => {
          const user = usersData?.find(u => u.id === owner.user_id);
          return {
            ...owner,
            user: user ? {
              full_name: user.full_name,
              email: user.email
            } : undefined
          };
        });

        console.log('🎯 OwnerSelector: Combined data:', combinedData);
        setOwners(combinedData);
      } else {
        setOwners([]);
      }
    } catch (err) {
      console.error('Error fetching owners:', err);
      setError('Error al cargar los propietarios');
    } finally {
      setLoading(false);
    }
  };

  const selectedOwner = owners.find(owner => owner.id === value);

  const filteredOwners = owners.filter(owner => {
    const search = searchTerm.toLowerCase();
    return (
      owner.user?.full_name?.toLowerCase().includes(search) ||
      owner.user?.email?.toLowerCase().includes(search) ||
      owner.user_id.toLowerCase().includes(search)
    );
  });

  return (
    <div className={`relative ${className}`}>
      <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">
        Propietario
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline disabled:opacity-50 text-left flex justify-between items-center"
        >
          <span className={value ? '' : 'text-gray-500'}>
            {selectedOwner 
              ? (selectedOwner.user?.full_name || selectedOwner.user?.email || `Propietario ${selectedOwner.id.slice(0, 8)}`)
              : placeholder
            }
          </span>
          <div className="flex items-center">
            {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin mr-2" />}
            {!loading && <User className="w-4 h-4 text-gray-400" />}
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar propietario..."
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
              {filteredOwners.map((owner) => (
                <button
                  key={owner.id}
                  type="button"
                  onClick={() => {
                    onChange(owner.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="font-medium">
                    {owner.user?.full_name || `Propietario ${owner.id.slice(0, 8)}`}
                  </div>
                  {owner.user?.email && (
                    <div className="text-xs text-gray-500">{owner.user.email}</div>
                  )}
                </button>
              ))}
              {filteredOwners.length === 0 && searchTerm && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No se encontraron propietarios
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
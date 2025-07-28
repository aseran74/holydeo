import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

const ROLES = ['admin', 'agency', 'agent', 'owner', 'client', 'guest'];

type User = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  phone?: string;
  photo_url?: string;
  username?: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('users_unificado')
      .select('id, user_id, full_name, email, role, phone, photo_url, username')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setUsers([]);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    const { error } = await supabase
      .from('users_unificado')
      .update({ role: newRole })
      .eq('id', id);
    if (error) {
      toast.error('Error al actualizar el rol');
    } else {
      toast.success('Rol actualizado');
      setUsers(users => users.map(u => u.id === id ? { ...u, role: newRole } : u));
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.full_name || 'Sin nombre'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.username || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

type User = {
  id: string;
  user_id?: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'agency' | 'agent' | 'client' | 'owner';
  email?: string;
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    // Consultar la nueva tabla profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) {
      toast.error('Error al cargar los usuarios. ¿Tienes permisos?');
      setLoading(false);
      return;
    }
    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      toast.error(`Error al actualizar el rol para el usuario ${userId}`);
    } else {
      toast.success('¡Rol actualizado con éxito!');
      setUsers(prevUsers =>
        prevUsers.map(p => (p.id === userId ? { ...p, role: newRole as User['role'] } : p))
      );
    }
  };

  if (loading) {
    return <div className="p-4">Cargando gestión de usuarios...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rol Actual</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cambiar Rol</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url || 'https://via.placeholder.com/150'} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.full_name || 'Sin nombre'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <option value="admin">Admin</option>
                    <option value="agency">Agencia</option>
                    <option value="agent">Agente</option>
                    <option value="client">Huésped</option>
                    <option value="owner">Propietario</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 
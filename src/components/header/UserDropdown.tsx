import { useAuth } from '../../context/AuthContext';
import { User, LogOut } from 'lucide-react';

export default function UserDropdown() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentUser.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-700 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        title="Cerrar sesión"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:block text-sm">Cerrar</span>
      </button>
    </div>
  );
}

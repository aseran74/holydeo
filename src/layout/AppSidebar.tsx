import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, 
  Building2, 
  Calendar, 
  Users, 
  User, 
  BarChart3, 
  Globe,
  Group,
  Trash2
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser, userRole, isAdmin } = useAuth();

  // Logs para depuración
  console.log('[AppSidebar] Usuario actual:', currentUser?.email);
  console.log('[AppSidebar] Rol del usuario:', userRole);
  console.log('[AppSidebar] ¿Es admin?:', isAdmin);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Propiedades', href: '/properties', icon: Building2 },
    { name: 'Experiencias', href: '/experiences', icon: Globe },
    { name: 'Reservas', href: '/bookings', icon: Calendar },
    { name: 'Agencias', href: '/agencies', icon: Users },
    { name: 'Agentes', href: '/agents', icon: Users },
    { name: 'Propietarios', href: '/owners', icon: User },
    { name: 'Red Social', href: '/social', icon: Group },
  ];

  const adminItems = [
    { name: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Gestión Usuarios', href: '/admin/users', icon: Users },
    { name: 'Gestión Social', href: '/admin/social', icon: Trash2 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 w-64 min-h-screen shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Holydeo</span>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
              <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Separador para sección de administración */}
          {isAdmin && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              <div className="px-4 py-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Administración
                </span>
              </div>
              
              {adminItems.map((item) => (
                    <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                    </Link>
              ))}
            </>
          )}
        </nav>
          </div>
      </div>
  );
};

export default AppSidebar;

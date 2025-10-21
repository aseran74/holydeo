import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  Home, 
  Building2, 
  Calendar, 
  Users, 
  User, 
  BarChart3, 
  Globe,
  Group,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { currentUser, userRole, isAdmin } = useAuth();
  const { isMobileOpen, isExpanded, toggleSidebar } = useSidebar();

  // Logs para depuración
  console.log('[AppSidebar] Usuario actual:', currentUser?.email);
  console.log('[AppSidebar] Rol del usuario:', userRole);
  console.log('[AppSidebar] ¿Es admin?:', isAdmin);
  console.log('[AppSidebar] ¿Sidebar móvil abierto?:', isMobileOpen);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = userRole === 'guest' ? [
    { name: 'Mis Reservas', href: '/guest-bookings', icon: Calendar },
    { name: 'Red Social', href: '/social', icon: Group },
    { name: 'Buscar Propiedades', href: '/search?type=properties', icon: Building2 },
    { name: 'Buscar Experiencias', href: '/search?type=experiences', icon: Star },
  ] : [
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
    { name: 'Testimonios', href: '/admin/testimonials', icon: Star },
  ];

  return (
    <div className={`fixed lg:relative inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 min-h-screen shadow-lg transform transition-all duration-300 ease-in-out ${
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    } ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className={`${isExpanded ? 'p-6 pt-20 lg:pt-6' : 'p-3 pt-20 lg:pt-3'} transition-all duration-300`}>
        {/* Botón de colapsar/expandir */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={isExpanded ? 'Contraer sidebar' : 'Expandir sidebar'}
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Logo */}
        {isExpanded && (
          <Link to="/dashboard" className="flex items-center mb-6">
            <img
              className="h-8 w-auto object-contain"
              src="/logotrans.svg"
              alt="CHISREACT Logo"
            />
          </Link>
        )}
        
        {/* Indicador del rol del usuario */}
        {userRole && isExpanded && (
          <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              Rol del Usuario
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                userRole === 'admin' ? 'bg-red-100 text-red-800' :
                userRole === 'owner' ? 'bg-purple-100 text-purple-800' :
                userRole === 'agent' ? 'bg-blue-100 text-blue-800' :
                userRole === 'guest' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {userRole === 'admin' ? 'Administrador' :
                 userRole === 'owner' ? 'Propietario' :
                 userRole === 'agent' ? 'Agente' :
                 userRole === 'guest' ? 'Huésped' :
                 userRole}
              </span>
              {userRole === 'guest' && (
                <span className="text-xs text-gray-500">
                  (Acceso limitado)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Indicador colapsado del rol */}
        {userRole && !isExpanded && (
          <div className="mb-6 flex justify-center">
            <div 
              className={`w-3 h-3 rounded-full ${
                userRole === 'admin' ? 'bg-red-500' :
                userRole === 'owner' ? 'bg-purple-500' :
                userRole === 'agent' ? 'bg-blue-500' :
                userRole === 'guest' ? 'bg-green-500' :
                'bg-gray-500'
              }`}
              title={
                userRole === 'admin' ? 'Administrador' :
                userRole === 'owner' ? 'Propietario' :
                userRole === 'agent' ? 'Agente' :
                userRole === 'guest' ? 'Huésped' :
                userRole
              }
            />
          </div>
        )}

        <nav className="space-y-2">
          {navigationItems.map((item) => (
              <Link
              key={item.name}
              to={item.href}
              className={`flex items-center ${isExpanded ? 'space-x-3 px-4' : 'justify-center px-3'} py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={!isExpanded ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && <span>{item.name}</span>}
            </Link>
          ))}

          {/* Separador para sección de administración */}
          {isAdmin && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
              {isExpanded && (
                <div className="px-4 py-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Administración
                  </span>
                </div>
              )}
              
              {adminItems.map((item) => (
                    <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center ${isExpanded ? 'space-x-3 px-4' : 'justify-center px-3'} py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && <span>{item.name}</span>}
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
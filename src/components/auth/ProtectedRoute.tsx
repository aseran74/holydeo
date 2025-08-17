import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
  toastMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, redirectTo, toastMessage }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser, userRole, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // Si Firebase aún está cargando, esperar
      if (authLoading) {
        return;
      }

      if (currentUser && userRole) {
        console.log('[ProtectedRoute] Usuario autenticado:', currentUser.email);
        console.log('[ProtectedRoute] Rol del usuario:', userRole);
        console.log('[ProtectedRoute] Roles permitidos:', allowedRoles);

        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          console.log('[ProtectedRoute] Usuario no autorizado. Rol:', userRole, 'Roles permitidos:', allowedRoles);
          setIsAuthorized(false);
        }
      } else {
        console.log('[ProtectedRoute] No hay usuario autenticado o rol no disponible');
        setIsAuthorized(false);
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, [currentUser, userRole, allowedRoles, authLoading]);

  useEffect(() => {
    if (!loading && !isAuthorized && toastMessage) {
      toast.error(toastMessage);
    }
  }, [loading, isAuthorized, toastMessage]);

  // Mostrar loading mientras Firebase se inicializa
  if (authLoading || loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">Verificando permisos...</p>
        </div>
    );
  }

  if (!isAuthorized) {
    console.log('[ProtectedRoute] Redirigiendo a:', redirectTo || "/");
    return <Navigate to={redirectTo || "/"} replace />;
  }

  console.log('[ProtectedRoute] Usuario autorizado, renderizando contenido');
  return <Outlet />;
};

export default ProtectedRoute; 
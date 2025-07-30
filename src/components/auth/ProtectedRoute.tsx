import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
  toastMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, redirectTo, toastMessage }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        console.log('[ProtectedRoute] Perfil obtenido:', profile);

        if (error) {
          console.error("Error fetching profile for auth check:", error);
          setIsAuthorized(false);
        } else if (profile && allowedRoles.includes(profile.role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } else {
        // No hay usuario logueado
        setIsAuthorized(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [allowedRoles]);

  useEffect(() => {
    if (!loading && !isAuthorized && toastMessage) {
      toast.error(toastMessage);
    }
  }, [loading, isAuthorized, toastMessage]);

  if (loading) {
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
    return <Navigate to={redirectTo || "/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 
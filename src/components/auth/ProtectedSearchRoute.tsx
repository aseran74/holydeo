import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProtectedSearchRouteProps {
  children: React.ReactNode;
}

const ProtectedSearchRoute: React.FC<ProtectedSearchRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar si el usuario viene de la página de búsqueda o del dashboard
    const referrer = document.referrer;
    const currentDomain = window.location.origin;
    
    // Verificar si el referrer es del mismo dominio y viene de /search, / o /dashboard
    const isFromSearch = referrer && 
      referrer.startsWith(currentDomain) && 
      (referrer.includes('/search') || referrer.includes('/') || referrer.includes('/dashboard'));
    
    // Si no hay referrer o no viene de la página de búsqueda, redirigir
    if (!referrer || !isFromSearch) {
      console.log('🔒 Acceso directo detectado, redirigiendo a búsqueda...');
      console.log('Referrer:', referrer);
      console.log('Current path:', location.pathname);
      
      navigate('/search', { 
        replace: true,
        state: { 
          message: 'Esta página solo es accesible desde la búsqueda',
          redirectFrom: location.pathname 
        }
      });
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default ProtectedSearchRoute; 
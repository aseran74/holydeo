import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className = '' }: { className?: string }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-red-600 hover:underline ${className}`}
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton; 
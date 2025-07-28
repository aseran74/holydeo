import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import UserDropdown from "../header/UserDropdown";
import LogoutButton from "../common/LogoutButton";
import { User } from "@supabase/supabase-js";

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 p-4 hidden md:flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'bg-white/90 shadow-lg backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={isScrolled ? '/images/logo2.png' : '/Logo4.png'}
          alt="Logo"
          className="h-10 w-auto"
        />
      </div>
      <ul className="flex space-x-8">
        <li>
          <a
            href="#hero"
            className={`text-xl font-medium transition-colors duration-300 ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-gray-200'
            }`}
          >
            Estancias
          </a>
        </li>
        <li>
          <a
            href="#experiences"
            className={`text-xl font-medium transition-colors duration-300 ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-gray-200'
            }`}
          >
            Experiencias
          </a>
        </li>
        <li>
          <a
            href="#how"
            className={`text-xl font-medium transition-colors duration-300 ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-gray-200'
            }`}
          >
            Cómo Funciona
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className={`text-xl font-medium transition-colors duration-300 ${
              isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-gray-200'
            }`}
          >
            Contacto
          </a>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <UserDropdown />
            <LogoutButton className="ml-4" />
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="text-gray-800 dark:text-white"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-md bg-blue-600 text-white"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar; 
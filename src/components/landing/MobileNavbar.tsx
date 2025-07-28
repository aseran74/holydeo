import { Home, Compass, Heart, User } from 'lucide-react';

const MobileNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white bg-opacity-95 shadow-lg p-3 z-50 flex justify-around items-center md:hidden">
      <a
        href="#hero"
        className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 text-sm"
      >
        <Home size={20} />
        <span className="mt-1">Inicio</span>
      </a>
      <a
        href="#experiences"
        className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 text-sm"
      >
        <Compass size={20} />
        <span className="mt-1">Explorar</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 text-sm"
      >
        <Heart size={20} />
        <span className="mt-1">Favoritos</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 text-sm"
      >
        <User size={20} />
        <span className="mt-1">Perfil</span>
      </a>
    </nav>
  );
};

export default MobileNavbar; 
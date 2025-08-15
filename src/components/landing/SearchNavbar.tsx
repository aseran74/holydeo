import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";

const SearchNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  // Debug temporal para ver los datos del usuario
  if (currentUser) {
    console.log('Usuario en SearchNavbar:', {
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      uid: currentUser.uid,
      providerData: currentUser.providerData
    });
  }

  const menuItems = [
    { name: "Buscar", href: "/properties" },
    { name: "Como funciona", href: "#how-it-works" },
    { name: "FAQ", href: "#faq" },
    { name: "Contacto", href: "#contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Pequeña función de ayuda para mantener el JSX limpio
  const isGoogleProvider = currentUser?.providerData?.some(
    (p) => p.providerId === "google.com"
  );

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/logotrans-white.svg"
                alt="Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href.replace("#", ""))}
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Button and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Firebase User Button */}
            <div className="hidden md:block">
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                    <span className="text-sm text-white">
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                    </span>
                    {/* Logo de Google si el proveedor es Google */}
                    {isGoogleProvider && (
                      <img src="/images/google-logo.svg" alt="Google" className="w-4 h-4" />
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-white hover:text-red-200 px-2 py-1 rounded text-sm transition-all duration-300 hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-white/10"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-blue-200 focus:outline-none focus:text-blue-200 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700/95 backdrop-blur-md shadow-lg">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.replace("#", ""))}
                className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 w-full text-left hover:bg-white/10"
              >
                {item.name}
              </button>
            ))}
            {/* Mobile User Button */}
            <div className="pt-4 pb-3 border-t border-white/20">
              <div className="flex justify-center">
                {currentUser ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      {currentUser.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt={currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                      <span className="text-sm text-white">
                        {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                      </span>
                      {/* Logo de Google si el proveedor es Google */}
                      {isGoogleProvider && (
                        <img src="/images/google-logo.svg" alt="Google" className="w-4 h-4" />
                      )}
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-1 text-white hover:text-red-200 px-2 py-1 rounded text-sm transition-all duration-300 hover:bg-white/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-white/10"
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SearchNavbar; 
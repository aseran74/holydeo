import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();

  // Efecto para detectar scroll y cambiar el estilo de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug temporal para ver los datos del usuario
  if (currentUser) {
    console.log('Usuario en LandingNavbar:', {
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
  // const isGoogleProvider = currentUser?.providerData?.some(
  //   (p) => p.providerId === "google.com"
  // );

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-md' 
        : 'bg-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={isScrolled ? "/logotrans.svg" : "/logotrans-white.svg"}
                alt="Logo"
                className="h-8 w-auto transition-all duration-300"
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                      : 'text-white hover:text-blue-200'
                  }`}
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
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <User className={`w-5 h-5 ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`} />
                    )}
                    <span className={`text-sm transition-all duration-300 ${
                      isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
                    }`}>
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-all duration-300 ${
                      isScrolled 
                        ? 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400' 
                        : 'text-white hover:text-red-200'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                      : 'text-white hover:text-blue-200'
                  }`}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`hover:text-blue-200 focus:outline-none focus:text-blue-200 transition-all duration-300 ${
                  isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
                }`}
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
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 backdrop-blur-md shadow-lg transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/95 dark:bg-gray-900/95' 
              : 'bg-white/20 dark:bg-gray-900/20'
          }`}>
            {menuItems.map((item) => (
                              <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href.replace("#", ""))}
                  className={`hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 w-full text-left ${
                    isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
                  }`}
                >
                  {item.name}
                </button>
            ))}
            {/* Mobile User Button */}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center">
                {currentUser ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      {currentUser.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt={currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                                              ) : (
                          <User className={`w-5 h-5 ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`} />
                        )}
                        <span className={`text-sm transition-all duration-300 ${
                          isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
                        }`}>
                          {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                        </span>
                      </div>
                    <button
                      onClick={logout}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-all duration-300 ${
                        isScrolled 
                          ? 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400' 
                          : 'text-white hover:text-red-200'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                        : 'text-white hover:text-blue-200'
                    }`}
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

export default LandingNavbar;
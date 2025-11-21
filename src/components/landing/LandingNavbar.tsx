import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageToggleButton } from "../common/LanguageToggleButton";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import { Menu, X, User, LogOut, ChevronDown, Home, Calendar, Users, Building2, Star } from "lucide-react";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const { currentUser, logout, userRole } = useAuth();
  const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Detectar si estamos en la landing page
    const isLandingPage = location.pathname === '/';
    const isTransparentLandingNav = isLandingPage && !isScrolled;

  // Efecto para detectar scroll y cambiar el estilo de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para cerrar el dropdown del avatar cuando se haga clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAvatarDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.avatar-dropdown')) {
          setIsAvatarDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAvatarDropdownOpen]);

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
    { name: t('navbar.search'), href: "/search" },
    { name: t('navbar.howItWorks'), href: "#how-it-works" },
    { name: t('navbar.faq'), href: "#faq" },
    { name: t('navbar.contact'), href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      // Es un enlace interno (sección de la página)
      const sectionId = href.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMenuOpen(false);
    } else {
      // Es un enlace externo (nueva página)
      navigate(href);
    }
  };

  // Función para obtener la ruta del dashboard según el rol del usuario
  const getDashboardRoute = () => {
    switch (userRole) {
      case 'guest':
        return '/guest-dashboard';
      case 'admin':
        return '/admin';
      case 'owner':
        return '/owner-dashboard';
      case 'agent':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

    // Función para obtener el nombre del dashboard según el rol
    const getDashboardName = () => {
      switch (userRole) {
        case 'guest':
          return t('navbar.guestDashboard');
        case 'admin':
          return t('navbar.adminDashboard');
        case 'owner':
          return t('navbar.ownerDashboard');
        case 'agent':
          return t('navbar.agentDashboard');
        default:
          return t('navbar.dashboard');
      }
    };

    type MobileActionVariant = 'dashboard' | 'bookings' | 'social' | 'logout';

    const getMobileActionClasses = (variant: MobileActionVariant) => {
      const base = "flex items-center justify-center w-full px-3 py-2 rounded-md text-sm font-medium transition-all duration-300";
      
      if (isTransparentLandingNav) {
        const variantPalette: Record<MobileActionVariant, string> = {
          dashboard: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30",
          bookings: "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/30",
          social: "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/30",
          logout: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/30"
        };
        return `${base} ${variantPalette[variant]}`;
      }

      if (isScrolled || !isLandingPage) {
        const variantPalette: Record<MobileActionVariant, string> = {
          dashboard: "text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30",
          bookings: "text-gray-700 dark:text-gray-200 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30",
          social: "text-gray-700 dark:text-gray-200 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30",
          logout: "text-gray-700 dark:text-gray-200 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
        };
        return `${base} ${variantPalette[variant]}`;
      }

      const variantPalette: Record<MobileActionVariant, string> = {
        dashboard: "text-white bg-white/20 hover:bg-white/30",
        bookings: "text-white bg-white/20 hover:bg-white/30",
        social: "text-white bg-white/20 hover:bg-white/30",
        logout: "text-white bg-red-500/20 hover:bg-red-500/30"
      };

      return `${base} ${variantPalette[variant]}`;
    };

  // Pequeña función de ayuda para mantener el JSX limpio
  // const isGoogleProvider = currentUser?.providerData?.some(
  //   (p) => p.providerId === "google.com"
  // );

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-md' 
        : isLandingPage 
          ? 'bg-transparent backdrop-blur-sm'
          : 'bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center transition-transform duration-200 hover:scale-105">
              <img
                className="h-10 w-auto max-w-[160px] object-contain transition-all duration-200"
                src={isLandingPage && !isScrolled ? "/logotrans-white.svg" : "/logotrans.svg"}
                alt="CHISREACT Logo"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                      : isLandingPage
                        ? 'text-white hover:text-blue-200'
                        : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Button and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language and Theme Toggle Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <LanguageToggleButton />
              <ThemeToggleButton />
            </div>
            {/* Firebase User Button */}
            <div className="hidden md:block">
              {currentUser ? (
                <div className="relative avatar-dropdown">
                  {/* Avatar con dropdown */}
                  <button
                    onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
                  >
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <User className={`w-5 h-5 ${isScrolled ? 'text-gray-700 dark:text-gray-200' : isLandingPage ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`} />
                    )}
                    <span className={`text-sm transition-all duration-300 ${
                      isScrolled ? 'text-gray-700 dark:text-gray-200' : isLandingPage ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isAvatarDropdownOpen ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-gray-700 dark:text-gray-200' : isLandingPage ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`} />
                  </button>

                  {/* Dropdown del avatar */}
                  {isAvatarDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      {/* Información del usuario */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentUser.displayName || t('navbar.user')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {currentUser.email}
                        </p>
                        {userRole && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            userRole === 'admin' ? 'bg-red-100 text-red-800' :
                            userRole === 'owner' ? 'bg-purple-100 text-purple-800' :
                            userRole === 'agent' ? 'bg-blue-100 text-blue-800' :
                            userRole === 'guest' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {userRole === 'admin' ? t('navbar.administrator') :
                             userRole === 'owner' ? t('navbar.owner') :
                             userRole === 'agent' ? t('navbar.agent') :
                             userRole === 'guest' ? t('navbar.guest') :
                             userRole}
                          </span>
                        )}
                      </div>

                      {/* Enlace al dashboard */}
                      <Link
                        to={getDashboardRoute()}
                        onClick={() => setIsAvatarDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Home className="w-4 h-4 mr-3" />
                        {getDashboardName()}
                      </Link>

                                    {/* Enlaces adicionales según el rol */}
              {userRole === 'guest' && (
                <>
                  <Link
                    to="/guest-bookings"
                    onClick={() => setIsAvatarDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    {t('navbar.myBookings')}
                  </Link>
                  <Link
                    to="/social"
                    onClick={() => setIsAvatarDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    {t('navbar.social')}
                  </Link>
                  
                  {/* Separador */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  
                  <Link
                    to="/search?type=properties"
                    onClick={() => setIsAvatarDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Building2 className="w-4 h-4 mr-3" />
                    {t('navbar.searchProperties')}
                  </Link>
                  <Link
                    to="/search?type=experiences"
                    onClick={() => setIsAvatarDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Star className="w-4 h-4 mr-3" />
                    {t('navbar.searchExperiences')}
                  </Link>
                </>
              )}

                      {/* Separador */}
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                      {/* Botón de cerrar sesión */}
                      <button
                        onClick={() => {
                          logout();
                          setIsAvatarDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {t('navbar.logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/register"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                        : isLandingPage
                          ? 'text-white hover:text-blue-200'
                          : 'text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {t('navbar.register')}
                  </Link>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ${
                      isScrolled
                        ? 'hover:bg-blue-700'
                        : isLandingPage
                          ? 'hover:bg-blue-700'
                          : 'hover:bg-blue-700'
                    }`}
                  >
                    {t('navbar.login')}
                  </Link>
                </div>
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
                : isLandingPage
                  ? 'bg-gray-900/85 border-t border-white/10'
                  : 'bg-white/90 dark:bg-gray-900/90'
            }`}>
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 w-full text-left ${
                    isScrolled || !isLandingPage
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                      : 'text-white hover:text-blue-200/90 hover:bg-white/10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            {/* Mobile User Button */}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {/* Language and Theme Toggle Buttons for Mobile */}
              <div className="flex justify-center items-center space-x-2 mb-4">
                <LanguageToggleButton />
                <ThemeToggleButton />
              </div>
              <div className="flex justify-center">
                {currentUser ? (
                  <div className="flex flex-col items-center space-y-3 w-full">
                    {/* Información del usuario */}
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
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium transition-all duration-300 ${
                          isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
                        }`}>
                          {currentUser.displayName || currentUser.email?.split('@')[0] || t('navbar.user')}
                        </span>
                        {userRole && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            userRole === 'admin' ? 'bg-red-100 text-red-800' :
                            userRole === 'owner' ? 'bg-purple-100 text-purple-800' :
                            userRole === 'agent' ? 'bg-blue-100 text-blue-800' :
                            userRole === 'guest' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {userRole === 'admin' ? t('navbar.administrator') :
                             userRole === 'owner' ? t('navbar.owner') :
                             userRole === 'agent' ? t('navbar.agent') :
                             userRole === 'guest' ? t('navbar.guest') :
                             userRole}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Enlace al dashboard */}
                      <Link
                        to={getDashboardRoute()}
                        onClick={() => setIsMenuOpen(false)}
                        className={getMobileActionClasses('dashboard')}
                      >
                      <Home className="w-4 h-4 mr-2" />
                      {getDashboardName()}
                    </Link>

                    {/* Enlaces adicionales para guest en móvil */}
                    {userRole === 'guest' && (
                      <>
                          <Link
                            to="/guest-bookings"
                            onClick={() => setIsMenuOpen(false)}
                            className={getMobileActionClasses('bookings')}
                          >
                          <Calendar className="w-4 h-4 mr-2" />
                          {t('navbar.myBookings')}
                        </Link>
                          <Link
                            to="/social"
                            onClick={() => setIsMenuOpen(false)}
                            className={getMobileActionClasses('social')}
                          >
                          <Users className="w-4 h-4 mr-2" />
                          {t('navbar.social')}
                        </Link>
                      </>
                    )}

                    {/* Botón de cerrar sesión */}
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className={getMobileActionClasses('logout')}
                      >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('navbar.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/register"
                      className={`px-3 py-2 rounded-md text-base font-medium text-center transition-all duration-300 ${
                        isScrolled
                          ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                          : 'text-white hover:text-blue-200'
                      }`}
                    >
                      {t('navbar.register')}
                    </Link>
                    <Link
                      to="/login"
                      className={`px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 text-center transition-all duration-300 ${
                        isScrolled
                          ? 'hover:bg-blue-700'
                          : 'hover:bg-blue-700'
                      }`}
                    >
                      {t('navbar.login')}
                    </Link>
                  </div>
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
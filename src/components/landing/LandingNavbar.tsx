import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageToggleButton } from "../common/LanguageToggleButton";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  Home, 
  Calendar, 
  Users, 
  Building2, 
  Star, 
  Search, 
  HelpCircle, 
  CreditCard, 
  Info, 
  MessageCircle, 
  Briefcase, 
  TrendingUp, 
  Shield,
  MapPin,
  CheckCircle
} from "lucide-react";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const { currentUser, logout, userRole } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isLandingPage = location.pathname === '/';

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isAvatarDropdownOpen && !target.closest('.avatar-dropdown')) {
        setIsAvatarDropdownOpen(false);
      }
      if (openDropdown && !target.closest('.menu-dropdown')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAvatarDropdownOpen, openDropdown]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Items del menú
  const menuItems = [
    { 
      name: t('navbar.search'), 
      href: "/search",
      icon: Search,
      description: "Busca propiedades y experiencias"
    },
    { 
      name: t('navbar.howItWorks'), 
      href: "#how-it-works",
      icon: Info,
      description: "Conoce cómo funciona",
      submenu: [
        { 
          name: "Explora y elige", 
          href: "/search",
          icon: MapPin,
          description: "Filtra por ubicación, duración y tipo"
        },
        { 
          name: "Reserva fácil", 
          href: "/reserva-facil",
          icon: CreditCard,
          description: "Selecciona fechas y completa el pago"
        },
        { 
          name: "Disfruta tu estancia", 
          href: "/disfruta-tu-estancia",
          icon: CheckCircle,
          description: "Todo listo para tu llegada"
        }
      ]
    },
    { 
      name: "Agencias", 
      href: "/agencias-colaboradoras",
      icon: Briefcase,
      description: "Agencias colaboradoras",
      submenu: [
        { 
          name: "Ver agencias", 
          href: "/agencias-colaboradoras",
          icon: Building2,
          description: "Lista de agencias colaboradoras"
        },
        { 
          name: "Ser agente", 
          href: "/ser-agente",
          icon: TrendingUp,
          description: "Únete como agente inmobiliario"
        },
        { 
          name: "Ventajas", 
          href: "/ventajas-agente",
          icon: Shield,
          description: "Beneficios para agencias"
        }
      ]
    },
    { 
      name: t('navbar.faq'), 
      href: "#faq",
      icon: HelpCircle,
      description: "Preguntas frecuentes",
      submenu: [
        { 
          name: "Reservas", 
          href: "#faq",
          icon: Calendar,
          description: "Cómo reservar y cancelar"
        },
        { 
          name: "Pagos", 
          href: "#faq",
          icon: CreditCard,
          description: "Métodos de pago aceptados"
        },
        { 
          name: "Propiedades", 
          href: "#faq",
          icon: Home,
          description: "Información sobre propiedades"
        },
        { 
          name: "Soporte", 
          href: "#faq",
          icon: MessageCircle,
          description: "Ayuda y soporte técnico"
        }
      ]
    },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const sectionId = href.replace("#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMenuOpen(false);
    } else {
      navigate(href);
      setIsMenuOpen(false);
    }
  };

  const getDashboardRoute = () => {
    switch (userRole) {
      case 'guest': return '/guest-dashboard';
      case 'admin': return '/admin';
      case 'owner': return '/owner-dashboard';
      case 'agent': return '/dashboard';
      default: return '/dashboard';
    }
  };

  const getDashboardName = () => {
    switch (userRole) {
      case 'guest': return t('navbar.guestDashboard');
      case 'admin': return t('navbar.adminDashboard');
      case 'owner': return t('navbar.ownerDashboard');
      case 'agent': return t('navbar.agentDashboard');
      default: return t('navbar.dashboard');
    }
  };

  const handleMobileLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      scrollToSection(href);
    } else {
      navigate(href);
    }
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-md' 
        : isLandingPage 
          ? 'bg-transparent backdrop-blur-sm'
          : 'bg-white shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-transform duration-200 hover:scale-105">
            <img
              className="h-10 w-auto max-w-[160px] object-contain transition-all duration-200"
              src={isLandingPage && !isScrolled ? "/logotrans-white.svg" : "/logotrans.svg"}
              alt="Holydeo Logo"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                
                return (
                  <div key={item.name} className="relative menu-dropdown">
                    {hasSubmenu ? (
                      <button
                        onClick={() => {
                          setOpenDropdown(openDropdown === item.name ? null : item.name);
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                          isScrolled
                            ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                            : isLandingPage
                              ? 'text-white hover:text-blue-200'
                              : 'text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.name}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                          openDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>
                    ) : item.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                          isScrolled
                            ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                            : isLandingPage
                              ? 'text-white hover:text-blue-200'
                              : 'text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                          isScrolled
                            ? 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                            : isLandingPage
                              ? 'text-white hover:text-blue-200'
                              : 'text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    )}

                    {/* Desktop Dropdown */}
                    {hasSubmenu && openDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                        <div className="p-4">
                          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            {item.name}
                          </h3>
                          <div className="space-y-1">
                            {item.submenu?.map((subItem, index) => {
                              const SubIconComponent = subItem.icon;
                              return subItem.href.startsWith('#') ? (
                                <button
                                  key={index}
                                  onClick={() => {
                                    scrollToSection(subItem.href);
                                    setOpenDropdown(null);
                                  }}
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                                >
                                  <div className="flex items-start gap-3">
                                    <SubIconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        {subItem.name}
                                      </div>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {subItem.description}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ) : (
                                <Link
                                  key={index}
                                  to={subItem.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group block"
                                >
                                  <div className="flex items-start gap-3">
                                    <SubIconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        {subItem.name}
                                      </div>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {subItem.description}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - User & Mobile Button */}
          <div className="flex items-center space-x-4">
            {/* Language and Theme Toggle - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <LanguageToggleButton />
              <ThemeToggleButton />
            </div>

            {/* User Button - Desktop */}
            <div className="hidden md:block">
              {currentUser ? (
                <div className="relative avatar-dropdown">
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
                      <User className={`w-5 h-5 ${isScrolled ? 'text-gray-700 dark:text-gray-200' : isLandingPage ? 'text-white' : 'text-gray-900 dark:text-gray-200'}`} />
                    )}
                    <span className={`text-sm transition-all duration-300 ${
                      isScrolled ? 'text-gray-700 dark:text-gray-200' : isLandingPage ? 'text-white' : 'text-gray-900 dark:text-gray-200'
                    }`}>
                      {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isAvatarDropdownOpen ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-gray-700 dark:text-gray-200' : isLandingPage ? 'text-white' : 'text-gray-900 dark:text-gray-200'}`} />
                  </button>

                  {/* Avatar Dropdown */}
                  {isAvatarDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
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

                      <Link
                        to={getDashboardRoute()}
                        onClick={() => setIsAvatarDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Home className="w-4 h-4 mr-3" />
                        {getDashboardName()}
                      </Link>

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

                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
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
                          : 'text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {t('navbar.register')}
                  </Link>
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isLandingPage
                          ? 'bg-white text-blue-600 hover:bg-blue-50'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {t('navbar.login')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden hover:text-blue-200 focus:outline-none focus:text-blue-200 transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-200' 
                  : isLandingPage 
                    ? 'text-white' 
                    : 'text-gray-900 dark:text-gray-200'
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30"
          style={{ top: '4rem', zIndex: 99998 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-gray-900 shadow-xl rounded-b-3xl max-h-[calc(100vh-4rem)] overflow-y-auto"
          style={{ 
            zIndex: 99999,
            position: 'fixed',
            pointerEvents: 'auto'
          }}
        >
          <div 
            className="px-4 py-3 space-y-2"
            style={{ pointerEvents: 'auto' }}
          >
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isMobileDropdownOpen = openMobileDropdown === item.name;
              
              return (
                <div key={item.name}>
                  {/* Item principal */}
                  {hasSubmenu ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMobileDropdown(isMobileDropdownOpen ? null : item.name);
                      }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-left border border-gray-200 dark:border-gray-700"
                      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100000 }}
                    >
                      <div className="flex items-center">
                        <IconComponent className="w-5 h-5 mr-2" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        isMobileDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMobileLinkClick(item.href);
                      }}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-left border border-gray-200 dark:border-gray-700"
                      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100000 }}
                    >
                      <div className="flex items-center">
                        <IconComponent className="w-5 h-5 mr-2" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  )}
                  
                  {/* Subitems como enlaces directos - solo cuando está desplegado */}
                  {hasSubmenu && isMobileDropdownOpen && item.submenu?.map((subItem, index) => {
                    const SubIconComponent = subItem.icon;
                    return (
                      <Link
                        key={index}
                        to={subItem.href}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMobileLinkClick(subItem.href);
                        }}
                        className="flex items-start gap-3 w-full px-4 py-3 ml-4 rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 100000 }}
                      >
                        <SubIconComponent className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <div>
                          <div className="text-sm font-bold mb-1">{subItem.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{subItem.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}

            {/* Mobile User Section */}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <LanguageToggleButton />
                <ThemeToggleButton />
              </div>
              
              {currentUser ? (
                <div className="flex flex-col items-center space-y-3 w-full">
                  <div className="flex items-center space-x-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
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

                  <Link
                    to={getDashboardRoute()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 border border-blue-200 dark:border-blue-800"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {getDashboardName()}
                  </Link>

                  {userRole === 'guest' && (
                    <>
                      <Link
                        to="/guest-bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 border border-green-200 dark:border-green-800"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {t('navbar.myBookings')}
                      </Link>
                      <Link
                        to="/social"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 border border-purple-200 dark:border-purple-800"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {t('navbar.social')}
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 border border-red-200 dark:border-red-800"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('navbar.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 w-full">
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full inline-flex justify-center px-4 py-3 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 border border-blue-200 dark:border-blue-800"
                  >
                    {t('navbar.register')}
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full inline-flex justify-center px-4 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                  >
                    {t('navbar.login')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;

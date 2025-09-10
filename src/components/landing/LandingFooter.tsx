import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    propiedades: [
      { name: 'Buscar Propiedades', href: '/properties' },
      { name: 'Propiedades Destacadas', href: '/properties?featured=true' },
      { name: 'Nuevas Propiedades', href: '/properties?new=true' },
      { name: 'Mapa de Propiedades', href: '/properties?view=map' }
    ],
    experiencias: [
      { name: 'Todas las Experiencias', href: '/experiences' },
      { name: 'Experiencias Destacadas', href: '/experiences?featured=true' },
      { name: 'Categorías', href: '/experiences?view=categories' },
      { name: 'Calendario de Eventos', href: '/experiences?view=calendar' }
    ],
    soporte: [
      { name: 'Centro de Ayuda', href: '/help' },
      { name: 'Contacto', href: '/contact' },
      { name: 'Política de Privacidad', href: '/privacy' },
      { name: 'Términos de Servicio', href: '/terms' }
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '/about' },
      { name: 'Nuestro Equipo', href: '/team' },
      { name: 'Carreras', href: '/careers' },
      { name: 'Prensa', href: '/press' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Sección principal del footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img 
                src="/logotrans-white.svg" 
                alt="CHISREACT Logo" 
                className="h-10 w-auto max-w-[160px] object-contain"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Descubre las mejores propiedades para tus vacaciones. Conectamos viajeros con anfitriones excepcionales para crear experiencias únicas e inolvidables.
            </p>
            
            {/* Información de contacto */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <a 
                  href="tel:+34900123456" 
                  className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  +34 900 123 456
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <a 
                  href="mailto:info@chisreact.com" 
                  className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  info@chisreact.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <a 
                  href="https://www.google.com/maps/search/Madrid,+España" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Madrid, España
                </a>
              </div>
            </div>
          </div>

          {/* Enlaces de Propiedades */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Propiedades</h3>
            <ul className="space-y-2">
              {footerLinks.propiedades.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces de Experiencias */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Experiencias</h3>
            <ul className="space-y-2">
              {footerLinks.experiencias.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces de Soporte y Empresa */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sección inferior del footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} CHISREACT. Todos los derechos reservados.
            </div>

            {/* Redes sociales */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Enlaces legales */}
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacidad
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Términos
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter; 
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo/logo.svg"
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
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Button and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Clerk User Button */}
            <div className="hidden md:block">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600 dark:focus:text-blue-400"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href.replace("#", ""))}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
              >
                {item.name}
              </button>
            ))}
            {/* Mobile User Button */}
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar; 
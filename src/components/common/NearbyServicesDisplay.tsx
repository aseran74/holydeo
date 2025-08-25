import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { NearbyService } from '../../hooks/useNearbyServices';

interface NearbyServicesDisplayProps {
  services: NearbyService[];
  title?: string;
}

const NearbyServicesDisplay: React.FC<NearbyServicesDisplayProps> = ({ 
  services, 
  title = "Servicios Cercanos" 
}) => {
  if (!services || services.length === 0) {
    return null;
  }

  const getServiceIcon = (iconName: string) => {
    // Mapeo de nombres de iconos a emojis
    const iconMap: { [key: string]: string } = {
      'UtensilsCrossed': '🍽️',
      'ShoppingBag': '🛍️',
      'HeartPulse': '💊',
      'Car': '🚗',
      'Waves': '🌊',
      'TreePine': '🌲',
      'ShoppingCart': '🛒',
      'Landmark': '🏛️',
      'Gamepad2': '🎮',
      'Trophy': '🏆',
      'Stethoscope': '🏥',
      'GraduationCap': '🎓'
    };

    return iconMap[iconName] || iconMap['UtensilsCrossed'];
  };

  const getServiceTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'restaurant': 'Restaurante',
      'supermarket': 'Supermercado',
      'pharmacy': 'Farmacia',
      'transport': 'Transporte',
      'beach': 'Playa',
      'park': 'Parque',
      'shopping': 'Compras',
      'historic': 'Histórico',
      'entertainment': 'Entretenimiento',
      'sports': 'Deportes',
      'health': 'Salud',
      'education': 'Educación'
    };

    return typeMap[type] || type;
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Descubre todo lo que tienes cerca de esta propiedad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header del servicio */}
              <div 
                className="h-20 flex items-center justify-center"
                style={{ backgroundColor: service.color || '#3B82F6' }}
              >
                <div className="text-white text-2xl">
                  {getServiceIcon(service.icon_name || 'UtensilsCrossed')}
                </div>
              </div>

              {/* Contenido del servicio */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {service.name}
                  </h3>
                  {service.external_url && (
                    <a
                      href={service.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {service.distance_minutes} min a pie
                  </span>
                </div>

                <div className="mb-4">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${service.color || '#3B82F6'}20`,
                      color: service.color || '#3B82F6'
                    }}
                  >
                    {getServiceTypeLabel(service.service_type)}
                  </span>
                </div>

                {service.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Necesitas más información?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Todos estos servicios están verificados y actualizados regularmente. 
              Si necesitas información adicional sobre algún servicio específico, 
              no dudes en contactarnos.
            </p>
            <button className="btn-primary-modern">
              Contactar para más información
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyServicesDisplay;

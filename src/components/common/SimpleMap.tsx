import React from 'react';
import { MapPinIcon } from '../../icons';

interface SimpleMapProps {
  location: string;
  className?: string;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ location, className = "h-96" }) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-center">
        <MapPinIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          {location}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Mapa interactivo próximamente
        </p>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            🔄 Integración con Google Maps en desarrollo
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;

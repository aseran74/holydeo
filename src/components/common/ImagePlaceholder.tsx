import React from 'react';
import { WifiOff, Home, Image as ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  className?: string;
  type?: 'property' | 'experience' | 'general';
  showRetry?: boolean;
  onRetry?: () => void;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  className = '',
  type = 'general',
  showRetry = true,
  onRetry
}) => {
  const getIcon = () => {
    switch (type) {
      case 'property':
        return <Home className="w-8 h-8 text-gray-400" />;
      case 'experience':
        return <ImageIcon className="w-8 h-8 text-gray-400" />;
      default:
        return <ImageIcon className="w-8 h-8 text-gray-400" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'property':
        return 'Imagen de propiedad';
      case 'experience':
        return 'Imagen de experiencia';
      default:
        return 'Imagen';
    }
  };

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="text-center">
        {getIcon()}
        <p className="text-sm text-gray-500 mt-2">{getTitle()}</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          <WifiOff className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">Sin conexión</span>
        </div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePlaceholder;

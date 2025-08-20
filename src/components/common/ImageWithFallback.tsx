import React, { useState, useCallback } from 'react';
import { RefreshCw, Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
  children?: React.ReactNode;
}

// SVG placeholder como fallback por defecto
const defaultFallbackSrc = "data:image/svg+xml;base64," + btoa(`
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f3f4f6"/>
  <g fill="#9ca3af" transform="translate(200,150)">
    <rect x="-20" y="-15" width="40" height="20" rx="2"/>
    <circle cx="-10" cy="-5" r="3"/>
    <polygon points="-15,-5 -5,-15 5,-5"/>
  </g>
  <text x="200" y="180" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">Imagen no disponible</text>
</svg>
`);

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = defaultFallbackSrc,
  className = '',
  onError,
  onLoad,
  children
}) => {
  const [imgSrc, setImgSrc] = useState(src || defaultFallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logging
  console.log('ImageWithFallback - src:', src, 'imgSrc:', imgSrc, 'hasError:', hasError, 'isLoading:', isLoading);

  const handleError = useCallback(() => {
    if (imgSrc !== fallbackSrc) {
      // Intentar con fallback
      setImgSrc(fallbackSrc);
      setHasError(false);
    } else {
      // Fallback también falló
      setHasError(true);
      setIsLoading(false);
    }
    onError?.();
  }, [imgSrc, fallbackSrc, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setImgSrc(src);
  }, [src]);

  // Si hay error de conexión, mostrar un placeholder
  if (hasError) {
    return (
      <div className={`relative bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-2">Imagen no disponible</p>
          <button
            onClick={handleRetry}
            className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1 mx-auto"
          >
            <RefreshCw className="w-3 h-3" />
            Reintentar
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        style={{ 
          display: isLoading ? 'none' : 'block'
        }}
      />
      
      {children}
    </div>
  );
};

export default ImageWithFallback;

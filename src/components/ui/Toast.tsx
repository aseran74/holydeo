import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-close
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "relative overflow-hidden rounded-xl shadow-2xl border transition-all duration-300 transform";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800`;
      case 'info':
        return `${baseStyles} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800`;
      default:
        return `${baseStyles} bg-white border-gray-200 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconClasses = "w-5 h-5";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-600`} />;
      case 'error':
        return <XCircle className={`${iconClasses} text-red-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-amber-600`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-600`} />;
      default:
        return <Info className={`${iconClasses} text-gray-600`} />;
    }
  };

  const getProgressBarColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${
        isExiting ? 'translate-x-full opacity-0 scale-95' : ''
      } min-w-[320px] max-w-[420px]`}
      style={{
        animation: isVisible ? 'slideInRight 0.3s ease-out' : 'none'
      }}
    >
      {/* Barra de progreso */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
        <div 
          className={`h-full ${getProgressBarColor()} transition-all duration-300 ease-linear`}
          style={{
            width: isExiting ? '0%' : '100%',
            transition: `width ${duration}ms linear`
          }}
        />
      </div>

      {/* Contenido del toast */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icono */}
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-5 mb-1">
              {title}
            </h4>
            {message && (
              <p className="text-sm leading-5 opacity-90">
                {message}
              </p>
            )}
          </div>

          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors duration-200"
          >
            <X className="w-4 h-4 opacity-60 hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Indicador de tipo */}
      <div className={`absolute bottom-0 left-0 w-full h-1 ${getProgressBarColor()} opacity-20`} />
    </div>
  );
};

export default Toast;

import React, { useState, useCallback } from 'react';
import Toast, { ToastType } from './Toast';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'top-right' 
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  const getStackDirection = () => {
    switch (position) {
      case 'top-right':
      case 'top-left':
      case 'top-center':
        return 'flex-col-reverse';
      case 'bottom-right':
      case 'bottom-left':
      case 'bottom-center':
        return 'flex-col';
      default:
        return 'flex-col-reverse';
    }
  };

  // Exponer la función addToast globalmente
  React.useEffect(() => {
    (window as any).showToast = addToast;
    return () => {
      delete (window as any).showToast;
    };
  }, [addToast]);

  return (
    <div className={`fixed z-[9999] ${getPositionClasses()}`} style={{ maxWidth: 'calc(100vw - 2rem)' }}>
      <div className={`flex ${getStackDirection()} gap-3`} style={{ maxWidth: '100%' }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;

import { useCallback } from 'react';
import { ToastType } from '../components/ui/Toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface ToastFunction {
  (title: string, message?: string, options?: ToastOptions): string;
}

interface UseToastReturn {
  success: ToastFunction;
  error: ToastFunction;
  warning: ToastFunction;
  info: ToastFunction;
  custom: (type: ToastType, title: string, message?: string, options?: ToastOptions) => string;
}

const useToast = (): UseToastReturn => {
  const showToast = useCallback((type: ToastType, title: string, message?: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined' && (window as any).showToast) {
      return (window as any).showToast({
        type,
        title,
        message,
        duration: options?.duration || 5000,
        position: options?.position || 'top-right'
      });
    }
    
    // Fallback si no hay contenedor de toast
    console.warn('Toast container not found. Make sure ToastContainer is mounted.');
    return '';
  }, []);

  const success: ToastFunction = useCallback((title, message, options) => {
    return showToast('success', title, message, options);
  }, [showToast]);

  const error: ToastFunction = useCallback((title, message, options) => {
    return showToast('error', title, message, options);
  }, [showToast]);

  const warning: ToastFunction = useCallback((title, message, options) => {
    return showToast('warning', title, message, options);
  }, [showToast]);

  const info: ToastFunction = useCallback((title, message, options) => {
    return showToast('info', title, message, options);
  }, [showToast]);

  const custom = useCallback((type: ToastType, title: string, message?: string, options?: ToastOptions) => {
    return showToast(type, title, message, options);
  }, [showToast]);

  return {
    success,
    error,
    warning,
    info,
    custom
  };
};

export default useToast;

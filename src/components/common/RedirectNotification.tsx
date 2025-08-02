import React from 'react';
import { X } from 'lucide-react';

interface RedirectNotificationProps {
  message: string;
  redirectFrom?: string;
  onClose: () => void;
}

const RedirectNotification: React.FC<RedirectNotificationProps> = ({ 
  message, 
  redirectFrom, 
  onClose 
}) => {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg shadow-lg max-w-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {message}
          </p>
          {redirectFrom && (
            <p className="text-xs mt-1 text-blue-600">
              Redirigido desde: {redirectFrom}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-blue-400 hover:text-blue-600 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedirectNotification; 
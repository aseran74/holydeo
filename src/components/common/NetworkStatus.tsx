import React from 'react';
import { Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const NetworkStatus: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  // No mostrar nada si la conexión está bien y nunca hubo problemas
  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isOnline ? 'bg-green-500' : 'bg-red-500'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
          {isOnline ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Conexión restaurada</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Sin conexión a internet</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;

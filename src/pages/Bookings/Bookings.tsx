import React from 'react';
import CombinedBookingManagement from '../../components/bookings/CombinedBookingManagement';

const Bookings: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Reservas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra todas las reservas y solicitudes de larga estancia
        </p>
      </div>
      
      <CombinedBookingManagement />
    </div>
  );
};

export default Bookings;
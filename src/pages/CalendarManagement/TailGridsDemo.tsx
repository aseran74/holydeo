import React, { useState } from 'react';
import TailGridsDateRangePicker from '../../components/common/TailGridsDateRangePicker';
import PageMeta from '../../components/common/PageMeta';

const TailGridsDemo: React.FC = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  return (
    <>
      <PageMeta
        title="TailGrids Date Range Picker | Demo"
        description="Demostración del Date Range Picker inspirado en TailGrids"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            TailGrids Date Range Picker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Componente de selección de fechas inspirado en el diseño de TailGrids
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Hero */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Variante Hero
            </h2>
            <TailGridsDateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              placeholder="Seleccionar fechas"
            />
            <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Fechas seleccionadas:
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check-in: {checkIn || 'No seleccionado'}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Check-out: {checkOut || 'No seleccionado'}
              </p>
            </div>
          </div>

          {/* Demo Search */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Variante Search
            </h2>
            <TailGridsDateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              placeholder="Seleccionar fechas"
            />
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Fechas seleccionadas:
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check-in: {checkIn || 'No seleccionado'}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Check-out: {checkOut || 'No seleccionado'}
              </p>
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Características del Componente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                🎨 Diseño Elegante
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Inspirado en el diseño moderno de TailGrids con animaciones suaves
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                📅 Calendario Visual
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Navegación intuitiva entre meses con visualización clara del rango
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                🔄 Validación Inteligente
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Previene selección de fechas pasadas y valida rangos automáticamente
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                🎯 UX Mejorada
              </h3>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Botones de aplicar/cancelar y limpieza rápida de fechas
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                🌙 Modo Oscuro
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Soporte completo para tema oscuro con transiciones suaves
              </p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                📱 Responsive
              </h3>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                Adaptable a diferentes tamaños de pantalla y dispositivos
              </p>
            </div>
          </div>
        </div>

        {/* Información técnica */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información Técnica
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• <strong>Framework:</strong> React con TypeScript</p>
            <p>• <strong>Estilos:</strong> Tailwind CSS</p>
            <p>• <strong>Iconos:</strong> Lucide React</p>
            <p>• <strong>Formato de fecha:</strong> YYYY-MM-DD</p>
            <p>• <strong>Localización:</strong> Español (es-ES)</p>
            <p>• <strong>Accesibilidad:</strong> Soporte para teclado y lectores de pantalla</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TailGridsDemo; 
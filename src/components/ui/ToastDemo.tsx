import React from 'react';
import useToast from '../../hooks/useToast';

const ToastDemo: React.FC = () => {
  const toast = useToast();

  const showSuccessToast = () => {
    toast.success(
      '¡Reserva creada exitosamente!',
      'Tu reserva ha sido confirmada y recibirás un email de confirmación.',
      { duration: 6000 }
    );
  };

  const showErrorToast = () => {
    toast.error(
      'Error al crear la reserva',
      'Por favor, verifica los datos e intenta nuevamente.',
      { duration: 8000 }
    );
  };

  const showWarningToast = () => {
    toast.warning(
      'Fechas no disponibles',
      'Las fechas seleccionadas ya están reservadas. Por favor, elige otras fechas.',
      { duration: 7000 }
    );
  };

  const showInfoToast = () => {
    toast.info(
      'Información importante',
      'Recuerda que el check-in es a partir de las 15:00 y el check-out hasta las 11:00.',
      { duration: 5000 }
    );
  };

  const showCustomToast = () => {
    toast.custom(
      'info',
      'Toast personalizado',
      'Este es un toast con configuración personalizada.',
      { 
        duration: 10000,
        position: 'bottom-center'
      }
    );
  };

  const showMultipleToasts = () => {
    toast.success('Toast 1', 'Primer mensaje');
    setTimeout(() => toast.info('Toast 2', 'Segundo mensaje'), 500);
    setTimeout(() => toast.warning('Toast 3', 'Tercer mensaje'), 1000);
    setTimeout(() => toast.error('Toast 4', 'Cuarto mensaje'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Sistema de Toasts
            </h1>
            <p className="text-lg text-gray-600">
              Demostración de notificaciones elegantes y responsivas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Toast de Éxito */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Toast de Éxito
                </h3>
                <p className="text-green-600 mb-4 text-sm">
                  Notificaciones para acciones exitosas
                </p>
                <button
                  onClick={showSuccessToast}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Mostrar Toast
                </button>
              </div>
            </div>

            {/* Toast de Error */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Toast de Error
                </h3>
                <p className="text-red-600 mb-4 text-sm">
                  Notificaciones para errores y problemas
                </p>
                <button
                  onClick={showErrorToast}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Mostrar Toast
                </button>
              </div>
            </div>

            {/* Toast de Advertencia */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Toast de Advertencia
                </h3>
                <p className="text-amber-600 mb-4 text-sm">
                  Notificaciones para advertencias
                </p>
                <button
                  onClick={showWarningToast}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Mostrar Toast
                </button>
              </div>
            </div>

            {/* Toast de Información */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">ℹ️</span>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Toast de Información
                </h3>
                <p className="text-blue-600 mb-4 text-sm">
                  Notificaciones informativas
                </p>
                <button
                  onClick={showInfoToast}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Mostrar Toast
                </button>
              </div>
            </div>

            {/* Toast Personalizado */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Toast Personalizado
                </h3>
                <p className="text-purple-600 mb-4 text-sm">
                  Configuración avanzada
                </p>
                <button
                  onClick={showCustomToast}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Mostrar Toast
                </button>
              </div>
            </div>

            {/* Múltiples Toasts */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Múltiples Toasts
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Secuencia de notificaciones
                </p>
                <button
                  onClick={showMultipleToasts}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Mostrar Secuencia
                </button>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              ✨ Características del Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">🎯 Funcionalidades</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 4 tipos de toast predefinidos</li>
                  <li>• Configuración personalizable</li>
                  <li>• Auto-cierre configurable</li>
                  <li>• Múltiples posiciones</li>
                  <li>• Animaciones suaves</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">🎨 Diseño</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Gradientes modernos</li>
                  <li>• Iconos intuitivos</li>
                  <li>• Barra de progreso</li>
                  <li>• Responsive design</li>
                  <li>• Sombras elegantes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;

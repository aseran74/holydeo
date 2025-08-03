import React, { useState } from 'react';
import NumberStepper from '../../components/common/NumberStepper';
import PageMeta from '../../components/common/PageMeta';

const NumberStepperDemo: React.FC = () => {
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [guests, setGuests] = useState(1);
  const [price, setPrice] = useState(100);

  return (
    <>
      <PageMeta
        title="Number Stepper | Demo"
        description="Demostración del componente NumberStepper para filtros numéricos"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Number Stepper Component
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Componente de stepper para filtros numéricos con botones + y -
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Principal */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Filtros de Propiedades
            </h2>
            
            <div className="space-y-6">
              <NumberStepper
                value={bedrooms}
                onChange={setBedrooms}
                min={0}
                max={6}
                label="Habitaciones"
              />

              <NumberStepper
                value={bathrooms}
                onChange={setBathrooms}
                min={0}
                max={5}
                label="Baños"
              />

              <NumberStepper
                value={guests}
                onChange={setGuests}
                min={1}
                max={10}
                label="Huéspedes"
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Valores seleccionados:
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>Habitaciones: {bedrooms === 0 ? 'Cualquiera' : bedrooms}</p>
                <p>Baños: {bathrooms === 0 ? 'Cualquiera' : bathrooms}</p>
                <p>Huéspedes: {guests}</p>
              </div>
            </div>
          </div>

          {/* Demo de Precios */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Filtro de Precios
            </h2>
            
            <NumberStepper
              value={price}
              onChange={setPrice}
              min={50}
              max={1000}
              step={50}
              label="Precio máximo por noche (€)"
            />

            <div className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Precio seleccionado:
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                €{price}
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
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                🎯 Interfaz Intuitiva
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Botones + y - claros y fáciles de usar
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                📊 Validación Automática
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Límites mínimo y máximo con deshabilitación automática
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                🎨 Diseño Moderno
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Estilo consistente con el resto de la aplicación
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                🔄 Estados Dinámicos
              </h3>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Botones se deshabilitan en límites y cambian de color
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                🌙 Modo Oscuro
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Soporte completo para tema oscuro
              </p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                ⚡ Personalizable
              </h3>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                Configurable con min, max, step y etiquetas personalizadas
              </p>
            </div>
          </div>
        </div>

        {/* Información técnica */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Información Técnica
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• <strong>Props:</strong> value, onChange, min, max, step, label, className</p>
            <p>• <strong>Valor por defecto:</strong> Muestra "Cualquiera" cuando el valor es 0</p>
            <p>• <strong>Validación:</strong> Botones se deshabilitan automáticamente en límites</p>
            <p>• <strong>Accesibilidad:</strong> Soporte para navegación por teclado</p>
            <p>• <strong>Responsive:</strong> Se adapta a diferentes tamaños de pantalla</p>
            <p>• <strong>Estilos:</strong> Utiliza Tailwind CSS con transiciones suaves</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberStepperDemo; 
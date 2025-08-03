import React, { useState } from 'react';
import PriceFilter from '../../components/common/PriceFilter';
import PageMeta from '../../components/common/PageMeta';

const PriceFilterDemo: React.FC = () => {
  const [pricePerDay, setPricePerDay] = useState(250);
  const [pricePerMonth, setPricePerMonth] = useState(3000);
  const [pricePerNight, setPricePerNight] = useState(150);
  const [pricePerWeek, setPricePerWeek] = useState(800);

  return (
    <>
      <PageMeta
        title="Price Filter | Demo"
        description="Demostración del componente PriceFilter para filtros de precio"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Price Filter Component
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Componente de filtro de precio con input numérico y slider
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Principal */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Filtros de Precio
            </h2>
            
            <div className="space-y-6">
              <PriceFilter
                label="Precio máximo por día"
                value={pricePerDay}
                onChange={setPricePerDay}
                min={0}
                max={500}
                step={25}
              />

              <PriceFilter
                label="Precio máximo por mes"
                value={pricePerMonth}
                onChange={setPricePerMonth}
                min={0}
                max={5000}
                step={100}
              />
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Valores seleccionados:
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>Precio por día: €{pricePerDay}</p>
                <p>Precio por mes: €{pricePerMonth}</p>
              </div>
            </div>
          </div>

          {/* Demo de Variaciones */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Otras Variaciones
            </h2>
            
            <div className="space-y-6">
              <PriceFilter
                label="Precio por noche"
                value={pricePerNight}
                onChange={setPricePerNight}
                min={50}
                max={300}
                step={10}
              />

              <PriceFilter
                label="Precio por semana"
                value={pricePerWeek}
                onChange={setPricePerWeek}
                min={200}
                max={2000}
                step={50}
              />
            </div>

            <div className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Valores seleccionados:
              </h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>Precio por noche: €{pricePerNight}</p>
                <p>Precio por semana: €{pricePerWeek}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Características del Componente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                💰 Input Numérico
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Campo de texto para entrada directa del precio
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                🎚️ Slider Interactivo
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Control deslizante para ajuste visual del precio
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                🎨 Diseño Moderno
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Estilo consistente con iconos y colores
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                ⚡ Validación Automática
              </h3>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Límites mínimo y máximo con validación
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
                📱 Responsive
              </h3>
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                Se adapta a diferentes tamaños de pantalla
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
            <p>• <strong>Props:</strong> label, value, onChange, min, max, step, className</p>
            <p>• <strong>Input numérico:</strong> Para entrada directa del valor</p>
            <p>• <strong>Slider:</strong> Para ajuste visual con rango</p>
            <p>• <strong>Validación:</strong> Límites automáticos y formato</p>
            <p>• <strong>Iconos:</strong> Euro icon para contexto visual</p>
            <p>• <strong>Estilos:</strong> Tailwind CSS con slider personalizado</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilterDemo; 
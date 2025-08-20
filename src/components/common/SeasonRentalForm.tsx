import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface SeasonRentalFormProps {
  propertyId: string;
  propertyName: string;
  precioMes: number;
  alquilaTemporadaCompleta?: boolean;
  mesesTemporada?: string[];
  onSuccess: (data: any) => void;
  className?: string;
}

const SeasonRentalForm: React.FC<SeasonRentalFormProps> = ({
  propertyId,
  propertyName,
  precioMes,
  alquilaTemporadaCompleta = false,
  mesesTemporada = [],
  onSuccess,
  className = ''
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado una temporada si hay disponibles
    if (mesesTemporada && mesesTemporada.length > 0 && !selectedSeason) {
      alert('Por favor, selecciona una temporada');
      return;
    }
    
    const rentalData = {
      propertyId,
      propertyName,
      precioMes,
      selectedSeason,
      ...formData
    };
    
    onSuccess(rentalData);
    setShowForm(false);
    setSelectedSeason('');
    setFormData({
      startDate: '',
      endDate: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      message: ''
    });
  };

  if (!alquilaTemporadaCompleta) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">Alquiler de Temporada</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Esta propiedad está disponible para alquiler de temporada completa.
      </p>

      {/* Mostrar temporadas disponibles */}
      {mesesTemporada && mesesTemporada.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Temporadas disponibles:
          </h4>
          <div className="flex flex-wrap gap-2">
            {mesesTemporada.map((season, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200"
              >
                {season}
              </span>
            ))}
          </div>
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Solicitar Alquiler de Temporada
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de temporada */}
          {mesesTemporada && mesesTemporada.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Seleccionar temporada <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una temporada</option>
                {mesesTemporada.map((season, index) => (
                  <option key={index} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de fin</label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              name="guestName"
              required
              value={formData.guestName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="guestEmail"
              required
              value={formData.guestEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mensaje (opcional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Comentarios adicionales..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar Solicitud
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SeasonRentalForm;

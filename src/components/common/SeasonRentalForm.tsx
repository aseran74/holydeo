import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

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
  const [rentalType, setRentalType] = useState<'season' | 'custom'>('season');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    message: '',
    guests: 1
  });

  // Calcular días entre fechas
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysDifference = calculateDays(formData.startDate, formData.endDate);
  const isLongTerm = daysDifference > 90;

  // Temporadas disponibles con información detallada
  const seasonInfo = {
    'enero': { name: 'Enero', duration: 31, description: 'Invierno - Año Nuevo' },
    'febrero': { name: 'Febrero', duration: 28, description: 'Invierno - Carnavales' },
    'marzo': { name: 'Marzo', duration: 31, description: 'Primavera - Semana Santa' },
    'abril': { name: 'Abril', duration: 30, description: 'Primavera - Fiestas' },
    'mayo': { name: 'Mayo', duration: 31, description: 'Primavera - Puentes' },
    'junio': { name: 'Junio', duration: 30, description: 'Verano - Inicio' },
    'julio': { name: 'Julio', duration: 31, description: 'Verano - Vacaciones' },
    'agosto': { name: 'Agosto', duration: 31, description: 'Verano - Vacaciones' },
    'septiembre': { name: 'Septiembre', duration: 30, description: 'Verano - Fin' },
    'octubre': { name: 'Octubre', duration: 31, description: 'Otoño - Puentes' },
    'noviembre': { name: 'Noviembre', duration: 30, description: 'Otoño - Fiestas' },
    'diciembre': { name: 'Diciembre', duration: 31, description: 'Invierno - Navidad' }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSeasonSelect = (season: string) => {
    setSelectedSeason(season);
    setRentalType('season');
    
    // Calcular fechas aproximadas para la temporada
    const currentYear = new Date().getFullYear();
    let startMonth = 0;
    let endMonth = 0;
    
    switch(season) {
      case 'enero': startMonth = 0; endMonth = 0; break;
      case 'febrero': startMonth = 1; endMonth = 1; break;
      case 'marzo': startMonth = 2; endMonth = 2; break;
      case 'abril': startMonth = 3; endMonth = 3; break;
      case 'mayo': startMonth = 4; endMonth = 4; break;
      case 'junio': startMonth = 5; endMonth = 5; break;
      case 'julio': startMonth = 6; endMonth = 6; break;
      case 'agosto': startMonth = 7; endMonth = 7; break;
      case 'septiembre': startMonth = 8; endMonth = 8; break;
      case 'octubre': startMonth = 9; endMonth = 9; break;
      case 'noviembre': startMonth = 10; endMonth = 10; break;
      case 'diciembre': startMonth = 11; endMonth = 11; break;
    }
    
    const startDate = new Date(currentYear, startMonth, 1);
    const endDate = new Date(currentYear, endMonth + 1, 0);
    
    setFormData(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rentalData = {
      propertyId,
      propertyName,
      precioMes,
      rentalType,
      selectedSeason: rentalType === 'season' ? selectedSeason : null,
      daysDifference,
      isLongTerm,
      ...formData
    };
    
    onSuccess(rentalData);
    setShowForm(false);
    setFormData({
      startDate: '',
      endDate: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      message: '',
      guests: 1
    });
    setSelectedSeason('');
    setRentalType('season');
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
      {mesesTemporada.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Temporadas Disponibles:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {mesesTemporada.map((mes) => (
              <button
                key={mes}
                onClick={() => handleSeasonSelect(mes)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  selectedSeason === mes
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{seasonInfo[mes as keyof typeof seasonInfo]?.name || mes}</div>
                <div className="text-xs text-gray-500">
                  {seasonInfo[mes as keyof typeof seasonInfo]?.duration} días
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Información de precios */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Precio mensual:</span>
          <span className="font-semibold text-blue-600">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioMes)}</span>
        </div>
        {selectedSeason && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {seasonInfo[selectedSeason as keyof typeof seasonInfo]?.name}:
            </span>
            <span className="font-semibold text-blue-600">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioMes)}
            </span>
          </div>
        )}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Solicitar Alquiler de Temporada
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de alquiler */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium mb-3">Tipo de Alquiler:</h4>
            <div className="flex gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rentalType"
                  value="season"
                  checked={rentalType === 'season'}
                  onChange={(e) => setRentalType(e.target.value as 'season' | 'custom')}
                  className="text-blue-600"
                />
                <span className="text-sm">Temporada específica</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="rentalType"
                  value="custom"
                  checked={rentalType === 'custom'}
                  onChange={(e) => setRentalType(e.target.value as 'season' | 'custom')}
                  className="text-blue-600"
                />
                <span className="text-sm">Fechas personalizadas</span>
              </label>
            </div>
          </div>

          {/* Selección de temporada */}
          {rentalType === 'season' && mesesTemporada.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Seleccionar Temporada:</label>
              <select
                value={selectedSeason}
                onChange={(e) => handleSeasonSelect(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una temporada</option>
                {mesesTemporada.map((mes) => (
                  <option key={mes} value={mes}>
                    {seasonInfo[mes as keyof typeof seasonInfo]?.name} - {seasonInfo[mes as keyof typeof seasonInfo]?.description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Fechas personalizadas */}
          {rentalType === 'custom' && (
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
          )}

          {/* Información de duración */}
          {(formData.startDate && formData.endDate) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Duración del alquiler:</span>
                <span className="font-semibold text-blue-600">{daysDifference} días</span>
              </div>
              {isLongTerm && (
                <div className="mt-1 text-xs text-blue-600">
                  ⚠️ Alquiler de larga duración (más de 90 días)
                </div>
              )}
            </div>
          )}

          {/* Información del cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">Número de huéspedes</label>
              <input
                type="number"
                name="guests"
                min="1"
                max="20"
                required
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
              placeholder="Comentarios adicionales, preferencias especiales..."
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

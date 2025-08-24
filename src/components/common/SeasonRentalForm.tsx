import React, { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';

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
  const { currentUser } = useAuth();
  const toast = useToast();
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

  // Auto-completar datos del usuario cuando se abra el formulario
  useEffect(() => {
    if (showForm && currentUser) {
      setFormData(prev => ({
        ...prev,
        guestName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
        guestEmail: currentUser.email || '',
        guestPhone: currentUser.phoneNumber || ''
      }));
    }
  }, [showForm, currentUser]);

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

  // Función para convertir claves de temporada en información visual atractiva
  const getSeasonDisplayInfo = (seasonKey: string) => {
    const seasonLabels: { [key: string]: { displayName: string; duration: number; months: string } } = {
      'sep_may': { displayName: 'Septiembre a Mayo', duration: 9, months: 'Sep a Mayo' },
      'sep_jun': { displayName: 'Septiembre a Junio', duration: 10, months: 'Sep a Junio' },
      'sep_jul': { displayName: 'Septiembre a Julio', duration: 11, months: 'Sep a Julio' },
      'oct_jun': { displayName: 'Octubre a Junio', duration: 9, months: 'Oct a Junio' },
      'oct_jul': { displayName: 'Octubre a Julio', duration: 10, months: 'Oct a Julio' },
      'oct_may': { displayName: 'Octubre a Mayo', duration: 8, months: 'Oct a Mayo' },
      'nov_aug': { displayName: 'Noviembre a Agosto', duration: 10, months: 'Nov a Agosto' },
      'dec_sep': { displayName: 'Diciembre a Septiembre', duration: 10, months: 'Dic a Sep' },
      'jan_oct': { displayName: 'Enero a Octubre', duration: 10, months: 'Ene a Oct' },
      'feb_nov': { displayName: 'Febrero a Noviembre', duration: 10, months: 'Feb a Nov' },
      'mar_dec': { displayName: 'Marzo a Diciembre', duration: 10, months: 'Mar a Dic' },
      'apr_jan': { displayName: 'Abril a Enero', duration: 10, months: 'Abr a Ene' },
      'may_feb': { displayName: 'Mayo a Febrero', duration: 10, months: 'Mayo a Feb' },
      'jun_mar': { displayName: 'Junio a Marzo', duration: 10, months: 'Junio a Mar' },
      'jul_apr': { displayName: 'Julio a Abril', duration: 10, months: 'Julio a Abr' },
      'aug_may': { displayName: 'Agosto a Mayo', duration: 10, months: 'Ago a Mayo' },
      'pct_mayo': { displayName: 'Octubre a Mayo', duration: 8, months: 'Oct a Mayo' },
      // Fallbacks para meses individuales
      'enero': { displayName: 'Enero', duration: 1, months: 'Enero' },
      'febrero': { displayName: 'Febrero', duration: 1, months: 'Febrero' },
      'marzo': { displayName: 'Marzo', duration: 1, months: 'Marzo' },
      'abril': { displayName: 'Abril', duration: 1, months: 'Abril' },
      'mayo': { displayName: 'Mayo', duration: 1, months: 'Mayo' },
      'junio': { displayName: 'Junio', duration: 1, months: 'Junio' },
      'julio': { displayName: 'Julio', duration: 1, months: 'Julio' },
      'agosto': { displayName: 'Agosto', duration: 1, months: 'Agosto' },
      'septiembre': { displayName: 'Septiembre', duration: 1, months: 'Septiembre' },
      'octubre': { displayName: 'Octubre', duration: 1, months: 'Octubre' },
      'noviembre': { displayName: 'Noviembre', duration: 1, months: 'Noviembre' },
      'diciembre': { displayName: 'Diciembre', duration: 1, months: 'Diciembre' }
    };
    
    return seasonLabels[seasonKey] || { 
      displayName: seasonKey, 
      duration: 1, 
      months: seasonKey 
    };
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
    
    // Validar que se haya seleccionado una temporada si es tipo 'season'
    if (rentalType === 'season' && !selectedSeason) {
      toast.error('Error', 'Por favor selecciona una temporada');
      return;
    }
    
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
    
    // Mostrar toast de confirmación
    toast.success('¡Solicitud de reserva efectuada!', 'Tu solicitud de alquiler de temporada ha sido enviada correctamente. Te contactaremos pronto.');
    
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



      {/* Información de precios */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Precio mensual:</span>
          <span className="font-semibold text-blue-600">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioMes)}</span>
        </div>
        
        {/* Información de temporadas disponibles */}
        {mesesTemporada.length > 0 && (
          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Temporadas disponibles:</p>
            <div className="flex flex-wrap gap-2">
              {mesesTemporada.map((seasonKey) => {
                const seasonData = getSeasonDisplayInfo(seasonKey);
                return (
                  <span
                    key={seasonKey}
                    className="inline-block px-2 py-1 bg-white dark:bg-blue-800 text-xs text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-600"
                  >
                    {seasonData.displayName}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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

          {/* Selección visual de temporadas */}
          {rentalType === 'season' && mesesTemporada.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-3">Seleccionar Temporada:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mesesTemporada.map((seasonKey) => {
                  const seasonData = getSeasonDisplayInfo(seasonKey);
                  return (
                    <button
                      key={seasonKey}
                      type="button"
                      onClick={() => handleSeasonSelect(seasonKey)}
                      className={`p-4 text-center rounded-lg border transition-all duration-200 ${
                        selectedSeason === seasonKey
                          ? 'bg-blue-100 border-blue-300 text-blue-700 ring-2 ring-blue-500 shadow-md'
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <h5 className="font-semibold text-sm">
                        {seasonData.displayName}
                      </h5>
                    </button>
                  );
                })}
              </div>
              {!selectedSeason && (
                <p className="text-sm text-red-500 mt-2">* Selecciona una temporada</p>
              )}
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

          {/* Indicador de usuario logueado */}
          {currentUser && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Datos auto-completados de tu perfil
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Puedes modificar estos datos si lo deseas
              </p>
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
             <label className="block text-sm font-medium mb-1">Teléfono *</label>
             <input
               type="tel"
               name="guestPhone"
               value={formData.guestPhone}
               onChange={handleInputChange}
               required
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

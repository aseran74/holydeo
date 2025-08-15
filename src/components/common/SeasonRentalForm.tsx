import React, { useState } from 'react';
import { Calendar, Mail, Phone, User, MessageSquare } from 'lucide-react';

interface SeasonRentalFormProps {
  propertyId: string;
  propertyName: string;
  precioMes: number;
  mesesTemporada?: string[] | null;
  alquilaTemporadaCompleta?: boolean;
}

const SeasonRentalForm: React.FC<SeasonRentalFormProps> = ({
  propertyId,
  propertyName,
  precioMes,
  mesesTemporada,
  alquilaTemporadaCompleta
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    startMonth: '',
    endMonth: '',
    numberOfMonths: '',
    message: '',
    acceptTerms: false
  });

  const months = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  const handleMonthChange = (field: 'startMonth' | 'endMonth', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Calcular número de meses automáticamente
      if (newData.startMonth && newData.endMonth) {
        const start = parseInt(newData.startMonth);
        const end = parseInt(newData.endMonth);
        let months = 0;
        
        if (start <= end) {
          months = end - start + 1;
        } else {
          // Si cruza el año (ej: Octubre a Marzo)
          months = (12 - start + 1) + end;
        }
        
        newData.numberOfMonths = months.toString();
      }
      
      return newData;
    });
  };

  const calculateTotalPrice = () => {
    if (!formData.numberOfMonths) return 0;
    return parseInt(formData.numberOfMonths) * precioMes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
    
    try {
      // Aquí iría la lógica para enviar la solicitud de alquiler
      // Por ahora solo mostramos un mensaje de éxito
      alert('Solicitud de alquiler enviada correctamente. Te contactaremos pronto.');
      
      // Limpiar formulario
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        startMonth: '',
        endMonth: '',
        numberOfMonths: '',
        message: '',
        acceptTerms: false
      });
      
      setShowForm(false);
      
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Error al enviar la solicitud. Inténtalo de nuevo.');
    }
  };

  if (!alquilaTemporadaCompleta) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
        <h3 className="text-lg font-semibold mb-4">Alquiler de temporada completa</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Esta propiedad no está disponible para alquiler de temporada completa.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
      <h3 className="text-lg font-semibold mb-4">Alquiler de temporada completa</h3>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Temporadas disponibles:</span>
        </div>
        {mesesTemporada && mesesTemporada.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {mesesTemporada.map((mes, index) => {
              const monthLabel = months.find(m => m.value === mes)?.label || mes;
              return (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {monthLabel}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Temporada completa disponible</p>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Precio mensual: <span className="font-semibold">{precioMes.toFixed(2)}€</span>
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Mínimo 60 días
            </span>
          </div>
        </div>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary w-full"
        >
          Solicitar alquiler de temporada
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mes de inicio</label>
              <select
                required
                value={formData.startMonth}
                onChange={(e) => handleMonthChange('startMonth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar mes</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mes de fin</label>
              <select
                required
                value={formData.endMonth}
                onChange={(e) => handleMonthChange('endMonth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar mes</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.numberOfMonths && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800 dark:text-green-200">
                  Duración: <span className="font-semibold">{formData.numberOfMonths} meses</span>
                </span>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Total: {calculateTotalPrice().toFixed(2)}€
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              type="text"
              required
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.guestEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              value={formData.guestPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, guestPhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mensaje (opcional)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Comentarios adicionales, fechas específicas, etc..."
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-600 dark:text-gray-400">
              Acepto que me contacten para gestionar mi solicitud de alquiler de temporada completa
            </label>
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
              Enviar solicitud
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SeasonRentalForm;

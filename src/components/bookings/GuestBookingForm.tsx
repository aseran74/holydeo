import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { User, Calendar, CreditCard, MapPin, Clock } from 'lucide-react';
import useToast from '../../hooks/useToast';

interface GuestBookingFormProps {
  propertyId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  precioDia: number;
  onSuccess: (bookingData: any) => void;
  onCancel: () => void;
}

interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  notes: string;
  specialRequests: string;
}

const GuestBookingForm: React.FC<GuestBookingFormProps> = ({
  propertyId,
  startDate,
  endDate,
  totalPrice,
  precioDia,
  onSuccess,
  onCancel
}) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestAddress: '',
    notes: '',
    specialRequests: ''
  });

  // Auto-completar formulario cuando se monta el componente
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        guestName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
        guestEmail: currentUser.email || '',
        guestPhone: currentUser.phoneNumber || '',
        guestAddress: ''
      }));
    }
  }, [currentUser]);

  const calculateNights = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const restoreUserData = () => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        guestName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
        guestEmail: currentUser.email || '',
        guestPhone: currentUser.phoneNumber || '',
        guestAddress: ''
      }));
      toast.success('Datos restaurados', 'Se han restaurado los datos de tu perfil');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guestName || !formData.guestEmail) {
      toast.error('Campos requeridos', 'Por favor completa el nombre y email');
      return;
    }

    try {
      setLoading(true);

      // Crear la reserva en Supabase
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          property_id: propertyId,
          check_in: startDate.toISOString().split('T')[0],
          check_out: endDate.toISOString().split('T')[0],
          guest_name: formData.guestName,
          guest_email: formData.guestEmail,
          guest_phone: formData.guestPhone,
          guest_address: formData.guestAddress,
          notes: formData.notes,
          special_requests: formData.specialRequests,
          status: 'pending',
          total_price: totalPrice,
          nights: calculateNights(),
          // Agregar user_id si el usuario está logueado
          ...(currentUser && { user_id: currentUser.uid })
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        toast.error('Error al crear la reserva', 'Por favor, intenta nuevamente');
        return;
      }

      // Notificar éxito
      toast.success('¡Reserva creada exitosamente!', 'Tu reserva ha sido confirmada y está pendiente de aprobación');
      
      // Llamar a la función de éxito
      onSuccess(booking);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la reserva', 'Por favor, intenta nuevamente');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Completar Reserva
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completa los datos para confirmar tu reserva
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Resumen de la reserva */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Resumen de tu reserva
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-200">
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-200">
                {calculateNights()} noche{calculateNights() !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 dark:text-blue-200">
                €{precioDia} por noche
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Total: €{totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Indicador de usuario logueado */}
        {currentUser && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Datos auto-completados de tu perfil
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Puedes modificar estos datos si lo deseas
            </p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                required
                value={formData.guestName}
                onChange={(e) => handleInputChange('guestName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  currentUser ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : 'border-gray-300'
                }`}
                placeholder="Tu nombre completo"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.guestEmail}
                onChange={(e) => handleInputChange('guestEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  currentUser ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  currentUser ? 'border-green-300 bg-green-50 dark:bg-green-900/10' : 'border-gray-300'
                }`}
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.guestAddress}
                onChange={(e) => handleInputChange('guestAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu dirección"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Información adicional sobre tu estancia..."
            />
          </div>

          {/* Solicitudes especiales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Solicitudes especiales
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Accesibilidad, horarios especiales, etc..."
            />
          </div>

          {/* Botón para restaurar datos del usuario */}
          {currentUser && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={restoreUserData}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
              >
                Restaurar datos del perfil
              </button>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Creando reserva...' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestBookingForm;

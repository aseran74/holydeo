import React, { useState, useEffect } from 'react';
import { Calendar, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useToast from '../../hooks/useToast';
import { supabase } from '../../supabaseClient';
import Button from '../ui/button/Button';
import ExperienceDatePicker from './ExperienceDatePicker';

interface ExperienceBookingFormProps {
  experienceId: string;
  experienceName: string;
  experiencePrice?: number;
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  className?: string;
}

const ExperienceBookingForm: React.FC<ExperienceBookingFormProps> = ({
  experienceId,
  experienceName,
  experiencePrice,
  onSuccess,
  className = ''
}) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función para cambiar el estado
  const openModal = () => {
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
  };

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    participants: 1,
    preferredDate: '',
    message: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.preferredDate) {
      toast.error('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const bookingData = {
        experience_id: experienceId,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        participants: formData.participants,
        preferred_date: formData.preferredDate,
        message: formData.message,
        status: 'pending',
        total_price: experiencePrice ? experiencePrice * formData.participants : null,
        // Agregar user_id si el usuario está logueado
        ...(currentUser && { user_id: currentUser.uid })
      };
      
      // Crear la reserva de experiencia
      const { data: booking, error } = await supabase
        .from('experience_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        toast.error('Error al crear la reserva', `Error: ${error.message}`);
        return;
      }

      // Mostrar toast de confirmación
      toast.success('¡Solicitud de reserva efectuada!', 'Tu solicitud de reserva para esta experiencia ha sido enviada correctamente. Te contactaremos pronto.');

      // Limpiar formulario
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        participants: 1,
        preferredDate: '',
        message: ''
      });

      // Cerrar formulario
      setShowForm(false);

      // Notificar éxito
      if (onSuccess) {
        onSuccess(booking);
      }
    } catch (error) {
      toast.error('Error al crear la reserva', 'Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button 
        onClick={openModal}
        className={`w-full ${className}`}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Reservar Experiencia
      </Button>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Reservar Experiencia</h3>
        </div>
                 <button
           onClick={closeModal}
           className="text-gray-400 hover:text-gray-600 transition-colors"
         >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Completa el formulario para reservar tu plaza en <strong>{experienceName}</strong>
      </p>
      
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              name="guestPhone"
              value={formData.guestPhone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Número de participantes
            </label>
            <select
              name="participants"
              value={formData.participants}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
              ))}
            </select>
          </div>
        </div>

                 <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
             Fecha preferida *
           </label>
           <ExperienceDatePicker
             experienceId={experienceId}
             selectedDate={formData.preferredDate}
             onDateSelect={(date) => setFormData(prev => ({ ...prev, preferredDate: date }))}
             className="w-full"
           />
         </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mensaje adicional
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            placeholder="Comentarios especiales, requisitos, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Información de precio */}
        {experiencePrice && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Precio por persona:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(experiencePrice)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total ({formData.participants} {formData.participants === 1 ? 'persona' : 'personas'}):</span>
              <span className="text-lg font-bold text-blue-600">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(experiencePrice * formData.participants)}
              </span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 pt-2">
                     <button
             type="button"
             onClick={closeModal}
             className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
           >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceBookingForm;

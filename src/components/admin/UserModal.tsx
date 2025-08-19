import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserIcon, Mail, Shield, Building } from 'lucide-react';
import { UserService, User, CreateUserData, UpdateUserData } from '../../services/userService';
import toast from 'react-hot-toast';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onUserSaved: () => void;
}

const ROLES = [
  { value: 'admin', label: 'Administrador', description: 'Acceso completo al sistema' },
  { value: 'agency', label: 'Agencia', description: 'Gestiona propiedades y agentes' },
  { value: 'agent', label: 'Agente', description: 'Gestiona propiedades asignadas' },
  { value: 'owner', label: 'Propietario', description: 'Gestiona sus propiedades' },
  { value: 'guest', label: 'Invitado', description: 'Acceso limitado al sistema' }
];

export default function UserModal({ isOpen, onClose, user, onUserSaved }: UserModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    full_name: '',
    role: 'guest',
    agency_id: undefined
  });
  const [agencies, setAgencies] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!user;

  useEffect(() => {
    if (isOpen) {
      loadAgencies();
      if (user) {
        setFormData({
          email: user.email,
          full_name: user.full_name || '',
          role: user.role,
          agency_id: user.agency_id || undefined
        });
      } else {
        setFormData({
          email: '',
          full_name: '',
          role: 'guest',
          agency_id: undefined
        });
      }
      setErrors({});
    }
  }, [isOpen, user]);

  const loadAgencies = async () => {
    try {
      const agenciesData = await UserService.getAgencies();
      setAgencies(agenciesData);
    } catch (error) {
      console.error('Error cargando agencias:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'El nombre completo es requerido';
    }

    if (formData.role === 'agent' && !formData.agency_id) {
      newErrors.agency_id = 'Los agentes deben estar asignados a una agencia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditing && user) {
        const updateData: UpdateUserData = {
          full_name: formData.full_name,
          role: formData.role,
          agency_id: formData.agency_id
        };
        
        await UserService.updateUser(user.id, updateData);
        toast.success('Usuario actualizado correctamente');
      } else {
        await UserService.createUser(formData);
        toast.success('Usuario creado correctamente');
      }
      
      onUserSaved();
      onClose();
    } catch (error: any) {
      console.error('Error guardando usuario:', error);
      toast.error(error.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: role as any,
      agency_id: role === 'agent' ? prev.agency_id : undefined
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? 'Modifica la información del usuario' : 'Añade un nuevo usuario al sistema'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isEditing}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="usuario@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Nombre y Apellidos"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {ROLES.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            {/* Agencia (solo para agentes) */}
            {formData.role === 'agent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Agencia
                </label>
                <select
                  value={formData.agency_id || ''}
                  onChange={(e) => handleInputChange('agency_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.agency_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona una agencia</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
                {errors.agency_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.agency_id}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  isEditing ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Save, X, Upload } from 'lucide-react';
import useToast from '../../hooks/useToast';
import { useTestimonials, Testimonial } from '../../hooks/useTestimonials';



const Testimonials: React.FC = () => {
  const { testimonials, loading, createTestimonial, updateTestimonial, deleteTestimonial, uploadAvatar } = useTestimonials();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    content: '',
    rating: 5,
    location: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const toast = useToast();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let avatarUrl = formData.avatar;

      // Subir avatar si hay un archivo nuevo
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      if (editingId) {
        // Actualizar testimonio existente
        await updateTestimonial(editingId, {
          ...formData,
          avatar: avatarUrl
        });
        toast.success('Testimonio actualizado correctamente');
      } else {
        // Crear nuevo testimonio
        await createTestimonial({
          ...formData,
          avatar: avatarUrl
        } as Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Testimonio creado correctamente');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Error al guardar testimonio');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData(testimonial);
    setAvatarPreview(testimonial.avatar || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este testimonio?')) return;

    try {
      await deleteTestimonial(id);
      toast.success('Testimonio eliminado correctamente');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Error al eliminar testimonio');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      content: '',
      rating: 5,
      location: ''
    });
    setEditingId(null);
    setShowForm(false);
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Testimonios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Administra los testimonios que se muestran en la landing page
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Nuevo Testimonio
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingId ? 'Editar Testimonio' : 'Nuevo Testimonio'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del cliente"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Inquilino de Temporada"
                />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Madrid, España"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calificación *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`p-1 rounded-lg transition-colors ${
                        star <= (formData.rating || 5)
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {formData.rating || 5}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Testimonio *
              </label>
              <textarea
                required
                rows={4}
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Escribe el testimonio del cliente..."
              />
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avatar (opcional)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Seleccionar Imagen
                  </label>
                </div>
                {avatarPreview && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {/* Header con acciones */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1">
                {renderStars(testimonial.rating)}
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.rating}/5
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <blockquote className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </blockquote>

            {/* Información del cliente */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  testimonial.name.charAt(0)
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                </p>
                {testimonial.location && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    📍 {testimonial.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay testimonios aún
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Crea tu primer testimonio para empezar a mostrar opiniones de clientes
          </p>
        </div>
      )}
    </div>
  );
};

export default Testimonials;

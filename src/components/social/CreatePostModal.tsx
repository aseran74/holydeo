import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, MapPin, Globe, Users, Calendar, Send, Loader2 } from 'lucide-react';
import { SocialCategory, CreatePostData, SocialService } from '../../services/socialService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: CreatePostData) => void;
  categories: SocialCategory[];
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState<CreatePostData>({
    content: '',
    category_id: categories[0]?.id || 1,
    location: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.content.trim() && formData.location.trim()) {
      setIsSubmitting(true);
      try {
        // Si hay imagen seleccionada, subirla primero
        let imageUrl = formData.image_url;
        if (selectedImage) {
          try {
            imageUrl = await SocialService.uploadImage(selectedImage);
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            // Continuar sin imagen si falla la subida
          }
        }
        
        const postDataWithImage = {
          ...formData,
          image_url: imageUrl
        };
        
        await onSubmit(postDataWithImage);
        handleClose();
      } catch (error) {
        console.error('Error creating post:', error);
        // Aquí podrías mostrar un toast de error
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      content: '',
      category_id: categories[0]?.id || 1,
      location: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setIsSubmitting(false);
    onClose();
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'digital':
        return <Globe className="w-4 h-4" />;
      case 'prejubilados':
        return <Users className="w-4 h-4" />;
      case 'larga-estancia':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Crear Nueva Publicación
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selecciona tu categoría
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category_id: category.id }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.category_id === category.id
                          ? 'border-transparent text-white'
                          : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      style={{
                        backgroundColor: formData.category_id === category.id ? category.color : undefined
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(category.slug)}
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <p className="text-xs opacity-80">{category.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="¿Dónde estás viviendo esta experiencia?"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Contenido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comparte tu experiencia
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Cuéntanos sobre tu experiencia, qué estás haciendo, qué te gusta del lugar..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {formData.content.length}/500 caracteres
                  </span>
                  <button
                    type="button"
                    onClick={() => document.getElementById('image-input')?.click()}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    Agregar imagen
                  </button>
                </div>
              </div>

              {/* Imagen */}
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full rounded-xl max-h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!formData.content.trim() || !formData.location.trim() || isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Search,
  Filter,
  Plus,
  Image as ImageIcon,
  MapPin,
  Tag,
  X
} from 'lucide-react';
import { SocialService, SocialPost, SocialCategory } from '../../services/socialService';
import { useAuth } from '../../context/AuthContext';

interface SocialManagementProps {
  // Props si es necesario
}

const SocialManagement: React.FC<SocialManagementProps> = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [categories, setCategories] = useState<SocialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [publicationFilter, setPublicationFilter] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<{ post: SocialPost | null, isOpen: boolean }>({
    post: null,
    isOpen: false
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [togglingPublication, setTogglingPublication] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    content: '',
    category_id: 1,
    location: '',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, postsData] = await Promise.all([
        SocialService.getCategories(),
        SocialService.getAllPostsForAdmin() // Usar el método para admin
      ]);
      
      // Agregar la categoría "Últimas Ofertas" si no existe
      const ultimasOfertasCategory = categoriesData.find(cat => cat.slug === 'ultimas-ofertas');
      if (!ultimasOfertasCategory) {
        // Aquí podrías crear la categoría en la base de datos si es necesario
        console.log('Categoría "Últimas Ofertas" no encontrada');
      }
      
      setCategories(categoriesData);
      setPosts(postsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;

    try {
      setDeletingPost(postId);
      // Usar el servicio para eliminar el post
      await SocialService.deletePost(postId);
      
      // Remover del estado local
      setPosts(prev => prev.filter(post => post.id !== postId));
      setShowDeleteModal({ post: null, isOpen: false });
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setDeletingPost(null);
    }
  };

  const handleCreatePost = async () => {
    if (!currentUser || !newPost.content.trim()) return;

    try {
      setCreatingPost(true);
      
      let imageUrl = newPost.image_url;
      
      // Si hay una imagen seleccionada, subirla primero
      if (selectedImage) {
        imageUrl = await SocialService.uploadImage(selectedImage, currentUser);
      }

      const postData = {
        content: newPost.content,
        category_id: newPost.category_id,
        location: newPost.location,
        image_url: imageUrl
      };

      const createdPost = await SocialService.createPost(postData, currentUser);
      
      // Agregar el nuevo post a la lista
      setPosts(prev => [createdPost, ...prev]);
      
      // Limpiar el formulario
      setNewPost({
        content: '',
        category_id: 1,
        location: '',
        image_url: ''
      });
      setSelectedImage(null);
      setShowCreateModal(false);
      
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setCreatingPost(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setNewPost(prev => ({ ...prev, image_url: '' }));
    }
  };

  const handleTogglePublication = async (postId: string, currentStatus: boolean) => {
    if (!currentUser) return;

    try {
      setTogglingPublication(postId);
      const updatedPost = await SocialService.togglePostPublication(postId, !currentStatus);
      
      // Actualizar el post en el estado local
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, is_published: updatedPost.is_published } : post
      ));
    } catch (err) {
      console.error('Error toggling post publication:', err);
    } finally {
      setTogglingPublication(null);
    }
  };

  const openDeleteModal = (post: SocialPost) => {
    setShowDeleteModal({ post, isOpen: true });
  };

  const closeDeleteModal = () => {
    setShowDeleteModal({ post: null, isOpen: false });
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewPost({
      content: '',
      category_id: 1,
      location: '',
      image_url: ''
    });
    setSelectedImage(null);
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category?.slug === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.location && post.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPublication = publicationFilter === 'all' || 
      (publicationFilter === 'published' && post.is_published) ||
      (publicationFilter === 'unpublished' && !post.is_published);
    
    return matchesCategory && matchesSearch && matchesPublication;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Cargando gestión social...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestión de Red Social
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Administra las publicaciones, comentarios y moderación de la comunidad
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Publicación
            </button>
          </div>
          
          {/* Botón para crear categoría Últimas Ofertas si no existe */}
          {!categories.find(cat => cat.slug === 'ultimas-ofertas') && (
            <div className="mt-4">
              <button
                onClick={async () => {
                  try {
                    await SocialService.createCategory({
                      name: 'Últimas Ofertas',
                      slug: 'ultimas-ofertas',
                      description: 'Publicaciones sobre ofertas especiales, descuentos y promociones',
                      color: '#FF6B35',
                      icon_name: 'tag'
                    });
                    // Recargar las categorías
                    loadData();
                  } catch (error) {
                    console.error('Error creating category:', error);
                  }
                }}
                className="inline-flex items-center px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors duration-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                Crear Categoría "Últimas Ofertas"
              </button>
            </div>
          )}
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por contenido, autor o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado de publicación */}
            <div className="md:w-48">
              <select
                value={publicationFilter}
                onChange={(e) => setPublicationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">Todos los estados</option>
                <option value="published">Solo publicados</option>
                <option value="unpublished">Solo ocultos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Posts Activos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {posts.filter(p => p.is_published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Posts Reportados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categorías</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Publicaciones ({filteredPosts.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header del post */}
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={post.author_avatar || '/images/user/user-01.jpg'}
                        alt={post.author_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {post.author_name}
                          </h3>
                          {post.category && (
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: post.category.color }}
                            >
                              {post.category.name}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(post.created_at)}
                          </span>
                        </div>
                        {post.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            📍 {post.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contenido del post */}
                    <div className="mb-3">
                      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                        {post.content.length > 200 
                          ? `${post.content.substring(0, 200)}...` 
                          : post.content
                        }
                      </p>
                      {post.image_url && (
                        <div className="mt-2">
                          <img
                            src={post.image_url}
                            alt="Post content"
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Estadísticas del post */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span>❤️ {post.likes_count} likes</span>
                      <span>💬 {post.comments_count} comentarios</span>
                      <span>📤 {post.shares_count} compartidos</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        post.is_published 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {post.is_published ? '✅ Publicado' : '🚫 Oculto'}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2 ml-4">
                    {/* Botón para cambiar estado de publicación */}
                    <button
                      onClick={() => handleTogglePublication(post.id, post.is_published)}
                      disabled={togglingPublication === post.id}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        post.is_published
                          ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={post.is_published ? 'Ocultar post' : 'Publicar post'}
                    >
                      {togglingPublication === post.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : post.is_published ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>

                    {/* Botón para eliminar */}
                    <button
                      onClick={() => openDeleteModal(post)}
                      disabled={deletingPost === post.id}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar post"
                    >
                      {deletingPost === post.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron publicaciones con los filtros aplicados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación de publicación */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closeCreateModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Crear Nueva Publicación
                </h3>
                <button
                  onClick={closeCreateModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Categoría
                  </label>
                  <select
                    value={newPost.category_id}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Ubicación
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Madrid, España"
                    value={newPost.location}
                    onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Contenido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenido
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Escribe el contenido de tu publicación..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Imagen (opcional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Seleccionar Imagen
                    </label>
                    {selectedImage && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedImage.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-8">
                <button
                  onClick={closeCreateModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={creatingPost || !newPost.content.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {creatingPost ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Crear Publicación
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación de eliminación */}
      <AnimatePresence>
        {showDeleteModal.isOpen && showDeleteModal.post && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closeDeleteModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Eliminar Publicación
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                ¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>Autor:</strong> {showDeleteModal.post.author_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <strong>Contenido:</strong> {showDeleteModal.post.content.substring(0, 100)}...
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeletePost(showDeleteModal.post!.id)}
                  disabled={deletingPost === showDeleteModal.post!.id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {deletingPost === showDeleteModal.post!.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialManagement;

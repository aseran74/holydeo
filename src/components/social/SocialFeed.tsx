import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Globe, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Plus,
  Loader2
} from 'lucide-react';
import CreatePostModal from './CreatePostModal';
import { SocialService, SocialCategory, SocialPost, CreatePostData } from '../../services/socialService';
import { useAuth } from '../../context/AuthContext';

const SocialFeed: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'digital' | 'prejubilados' | 'larga-estancia'>('all');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [categories, setCategories] = useState<SocialCategory[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Cargar categorías y posts al montar el componente
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar posts cuando cambie la categoría
  useEffect(() => {
    if (categories.length > 0) {
      loadPosts();
    }
  }, [selectedCategory, categories]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesData] = await Promise.all([
        SocialService.getCategories()
      ]);
      
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const categorySlug = selectedCategory === 'all' ? undefined : selectedCategory;
      const { posts: postsData } = await SocialService.getPosts(categorySlug);
      
      // Verificar likes del usuario actual
      const postsWithLikes = await SocialService['checkUserLikes'](postsData, currentUser);
      setPosts(postsWithLikes);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      // Mostrar mensaje de que debe iniciar sesión
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      const { liked, likes_count } = await SocialService.toggleLike(postId, currentUser);
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count, is_liked: liked }
          : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
      // Mostrar error al usuario
    }
  };

  const handleCreatePost = async (postData: CreatePostData) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para crear un post');
      return;
    }

    try {
      const newPost = await SocialService.createPost(postData, currentUser);
      setPosts(prev => [newPost, ...prev]);
      setShowNewPostForm(false);
    } catch (err) {
      console.error('Error creating post:', err);
      // Mostrar error al usuario
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Ahora';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('es-ES');
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find(c => c.slug === slug);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600 dark:text-gray-400">Cargando comunidad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadInitialData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comunidad Holydeo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conecta con viajeros que comparten tu estilo de vida. Comparte experiencias, 
            descubre destinos y construye amistades duraderas.
          </p>
        </div>

        {/* Categorías */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              Todas las Categorías
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug as any)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.slug
                    ? `text-white shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.slug ? category.color : undefined
                }}
              >
                {category.slug === 'digital' && <Globe className="w-5 h-5" />}
                {category.slug === 'prejubilados' && <Users className="w-5 h-5" />}
                {category.slug === 'larga-estancia' && <Calendar className="w-5 h-5" />}
                {category.name}
              </button>
            ))}
          </div>

          {/* Descripción de categoría seleccionada */}
          {selectedCategory !== 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {getCategoryBySlug(selectedCategory)?.description}
              </p>
            </motion.div>
          )}
        </div>

        {/* Botón Nueva Publicación */}
        <div className="text-center mb-8">
          {currentUser ? (
            <button
              onClick={() => setShowNewPostForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
            >
              <Plus className="w-6 h-6" />
              Crear Nueva Publicación
            </button>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Inicia sesión para compartir tu experiencia
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Feed de Publicaciones */}
        <div className="space-y-6">
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600 dark:text-gray-400">Actualizando...</p>
            </div>
          )}
          
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Header del Post */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={post.author_avatar || '/images/user/user-01.jpg'}
                        alt={post.author_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
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
                        </div>
                        {post.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {post.location}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTimestamp(post.created_at)}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Contenido del Post */}
                <div className="p-6">
                  <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-4">
                    {post.content}
                  </p>
                  
                  {post.image_url && (
                    <div className="mb-4">
                      <img
                        src={post.image_url}
                        alt="Post content"
                        className="w-full rounded-xl object-cover max-h-96"
                      />
                    </div>
                  )}
                </div>

                {/* Acciones del Post */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors duration-200 ${
                          post.is_liked 
                            ? 'text-red-500' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                        <span>{post.likes_count}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments_count}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                        <span>{post.shares_count}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mensaje si no hay posts */}
        {!loading && posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 dark:text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No hay publicaciones en esta categoría aún</p>
              <p className="text-lg">¡Sé el primero en compartir tu experiencia!</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal para crear nueva publicación */}
      <CreatePostModal
        isOpen={showNewPostForm}
        onClose={() => setShowNewPostForm(false)}
        onSubmit={handleCreatePost}
        categories={categories}
        currentUser={currentUser}
      />
    </div>
  );
};

export default SocialFeed;

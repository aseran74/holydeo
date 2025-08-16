import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Globe, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Plus
} from 'lucide-react';
import CreatePostModal from './CreatePostModal';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    category: 'digital' | 'prejubilados' | 'larga-estancia';
    location: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  category: 'digital' | 'prejubilados' | 'larga-estancia';
}

interface CreatePostData {
  content: string;
  category: 'digital' | 'prejubilados' | 'larga-estancia';
  location: string;
  image?: File;
}

interface Category {
  id: 'digital' | 'prejubilados' | 'larga-estancia';
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'digital',
    name: 'Nómadas Digitales',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-blue-500',
    description: 'Comparte tu vida trabajando desde cualquier lugar'
  },
  {
    id: 'prejubilados',
    name: 'Prejubilados',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-green-500',
    description: 'Disfruta de tu tiempo libre en destinos únicos'
  },
  {
    id: 'larga-estancia',
    name: 'Experiencias Larga Estancia',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-purple-500',
    description: 'Vive experiencias inmersivas de 15 días a 9 meses'
  }
];

// Datos de ejemplo para el feed
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'María García',
      avatar: '/images/user/user-01.jpg',
      category: 'digital',
      location: 'Altea Hills, Alicante'
    },
    content: '¡Increíble trabajar desde esta villa con vistas al mar! La conexión WiFi es perfecta y el ambiente es ideal para concentrarse. #nómadadigital #altea #trabajoremoto',
    image: '/images/cards/card-01.jpg',
    likes: 24,
    comments: 8,
    shares: 3,
    timestamp: '2h',
    category: 'digital'
  },
  {
    id: '2',
    author: {
      name: 'Carlos Rodríguez',
      avatar: '/images/user/user-02.jpg',
      category: 'prejubilados',
      location: 'Pueblos Blancos, Málaga'
    },
    content: 'Después de 30 años trabajando, por fin puedo disfrutar de la vida. Los Pueblos Blancos son mágicos, llenos de historia y tradición. ¡Recomendado 100%!',
    image: '/images/cards/card-02.jpg',
    likes: 31,
    comments: 12,
    shares: 5,
    timestamp: '4h',
    category: 'prejubilados'
  },
  {
    id: '3',
    author: {
      name: 'Ana Martínez',
      avatar: '/images/user/user-03.jpg',
      category: 'larga-estancia',
      location: 'Sevilla'
    },
    content: '3 meses viviendo en Sevilla y cada día descubro algo nuevo. Las clases de flamenco, la gastronomía, la arquitectura... ¡Es una experiencia que cambia la vida!',
    image: '/images/cards/card-03.jpg',
    likes: 45,
    comments: 15,
    shares: 8,
    timestamp: '6h',
    category: 'larga-estancia'
  },
  {
    id: '4',
    author: {
      name: 'Luis Fernández',
      avatar: '/images/user/user-04.jpg',
      category: 'digital',
      location: 'Córdoba'
    },
    content: 'Mezquita por la mañana, coworking por la tarde. Córdoba es perfecta para nómadas digitales. La historia te inspira y la modernidad te conecta.',
    likes: 18,
    comments: 6,
    shares: 2,
    timestamp: '8h',
    category: 'digital'
  }
];

const SocialFeed: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'digital' | 'prejubilados' | 'larga-estancia'>('all');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleCreatePost = (postData: CreatePostData) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Tú', // En una implementación real, esto vendría del usuario autenticado
        avatar: '/images/user/user-01.jpg',
        category: postData.category,
        location: postData.location
      },
      content: postData.content,
      image: postData.image ? URL.createObjectURL(postData.image) : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Ahora',
      category: postData.category
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

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
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon}
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
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            </motion.div>
          )}
        </div>

        {/* Botón Nueva Publicación */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowNewPostForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            <Plus className="w-6 h-6" />
            Crear Nueva Publicación
          </button>
        </div>

        {/* Feed de Publicaciones */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
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
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {post.author.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                            post.category === 'digital' ? 'bg-blue-500' :
                            post.category === 'prejubilados' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}>
                            {categories.find(c => c.id === post.category)?.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {post.author.location}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTimestamp(post.timestamp)}
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
                  
                  {post.image && (
                    <div className="mb-4">
                      <img
                        src={post.image}
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
                        className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mensaje si no hay posts */}
        {filteredPosts.length === 0 && (
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
      />
    </div>
  );
};

export default SocialFeed;

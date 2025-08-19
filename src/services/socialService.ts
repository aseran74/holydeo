import { supabase } from '../supabaseClient';

export interface SocialCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon_name: string;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  author_id?: string;
  author_name: string;
  author_avatar?: string;
  category_id: number;
  content: string;
  image_url?: string;
  location?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: SocialCategory;
  is_liked?: boolean;
}

export interface CreatePostData {
  content: string;
  category_id: number;
  location: string;
  image_url?: string;
}

export interface CreateCommentData {
  post_id: string;
  content: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon_name: string;
}

export class SocialService {
  // Obtener todas las categorías
  static async getCategories(): Promise<SocialCategory[]> {
    const { data, error } = await supabase
      .from('social_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  }

  // Crear una nueva categoría (solo para administradores)
  static async createCategory(categoryData: CreateCategoryData): Promise<SocialCategory> {
    const { data, error } = await supabase
      .from('social_categories')
      .insert({
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    return data;
  }

  // Obtener posts con paginación y filtros (incluyendo posts no publicados para admin)
  static async getPosts(
    categorySlug?: string,
    page: number = 1,
    limit: number = 10,
    includeUnpublished: boolean = false
  ): Promise<{ posts: SocialPost[]; total: number }> {
    let query = supabase
      .from('social_posts')
      .select(`
        *,
        category:social_categories(*)
      `)
      .order('created_at', { ascending: false });

    // Solo filtrar por publicados si no se incluyen los no publicados
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    // Filtrar por categoría si se especifica
    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('social_categories.slug', categorySlug);
    }

    // Aplicar paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }

    // Verificar si el usuario actual ha dado like a cada post
    const postsWithLikes = await this.checkUserLikes(data || [], null); // Pass null for currentUser as it's not directly available here

    return {
      posts: postsWithLikes,
      total: count || 0
    };
  }

  // Obtener todos los posts para administración
  static async getAllPostsForAdmin(): Promise<SocialPost[]> {
    const { data, error } = await supabase
      .from('social_posts')
      .select(`
        *,
        category:social_categories(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all posts for admin:', error);
      throw error;
    }

    return data || [];
  }

  // Crear un nuevo post
  static async createPost(postData: CreatePostData, currentUser: any): Promise<SocialPost> {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        author_id: currentUser.uid,
        author_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario',
        author_avatar: currentUser.photoURL,
        category_id: postData.category_id,
        content: postData.content,
        location: postData.location,
        image_url: postData.image_url,
        is_published: true, // Los posts creados por admin se publican automáticamente
        likes_count: 0,
        comments_count: 0,
        shares_count: 0
      })
      .select(`
        *,
        category:social_categories(*)
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    return data;
  }

  // Actualizar un post (solo para administradores)
  static async updatePost(postId: string, updates: Partial<SocialPost>): Promise<SocialPost> {
    const { data, error } = await supabase
      .from('social_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select(`
        *,
        category:social_categories(*)
      `)
      .single();

    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }

    return data;
  }

  // Eliminar un post (solo para administradores)
  static async deletePost(postId: string): Promise<void> {
    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Cambiar el estado de publicación de un post
  static async togglePostPublication(postId: string, isPublished: boolean): Promise<SocialPost> {
    return this.updatePost(postId, { is_published: isPublished });
  }

  // Dar/quitar like a un post
  static async toggleLike(postId: string, currentUser: any): Promise<{ liked: boolean; likes_count: number }> {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    // Verificar si ya existe el like
    const { data: existingLike } = await supabase
      .from('social_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', currentUser.uid)
      .single();

    if (existingLike) {
      // Quitar like
      const { error } = await supabase
        .from('social_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', currentUser.uid);

      if (error) {
        console.error('Error removing like:', error);
        throw error;
      }

      // Obtener el nuevo contador de likes
      const { data: post } = await supabase
        .from('social_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      return { liked: false, likes_count: post?.likes_count || 0 };
    } else {
      // Dar like
      const { error } = await supabase
        .from('social_likes')
        .insert({
          post_id: postId,
          user_id: currentUser.uid
        });

      if (error) {
        console.error('Error adding like:', error);
        throw error;
      }

      // Obtener el nuevo contador de likes
      const { data: post } = await supabase
        .from('social_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      return { liked: true, likes_count: post?.likes_count || 0 };
    }
  }

  // Crear un comentario
  static async createComment(commentData: CreateCommentData, currentUser: any): Promise<any> {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('social_comments')
      .insert({
        post_id: commentData.post_id,
        author_id: currentUser.uid,
        author_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario',
        author_avatar: currentUser.photoURL,
        content: commentData.content
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      throw error;
    }

    return data;
  }

  // Obtener comentarios de un post
  static async getComments(postId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('social_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data || [];
  }

  // Verificar si el usuario actual ha dado like a los posts
  private static async checkUserLikes(posts: SocialPost[], currentUser: any): Promise<SocialPost[]> {
    if (!currentUser || posts.length === 0) {
      return posts;
    }

    const postIds = posts.map(post => post.id);
    const { data: userLikes } = await supabase
      .from('social_likes')
      .select('post_id')
      .eq('user_id', currentUser.uid)
      .in('post_id', postIds);

    const likedPostIds = new Set(userLikes?.map(like => like.post_id) || []);

    return posts.map(post => ({
      ...post,
      is_liked: likedPostIds.has(post.id)
    }));
  }

  // Subir imagen
  static async uploadImage(file: File, currentUser: any): Promise<string> {
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.uid}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('social-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('social-images')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  // Obtener estadísticas de la red social
  static async getSocialStats(): Promise<{
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalCategories: number;
    publishedPosts: number;
    unpublishedPosts: number;
  }> {
    try {
      const [
        { count: totalPosts },
        { count: totalLikes },
        { count: totalComments },
        { count: totalCategories },
        { count: publishedPosts },
        { count: unpublishedPosts }
      ] = await Promise.all([
        supabase.from('social_posts').select('*', { count: 'exact', head: true }),
        supabase.from('social_likes').select('*', { count: 'exact', head: true }),
        supabase.from('social_comments').select('*', { count: 'exact', head: true }),
        supabase.from('social_categories').select('*', { count: 'exact', head: true }),
        supabase.from('social_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('social_posts').select('*', { count: 'exact', head: true }).eq('is_published', false)
      ]);

      return {
        totalPosts: totalPosts || 0,
        totalLikes: totalLikes || 0,
        totalComments: totalComments || 0,
        totalCategories: totalCategories || 0,
        publishedPosts: publishedPosts || 0,
        unpublishedPosts: unpublishedPosts || 0
      };
    } catch (error) {
      console.error('Error fetching social stats:', error);
      throw error;
    }
  }
}

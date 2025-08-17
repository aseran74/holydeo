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

  // Obtener posts con paginación y filtros
  static async getPosts(
    categorySlug?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ posts: SocialPost[]; total: number }> {
    let query = supabase
      .from('social_posts')
      .select(`
        *,
        category:social_categories(*)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

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
    const postsWithLikes = await this.checkUserLikes(data || []);

    return {
      posts: postsWithLikes,
      total: count || 0
    };
  }

  // Crear un nuevo post
  static async createPost(postData: CreatePostData): Promise<SocialPost> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        author_id: user.id,
        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
        author_avatar: user.user_metadata?.avatar_url,
        category_id: postData.category_id,
        content: postData.content,
        location: postData.location,
        image_url: postData.image_url
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

  // Dar/quitar like a un post
  static async toggleLike(postId: string): Promise<{ liked: boolean; likes_count: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Verificar si ya existe el like
    const { data: existingLike } = await supabase
      .from('social_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Quitar like
      const { error } = await supabase
        .from('social_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

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
          user_id: user.id
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
  static async createComment(commentData: CreateCommentData): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
      .from('social_comments')
      .insert({
        post_id: commentData.post_id,
        author_id: user.id,
        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
        author_avatar: user.user_metadata?.avatar_url,
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
  private static async checkUserLikes(posts: SocialPost[]): Promise<SocialPost[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || posts.length === 0) {
      return posts;
    }

    const postIds = posts.map(post => post.id);
    const { data: userLikes } = await supabase
      .from('social_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', postIds);

    const likedPostIds = new Set(userLikes?.map(like => like.post_id) || []);

    return posts.map(post => ({
      ...post,
      is_liked: likedPostIds.has(post.id)
    }));
  }

  // Subir imagen
  static async uploadImage(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

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
}

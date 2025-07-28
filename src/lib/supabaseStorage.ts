import { supabase } from '../supabaseClient';

/**
 * Obtiene la URL pública de una imagen almacenada en Supabase Storage
 * @param path - Ruta del archivo (puede ser nombre de archivo, ruta relativa o URL completa)
 * @param bucket - Nombre del bucket (por defecto 'property-images')
 * @returns URL pública de la imagen o null si no se puede generar
 */
export const getSupabasePublicUrl = (path: string, bucket: string = 'property-images'): string | null => {
  if (!path || path.trim() === '') return null;

  // Si ya es una URL completa de Supabase, devolverla tal como está
  if (path.startsWith('https://wnevxdjytvbelknmtglf.supabase.co/storage/v1/object/public/')) {
    return path;
  }

  // Si es solo el nombre del archivo, construir la URL pública
  if (path && !path.includes('/')) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  // Si es una ruta relativa, extraer el nombre del archivo
  const fileName = path.split('/').pop();
  if (fileName) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  return null;
};

/**
 * Obtiene la URL pública de la primera imagen de un array de rutas
 * @param paths - Array de rutas de imágenes
 * @param bucket - Nombre del bucket (por defecto 'property-images')
 * @returns URL pública de la primera imagen o null si no hay imágenes
 */
export const getFirstImageUrl = (paths: string[] | null | undefined, bucket: string = 'property-images'): string | null => {
  if (!paths || paths.length === 0) return null;
  
  return getSupabasePublicUrl(paths[0], bucket);
};

/**
 * Obtiene todas las URLs públicas de un array de rutas
 * @param paths - Array de rutas de imágenes
 * @param bucket - Nombre del bucket (por defecto 'property-images')
 * @returns Array de URLs públicas
 */
export const getAllImageUrls = (paths: string[] | null | undefined, bucket: string = 'property-images'): string[] => {
  if (!paths || paths.length === 0) return [];
  
  return paths
    .filter(path => path && path.trim() !== '')
    .map(path => getSupabasePublicUrl(path, bucket))
    .filter(url => url !== null) as string[];
};

/**
 * Verifica si una URL de imagen es válida
 * @param url - URL de la imagen
 * @returns Promise<boolean> - true si la imagen se puede cargar
 */
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image URL:', error);
    return false;
  }
};

/**
 * Obtiene una URL de imagen con fallback a placeholder
 * @param paths - Array de rutas de imágenes
 * @param mainPath - Ruta de imagen principal
 * @param bucket - Nombre del bucket
 * @returns URL de imagen o placeholder
 */
export const getImageUrlWithFallback = (
  paths?: string[] | null,
  mainPath?: string | null,
  bucket: string = 'property-images'
): string => {
  // Intentar con image_paths primero
  if (paths && paths.length > 0 && paths[0]) {
    const url = getSupabasePublicUrl(paths[0], bucket);
    if (url) return url;
  }

  // Intentar con main_image_path
  if (mainPath && mainPath.trim() !== '') {
    const url = getSupabasePublicUrl(mainPath, bucket);
    if (url) return url;
  }

  // Fallback a placeholder local
  return '/images/cards/card-01.jpg';
}; 
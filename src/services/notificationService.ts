import { supabase } from '../supabaseClient';

export interface GuestNotification {
  id: string;
  type: 'booking_change' | 'social_post' | 'booking_status' | 'system';
  title: string;
  message: string;
  timestamp: string;
  related_id?: string;
  is_read: boolean;
  icon?: string;
  color?: string;
}

export class NotificationService {
  // Obtener notificaciones para un usuario desde la tabla real
  static async getGuestNotifications(userId: string): Promise<GuestNotification[]> {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error obteniendo notificaciones:', error);
        return [];
      }

      return notifications?.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: notification.created_at,
        related_id: notification.related_id,
        is_read: notification.is_read,
        icon: notification.icon,
        color: notification.color
      })) || [];

    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  }

  // Marcar notificación como leída usando la función de Supabase
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('mark_notification_as_read', { p_notification_id: notificationId });

      if (error) {
        console.error('Error marcando notificación como leída:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
      return false;
    }
  }

  // Marcar todas las notificaciones de un usuario como leídas
  static async markAllAsRead(userId: string): Promise<number> {
    try {
      const { error } = await supabase
        .rpc('mark_all_notifications_as_read', { p_user_id: userId });

      if (error) {
        console.error('Error marcando todas las notificaciones como leídas:', error);
        return 0;
      }

      return 0; // Retornamos 0 ya que no necesitamos el conteo específico
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
      return 0;
    }
  }

  // Obtener estadísticas de notificaciones no leídas usando la función de Supabase
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('get_unread_notifications_count', { p_user_id: userId });

      if (error) {
        console.error('Error obteniendo conteo de notificaciones:', error);
        return 0;
      }

      return data || 0;
    } catch (error) {
      console.error('Error obteniendo conteo de notificaciones:', error);
      return 0;
    }
  }

  // Crear notificación manual (para casos especiales)
  static async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    relatedId?: string,
    relatedType?: string,
    icon?: string,
    color?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .rpc('insert_notification', {
          p_user_id: userId,
          p_type: type,
          p_title: title,
          p_message: message,
          p_related_id: relatedId,
          p_related_type: relatedType,
          p_icon: icon,
          p_color: color
        });

      if (error) {
        console.error('Error creando notificación:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creando notificación:', error);
      return null;
    }
  }

  // Limpiar notificaciones antiguas (más de 30 días)
  static async cleanupOldNotifications(): Promise<boolean> {
    try {
      const { error } = await supabase
        .rpc('cleanup_old_notifications');

      if (error) {
        console.error('Error limpiando notificaciones antiguas:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error limpiando notificaciones antiguas:', error);
      return false;
    }
  }
}

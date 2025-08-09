import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

interface MessageCounterProps {
  userId?: string;
  className?: string;
}

const MessageCounter: React.FC<MessageCounterProps> = ({ userId, className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();
  const actualUserId = userId || currentUser?.uid;

  useEffect(() => {
    if (!actualUserId) return;

    const fetchUnreadCount = async () => {
      try {
        // Usar el email del usuario de Firebase para buscar en Supabase
        const userEmail = currentUser?.email;
        if (!userEmail) return;

        // Buscar el usuario en la tabla users por email
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', userEmail)
          .single();

        if (!userData?.id) return;

        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', userData.id)
          .eq('is_read', false);

        if (error) {
          console.error('Error fetching unread count:', error);
          return;
        }

        setUnreadCount(count || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${actualUserId}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [actualUserId, currentUser?.email]);

  if (unreadCount === 0) return null;

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};

export default MessageCounter; 
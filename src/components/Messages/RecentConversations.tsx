import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Conversation {
  contact_id: string;
  contact_name: string;
  contact_email?: string;
  contact_type: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface RecentConversationsProps {
  onSelectContact: (contactId: string, contactName: string, contactType: string, contactEmail?: string) => void;
}

const RecentConversations: React.FC<RecentConversationsProps> = ({ onSelectContact }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Obtener el ID del usuario actual desde Supabase
  useEffect(() => {
    const getCurrentUserId = async () => {
      if (!currentUser?.email) return;

      try {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', currentUser.email)
          .single();

        if (userData?.id) {
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error('Error getting current user ID:', error);
      }
    };

    getCurrentUserId();
  }, [currentUser?.email]);

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
      subscribeToConversations();
    }
  }, [currentUserId]);

  const fetchConversations = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      
      // Obtener todos los mensajes del usuario
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      // Agrupar por contacto y obtener el último mensaje
      const conversationMap = new Map<string, Conversation>();

      for (const message of messages || []) {
        const isSender = message.sender_id === currentUserId;
        const contactId = isSender ? message.recipient_id : message.sender_id;
        
        if (!conversationMap.has(contactId)) {
          // Buscar información del contacto
          const contactInfo = await getContactInfo(contactId);
          
          conversationMap.set(contactId, {
            contact_id: contactId,
            contact_name: contactInfo?.name || 'Usuario',
            contact_email: contactInfo?.email,
            contact_type: message.recipient_type || 'users',
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: 0
          });
        }

        const conversation = conversationMap.get(contactId)!;
        
        // Actualizar con el mensaje más reciente
        if (new Date(message.created_at) > new Date(conversation.last_message_time)) {
          conversation.last_message = message.content;
          conversation.last_message_time = message.created_at;
        }

        // Contar mensajes no leídos
        if (!isSender && !message.is_read) {
          conversation.unread_count++;
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContactInfo = async (contactId: string) => {
    try {
      // Buscar en diferentes tablas
      const { data: user } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('id', contactId)
        .single();

      if (user) {
        return {
          name: user.full_name || user.email,
          email: user.email
        };
      }

      // Buscar en guests
      const { data: guest } = await supabase
        .from('guests')
        .select(`
          id,
          phone,
          users(id, full_name, email)
        `)
        .eq('id', contactId)
        .single();

      if (guest) {
        return {
          name: guest.users?.[0]?.full_name || `Huésped ${guest.id.slice(0, 8)}`,
          email: guest.users?.[0]?.email
        };
      }

      // Buscar en agents
      const { data: agent } = await supabase
        .from('agents')
        .select(`
          id,
          phone,
          users(id, full_name, email)
        `)
        .eq('id', contactId)
        .single();

      if (agent) {
        return {
          name: agent.users?.[0]?.full_name || `Agente ${agent.id.slice(0, 8)}`,
          email: agent.users?.[0]?.email
        };
      }

      // Buscar en owners
      const { data: owner } = await supabase
        .from('owners')
        .select(`
          id,
          phone,
          users(id, full_name, email)
        `)
        .eq('id', contactId)
        .single();

      if (owner) {
        return {
          name: owner.users?.[0]?.full_name || `Propietario ${owner.id.slice(0, 8)}`,
          email: owner.users?.[0]?.email
        };
      }

      // Buscar en agencies
      const { data: agency } = await supabase
        .from('agencies')
        .select('id, name, contact_email')
        .eq('id', contactId)
        .single();

      if (agency) {
        return {
          name: agency.name,
          email: agency.contact_email
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting contact info:', error);
      return null;
    }
  };

  const subscribeToConversations = () => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${currentUserId},recipient_id.eq.${currentUserId})`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Cargando conversaciones...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>No hay conversaciones recientes</p>
        <p className="text-sm">Comienza una nueva conversación</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map(conversation => (
        <button
          key={conversation.contact_id}
          onClick={() => onSelectContact(
            conversation.contact_id,
            conversation.contact_name,
            conversation.contact_type,
            conversation.contact_email
          )}
          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              {conversation.unread_count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm truncate">{conversation.contact_name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(conversation.last_message_time).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-gray-500 truncate">
                {conversation.last_message}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default RecentConversations; 
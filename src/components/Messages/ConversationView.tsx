import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Send, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  type: string;
}

interface ConversationViewProps {
  contact: Contact;
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ contact, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
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
    if (currentUserId && contact) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [currentUserId, contact]);

  const fetchMessages = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${contact.id}),and(sender_id.eq.${contact.id},recipient_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Enriquecer mensajes con nombres
      const enrichedMessages = (messagesData || []).map(message => ({
        ...message,
        sender_name: message.sender_id === currentUserId ? 'Tú' : contact.name
      }));

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('conversation')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${currentUserId},recipient_id.eq.${contact.id}),and(sender_id.eq.${contact.id},recipient_id.eq.${currentUserId}))`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!currentUserId || !newMessage.trim()) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUserId,
          recipient_id: contact.id,
          recipient_type: contact.type,
          subject: 'Mensaje directo',
          content: newMessage
        }]);

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">{contact.name}</h3>
          <p className="text-sm text-gray-500">{contact.email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay mensajes aún</p>
            <p className="text-sm">Comienza la conversación enviando un mensaje</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === currentUserId
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView; 
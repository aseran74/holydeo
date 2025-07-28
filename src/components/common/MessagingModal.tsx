import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { User } from '@supabase/supabase-js';

interface Message {
  id: string;
  created_at: string;
  content: string;
  sender_id: string;
}

interface MessagingModalProps {
  recipientId: string;
  recipientName: string;
  recipientType: 'real_estate_agents' | 'agencies' | 'owners' | 'clients';
  onClose: () => void;
}

const MessagingModal: React.FC<MessagingModalProps> = ({
  recipientId,
  recipientName,
  recipientType,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
          .eq('recipient_type', recipientType)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          setMessages(data);
        }
      }
      setLoading(false);
    };

    fetchUserAndMessages();
  }, [recipientId, recipientType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!newMessage.trim() || !user) {
      return;
    }

    if (!currentUser) {
      setCurrentUser(user);
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        recipient_type: recipientType,
        content: newMessage,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
    } else if (data) {
      setMessages([...messages, data]);
      setNewMessage('');
    }
  };

  if (loading) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl p-6 w-full max-w-lg h-[70vh] flex justify-center items-center">
                <p>Cargando mensajes...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl p-6 w-full max-w-lg h-[70vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">Mensajes con {recipientName}</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto mb-4 p-2 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender_id === currentUser?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            }}
            placeholder="Escribe tu mensaje..."
            className="w-full border rounded-lg px-3 py-2"
            rows={2}
          />
          <button onClick={handleSendMessage} className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 self-end">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingModal; 
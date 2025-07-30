import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import PageMeta from '../../components/common/PageMeta';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  created_at: string;
  content: string;
  recipient_id: string;
  recipient_type: string;
  recipient_name: string; // Will be added manually
  sender_name: string; // Will be added manually
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        setLoading(false);
        return;
      }
      
      // Since all senders are the logged-in admin, we can fetch that once.
      const { data: { user } } = await supabase.auth.getUser();
      const senderName = user?.user_metadata?.name || user?.email || "Admin";

      // Fetch recipient names
      const recipientPromises = messagesData.map(async (msg) => {
        const { data, error } = await supabase
          .from(msg.recipient_type)
          .select('name')
          .eq('id', msg.recipient_id)
          .single();
        
        return {
          ...msg,
          recipient_name: error ? 'Destinatario no encontrado' : data.name,
          sender_name: senderName
        };
      });

      const populatedMessages = await Promise.all(recipientPromises);
      setMessages(populatedMessages);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const getRecipientLink = (type: string) => {
    if (type === 'agents') return `/agents`;
    if (type === 'agencies') return `/agencies`;
    if (type === 'owners') return `/owners`;
    if (type === 'clients') return `/clients`;
    return '#';
  }

  return (
    <>
      <PageMeta title="Bandeja de Entrada" description="Gestión de mensajes y comunicaciones" />
      <div className="p-4 md:p-6 2xl:p-10">
        <h1 className="text-2xl font-bold mb-6">Últimos 10 Mensajes Enviados</h1>
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-md">
          {loading ? (
            <p className="p-4">Cargando mensajes...</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-strokedark">
              {messages.map((msg) => (
                <li key={msg.id} className="p-4 hover:bg-gray-50 dark:hover:bg-meta-4">
                  <div className="flex justify-between text-sm mb-2">
                    <p className="font-semibold">
                      De: {msg.sender_name} a <Link to={getRecipientLink(msg.recipient_type)} className="text-blue-600 hover:underline">{msg.recipient_name}</Link>
                    </p>
                    <p className="text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{msg.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage; 
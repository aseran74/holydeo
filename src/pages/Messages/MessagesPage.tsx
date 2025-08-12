import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Send, Inbox, Search, Plus, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConversationView from '../../components/Messages/ConversationView';
import RecentConversations from '../../components/Messages/RecentConversations';
import DebugMessages from '../../components/DebugMessages';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  recipient_type: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  recipient_name?: string;
}

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: string;
  avatar?: string;
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'inbox' | 'sent' | 'compose' | 'conversation'>('inbox');
  const { currentUser } = useAuth();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Obtener el ID del usuario actual desde Supabase
  useEffect(() => {
    const getCurrentUserId = async () => {
      if (!currentUser?.email) {
        console.log('No hay currentUser.email:', currentUser);
        return;
      }

      console.log('Buscando usuario con email:', currentUser.email);

      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', currentUser.email)
          .single();

        if (error) {
          console.error('Error buscando usuario:', error);
          return;
        }

        if (userData?.id) {
          console.log('Usuario encontrado:', userData);
          setCurrentUserId(userData.id);
        } else {
          console.log('No se encontró usuario con ese email');
        }
      } catch (error) {
        console.error('Error getting current user ID:', error);
      }
    };

    getCurrentUserId();
  }, [currentUser?.email]);

  useEffect(() => {
    if (currentUserId) {
      fetchContacts();
      if (view !== 'compose') {
        fetchMessages();
      }
    }
  }, [currentUserId, view]);

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      console.log('Fetching contacts...'); // Debug log
      
      // Obtener usuarios
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, role')
        .neq('id', currentUserId);

      if (usersError) {
        console.error('Error fetching users:', usersError);
      }

      // Obtener huéspedes
      const { data: guests, error: guestsError } = await supabase
        .from('guests')
        .select(`
          id,
          phone,
          users(id, full_name, email)
        `);

      if (guestsError) {
        console.error('Error fetching guests:', guestsError);
      }

      // Obtener agentes
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select(`
          id,
          phone,
          avatar_url,
          users(id, full_name, email)
        `);

      if (agentsError) {
        console.error('Error fetching agents:', agentsError);
      }

      // Obtener propietarios
      const { data: owners, error: ownersError } = await supabase
        .from('owners')
        .select(`
          id,
          phone,
          users(id, full_name, email)
        `);

      if (ownersError) {
        console.error('Error fetching owners:', ownersError);
      }

      // Obtener agencias
      const { data: agencies, error: agenciesError } = await supabase
        .from('agencies')
        .select('id, name, contact_email, phone');

      if (agenciesError) {
        console.error('Error fetching agencies:', agenciesError);
      }

      const allContacts: Contact[] = [
        ...(users || []).map(user => ({
          id: user.id,
          name: user.full_name || user.email || 'Usuario',
          email: user.email,
          type: 'users',
          avatar: undefined
        })),
        ...(guests || []).map(guest => ({
          id: guest.id,
          name: guest.users?.[0]?.full_name || `Huésped ${guest.id.slice(0, 8)}`,
          email: guest.users?.[0]?.email,
          phone: guest.phone,
          type: 'guests',
          avatar: undefined
        })),
        ...(agents || []).map(agent => ({
          id: agent.id,
          name: agent.users?.[0]?.full_name || `Agente ${agent.id.slice(0, 8)}`,
          email: agent.users?.[0]?.email,
          phone: agent.phone,
          type: 'agents',
          avatar: agent.avatar_url
        })),
        ...(owners || []).map(owner => ({
          id: owner.id,
          name: owner.users?.[0]?.full_name || `Propietario ${owner.id.slice(0, 8)}`,
          email: owner.users?.[0]?.email,
          phone: owner.phone,
          type: 'owners',
          avatar: undefined
        })),
        ...(agencies || []).map(agency => ({
          id: agency.id,
          name: agency.name || 'Agencia',
          email: agency.contact_email,
          phone: agency.phone,
          type: 'agencies',
          avatar: undefined
        }))
      ];

      console.log('All contacts:', allContacts); // Debug log
      setContacts(allContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (view === 'inbox') {
        query = query.eq('recipient_id', currentUserId);
      } else if (view === 'sent') {
        query = query.eq('sender_id', currentUserId);
      }

      const { data: messagesData, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Enriquecer mensajes con nombres
      const enrichedMessages = await Promise.all(
        (messagesData || []).map(async (message) => {
          let senderName = 'Usuario';
          let recipientName = 'Usuario';

          if (message.sender_id === currentUserId) {
            senderName = 'Tú';
          } else {
            const sender = contacts.find(c => c.id === message.sender_id);
            senderName = sender?.name || 'Usuario';
          }

          const recipient = contacts.find(c => c.id === message.recipient_id);
          recipientName = recipient?.name || 'Usuario';

          return {
            ...message,
            sender_name: senderName,
            recipient_name: recipientName
          };
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentUserId || !selectedContact || !newMessage.trim()) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUserId,
          recipient_id: selectedContact.id,
          recipient_type: selectedContact.type,
          subject: subject || 'Sin asunto',
          content: newMessage
        }]);

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      setNewMessage('');
      setSubject('');
      setSelectedContact(null);
      setView('sent');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (message.sender_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (message.recipient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10">
      {/* Debug component - temporal */}
      <DebugMessages />
      
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
        {/* Sidebar */}
        <div className="lg:w-80 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Mensajería</h2>
            <button
              onClick={() => setView('compose')}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setView('inbox')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                view === 'inbox' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Bandeja
            </button>
            <button
              onClick={() => setView('sent')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                view === 'sent' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
            >
              <Send className="w-4 h-4" />
              Enviados
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact List */}
          {view === 'inbox' && (
            <RecentConversations 
              onSelectContact={(contactId, contactName, contactType, contactEmail) => {
                setSelectedContact({
                  id: contactId,
                  name: contactName,
                  email: contactEmail,
                  type: contactType
                });
                setView('conversation');
              }}
            />
          )}
          {(view === 'compose' || view === 'conversation') && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {contactsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Cargando contactos...</p>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No hay contactos disponibles</p>
                  <p className="text-xs">Asegúrate de tener usuarios en el sistema</p>
                </div>
              ) : (
                filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      console.log('Selected contact:', contact); // Debug log
                      setSelectedContact(contact);
                      if (view === 'compose') {
                        setView('conversation');
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{contact.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.email || contact.phone || contact.type}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-lg">
          {view === 'conversation' && selectedContact ? (
            <ConversationView 
              contact={selectedContact} 
              onBack={() => {
                setView('compose');
                setSelectedContact(null);
              }}
            />
          ) : view === 'compose' && selectedContact ? (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">{selectedContact.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Asunto (opcional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          ) : view === 'compose' ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Selecciona un contacto</h3>
              <p>Elige un contacto de la lista para comenzar a escribir</p>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {view === 'inbox' ? 'Bandeja de entrada' : 'Mensajes enviados'}
              </h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Cargando mensajes...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No hay mensajes para mostrar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map(message => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        message.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                      } hover:bg-gray-50`}
                      onClick={() => markAsRead(message.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              {view === 'inbox' ? message.sender_name : message.recipient_name}
                            </span>
                            {!message.is_read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <h4 className="font-medium mb-1">{message.subject}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const DebugMessages: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDebugInfo = async () => {
      const info: any = {};

      // Info del usuario actual
      info.currentUser = {
        uid: currentUser?.uid,
        email: currentUser?.email,
        displayName: currentUser?.displayName
      };

      try {
        // Verificar usuarios en la base de datos
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .limit(5);

        info.users = {
          data: users,
          error: usersError,
          count: users?.length || 0
        };

        // Verificar mensajes en la base de datos
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .limit(5);

        info.messages = {
          data: messages,
          error: messagesError,
          count: messages?.length || 0
        };

        // Buscar usuario actual en Supabase
        if (currentUser?.email) {
          const { data: currentUserData, error: currentUserError } = await supabase
            .from('users')
            .select('*')
            .eq('email', currentUser.email)
            .single();

          info.currentUserInSupabase = {
            data: currentUserData,
            error: currentUserError
          };
        }

        setDebugInfo(info);
      } catch (error) {
        console.error('Error en debug:', error);
        info.error = error;
        setDebugInfo(info);
      }
    };

    fetchDebugInfo();
  }, [currentUser]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Debug Info</h3>
      <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default DebugMessages; 
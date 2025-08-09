# Sistema de Mensajería

## Descripción General

El sistema de mensajería permite a los usuarios comunicarse entre sí de forma directa y en tiempo real. Incluye funcionalidades como conversaciones individuales, bandeja de entrada, mensajes enviados y notificaciones de mensajes no leídos.

## Características Principales

### 1. **Conversaciones en Tiempo Real**
- Mensajes instantáneos entre usuarios
- Suscripciones en tiempo real con Supabase Realtime
- Actualización automática de conversaciones

### 2. **Bandeja de Entrada**
- Vista de conversaciones recientes
- Indicadores de mensajes no leídos
- Ordenamiento por fecha de último mensaje

### 3. **Composición de Mensajes**
- Selección de contactos desde diferentes tipos de usuario
- Envío de mensajes con asunto opcional
- Interfaz intuitiva para escribir mensajes

### 4. **Notificaciones**
- Contador de mensajes no leídos en el sidebar
- Badges visuales en conversaciones
- Actualización automática del contador

## Estructura de Base de Datos

### Tabla `messages`
```sql
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(user_id),
    recipient_id UUID NOT NULL,
    recipient_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255) DEFAULT 'Sin asunto',
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Campos Principales
- `sender_id`: ID del usuario que envía el mensaje
- `recipient_id`: ID del destinatario
- `recipient_type`: Tipo de destinatario ('users', 'guests', 'agents', 'owners', 'agencies')
- `subject`: Asunto del mensaje (opcional)
- `content`: Contenido del mensaje
- `is_read`: Estado de lectura del mensaje

## Componentes Principales

### 1. **MessagesPage** (`src/pages/Messages/MessagesPage.tsx`)
Componente principal que gestiona toda la interfaz de mensajería.

**Funcionalidades:**
- Navegación entre bandeja de entrada, enviados y composición
- Gestión de contactos y conversaciones
- Integración con componentes especializados

**Estados:**
- `view`: Controla la vista actual ('inbox', 'sent', 'compose', 'conversation')
- `selectedContact`: Contacto seleccionado para conversación
- `messages`: Lista de mensajes filtrados
- `contacts`: Lista de contactos disponibles

### 2. **ConversationView** (`src/components/Messages/ConversationView.tsx`)
Componente para mostrar una conversación individual.

**Características:**
- Interfaz de chat en tiempo real
- Envío de mensajes con Enter
- Indicadores de tiempo de mensaje
- Diseño responsivo con burbujas de chat

**Funcionalidades:**
- Suscripción en tiempo real a nuevos mensajes
- Auto-scroll a nuevos mensajes
- Marcado automático como leído

### 3. **RecentConversations** (`src/components/Messages/RecentConversations.tsx`)
Componente para mostrar conversaciones recientes.

**Características:**
- Lista de conversaciones ordenadas por fecha
- Indicadores de mensajes no leídos
- Información del último mensaje
- Búsqueda de información de contactos

### 4. **MessageCounter** (`src/components/common/MessageCounter.tsx`)
Componente para mostrar el contador de mensajes no leídos.

**Funcionalidades:**
- Contador en tiempo real
- Badge visual en el sidebar
- Actualización automática

## Flujo de Datos

### 1. **Carga Inicial**
```typescript
// 1. Obtener usuario actual
const { currentUser } = useAuth();

// 2. Cargar contactos disponibles
const fetchContacts = async () => {
  // Buscar en diferentes tablas: users, guests, agents, owners, agencies
};

// 3. Cargar conversaciones recientes
const fetchConversations = async () => {
  // Obtener mensajes del usuario y agrupar por contacto
};
```

### 2. **Envío de Mensajes**
```typescript
const sendMessage = async () => {
  const { error } = await supabase
    .from('messages')
    .insert([{
      sender_id: currentUser.uid,
      recipient_id: selectedContact.id,
      recipient_type: selectedContact.type,
      subject: subject || 'Sin asunto',
      content: newMessage
    }]);
};
```

### 3. **Suscripciones en Tiempo Real**
```typescript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `recipient_id=eq.${userId}`
    },
    () => {
      // Actualizar contador o conversaciones
    }
  )
  .subscribe();
```

## Tipos de Usuario Soportados

### 1. **Usuarios Regulares** (`users`)
- Acceso completo al sistema de mensajería
- Pueden enviar y recibir mensajes

### 2. **Huéspedes** (`guests`)
- Conectados a través de la tabla `guests`
- Información obtenida desde `users` relacionado

### 3. **Agentes** (`agents`)
- Personal de agencias inmobiliarias
- Pueden comunicarse con propietarios y huéspedes

### 4. **Propietarios** (`owners`)
- Dueños de propiedades
- Comunicación con agentes y huéspedes

### 5. **Agencias** (`agencies`)
- Entidades organizacionales
- Comunicación con todos los tipos de usuario

## Políticas de Seguridad (RLS)

### Políticas Implementadas
```sql
-- Usuarios pueden ver mensajes enviados y recibidos
CREATE POLICY "Usuarios pueden ver mensajes enviados y recibidos" ON messages 
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = recipient_id
    );

-- Usuarios autenticados pueden enviar mensajes
CREATE POLICY "Usuarios autenticados pueden enviar mensajes" ON messages 
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Usuarios pueden marcar sus mensajes como leídos
CREATE POLICY "Usuarios pueden marcar sus mensajes como leídos" ON messages 
    FOR UPDATE USING (auth.uid() = recipient_id);
```

## Interfaz de Usuario

### 1. **Sidebar de Navegación**
- Botón "Nuevo Mensaje" (+)
- Pestañas: Bandeja, Enviados
- Barra de búsqueda
- Lista de contactos/conversaciones

### 2. **Área Principal**
- Vista de conversación individual
- Formulario de composición
- Lista de mensajes enviados/recibidos

### 3. **Indicadores Visuales**
- Badges de mensajes no leídos
- Estados de carga
- Indicadores de tiempo

## Optimizaciones Implementadas

### 1. **Rendimiento**
- Consultas optimizadas con índices
- Paginación de mensajes
- Caché de información de contactos

### 2. **Experiencia de Usuario**
- Actualizaciones en tiempo real
- Indicadores de estado de envío
- Interfaz responsiva

### 3. **Seguridad**
- Validación de permisos
- Sanitización de datos
- Políticas RLS estrictas

## Migración de Base de Datos

### Archivo: `messages_migration.sql`
```sql
-- Agregar campos faltantes
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT 'Sin asunto',
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear índices optimizados
CREATE INDEX IF NOT EXISTS idx_messages_recipient_unread ON messages(recipient_id, is_read);

-- Configurar triggers
CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Uso del Sistema

### 1. **Acceso a Mensajería**
- Navegar a `/messages` desde el sidebar
- El contador de mensajes no leídos se muestra automáticamente

### 2. **Enviar un Mensaje**
1. Hacer clic en "Nuevo Mensaje" (+)
2. Seleccionar un contacto de la lista
3. Escribir el mensaje y hacer clic en "Enviar"

### 3. **Ver Conversaciones**
1. En la bandeja de entrada, hacer clic en una conversación
2. Los mensajes se cargan automáticamente
3. Los nuevos mensajes aparecen en tiempo real

### 4. **Marcar como Leído**
- Los mensajes se marcan automáticamente al abrir la conversación
- El contador se actualiza en tiempo real

## Consideraciones Técnicas

### 1. **Autenticación**
- Integración con Firebase Auth
- Uso del contexto `AuthContext`
- Validación de usuario en todas las operaciones

### 2. **Tiempo Real**
- Supabase Realtime para actualizaciones
- Suscripciones específicas por usuario
- Limpieza de suscripciones al desmontar

### 3. **Manejo de Errores**
- Try-catch en todas las operaciones async
- Mensajes de error informativos
- Estados de carga apropiados

## Próximas Mejoras

### 1. **Funcionalidades Adicionales**
- Archivos adjuntos en mensajes
- Emojis y formato de texto
- Mensajes de voz

### 2. **Optimizaciones**
- Paginación infinita
- Búsqueda avanzada
- Filtros por fecha

### 3. **Notificaciones**
- Notificaciones push
- Emails de notificación
- Configuración de preferencias

## Archivos Relacionados

- `src/pages/Messages/MessagesPage.tsx` - Página principal
- `src/components/Messages/ConversationView.tsx` - Vista de conversación
- `src/components/Messages/RecentConversations.tsx` - Conversaciones recientes
- `src/components/common/MessageCounter.tsx` - Contador de mensajes
- `src/layout/AppSidebar.tsx` - Integración en sidebar
- `messages_migration.sql` - Migración de base de datos 
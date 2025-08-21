# 🔄 Sincronización Firebase ↔ Supabase

## 📋 **Descripción General**

Este sistema permite sincronizar automáticamente los datos de autenticación de Firebase con la base de datos de Supabase, manteniendo la información del usuario consistente entre ambas plataformas.

## 🏗️ **Arquitectura**

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Firebase  │───▶│  AuthContext │───▶│  Supabase   │
│    Auth     │    │   (React)    │    │  Database   │
└─────────────┘    └──────────────┘    └─────────────┘
```

## 🚀 **Implementación**

### **1. Crear la tabla `users` en Supabase**

Ejecuta la migración SQL en tu proyecto de Supabase:

```sql
-- Archivo: src/supabase/migrations/001_create_users_table.sql
-- Ejecutar en el SQL Editor de Supabase
```

### **2. Configurar el AuthContext**

El `AuthContext` ahora incluye sincronización automática:

```typescript
// src/context/AuthContext.tsx
const syncUserWithSupabase = async (firebaseUser: User) => {
  // Lógica de sincronización automática
};
```

### **3. Usar el hook `useUserSync`**

```typescript
import { useUserSync } from '../hooks/useUserSync';

const MyComponent = () => {
  const { supabaseUser, loading, error, syncUser } = useUserSync();
  
  // El usuario se sincroniza automáticamente
  // cuando se autentica con Firebase
};
```

## 📊 **Estructura de la Tabla `users`**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único de Supabase |
| `firebase_uid` | TEXT | ID único de Firebase |
| `email` | TEXT | Email del usuario |
| `display_name` | TEXT | Nombre mostrado |
| `photo_url` | TEXT | URL de la foto de perfil |
| `provider` | TEXT | Proveedor de autenticación |
| `role` | TEXT | Rol del usuario (guest/agent/owner/admin) |
| `is_active` | BOOLEAN | Estado del usuario |
| `last_sign_in` | TIMESTAMP | Último inicio de sesión |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

## 🔐 **Roles de Usuario**

- **`guest`**: Usuario básico (por defecto)
- **`agent`**: Agente inmobiliario
- **`owner`**: Propietario de propiedades
- **`admin`**: Administrador del sistema

## ⚡ **Flujo de Sincronización**

### **Usuario Nuevo:**
1. Usuario se registra con Firebase
2. `AuthContext` detecta el cambio
3. Se crea automáticamente en Supabase
4. Se asigna rol `guest` por defecto

### **Usuario Existente:**
1. Usuario inicia sesión con Firebase
2. Se actualiza información en Supabase
3. Se registra último acceso
4. Se mantiene rol existente

## 🛠️ **Uso del Sistema**

### **Componente de Perfil:**

```typescript
import UserProfileSync from '../components/common/UserProfileSync';

// En tu dashboard o perfil
<UserProfileSync />
```

### **Hook Personalizado:**

```typescript
import { useUserSync } from '../hooks/useUserSync';

const MyComponent = () => {
  const { 
    supabaseUser, 
    loading, 
    error, 
    updateUserProfile 
  } = useUserSync();

  const handleUpdateName = async () => {
    await updateUserProfile({ 
      display_name: 'Nuevo Nombre' 
    });
  };
};
```

## 🔧 **Configuración Adicional**

### **Políticas de Seguridad (RLS):**

Las políticas ya están configuradas en la migración:

- Usuarios pueden ver/editar solo su perfil
- Solo admins pueden crear/eliminar usuarios
- Seguridad a nivel de fila habilitada

### **Índices de Rendimiento:**

- `idx_users_email`: Búsqueda por email
- `idx_users_firebase_uid`: Búsqueda por UID de Firebase
- `idx_users_role`: Filtrado por rol

## 🚨 **Manejo de Errores**

El sistema incluye manejo robusto de errores:

- **Fallback automático**: Si falla la sincronización, se intenta obtener el rol directamente
- **Logging detallado**: Todos los errores se registran en consola
- **Estados de carga**: Indicadores visuales durante operaciones

## 📱 **Componentes Disponibles**

### **UserProfileSync**
- Muestra información de Firebase y Supabase
- Permite editar nombre de usuario
- Botón de refrescar datos
- Estados de carga y error

### **useUserSync Hook**
- Sincronización automática
- Actualización de perfil
- Refrescar datos manualmente
- Estados de carga y error

## 🔄 **Actualizaciones Automáticas**

- **Último acceso**: Se actualiza en cada inicio de sesión
- **Información del perfil**: Se sincroniza cuando cambia en Firebase
- **Timestamp de actualización**: Se mantiene automáticamente

## 🧪 **Testing**

Para probar la sincronización:

1. Registra un usuario con Firebase
2. Verifica que se cree en Supabase
3. Inicia sesión y verifica la sincronización
4. Edita el perfil y verifica la actualización

## 📝 **Notas Importantes**

- **Firebase UID**: Se usa como identificador único para evitar duplicados
- **Rol por defecto**: Todos los usuarios nuevos reciben rol `guest`
- **Seguridad**: Las políticas RLS protegen los datos del usuario
- **Performance**: Los índices optimizan las consultas frecuentes

## 🆘 **Solución de Problemas**

### **Usuario no se sincroniza:**
1. Verifica la conexión a Supabase
2. Revisa los logs de consola
3. Verifica que la tabla `users` exista
4. Comprueba las políticas RLS

### **Error de permisos:**
1. Verifica que el usuario tenga el rol correcto
2. Comprueba las políticas de seguridad
3. Verifica la configuración de Supabase

### **Datos no se actualizan:**
1. Verifica que `updateUserProfile` se llame correctamente
2. Revisa los logs de error
3. Verifica la estructura de la tabla

## 🔮 **Futuras Mejoras**

- [ ] Sincronización bidireccional
- [ ] Cache local para mejor rendimiento
- [ ] Sincronización en tiempo real con WebSockets
- [ ] Backup automático de datos
- [ ] Migración de usuarios existentes

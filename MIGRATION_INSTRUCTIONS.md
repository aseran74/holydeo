# 🚀 Migración: Crear Tabla de Perfiles

## 📋 Problema Identificado

La aplicación no puede mostrar los nombres de propietarios y agencias porque:
- ❌ La tabla `users` tiene políticas RLS muy restrictivas (Error 406)
- 🔒 `auth.users` solo permite acceso al usuario autenticado (Error 403)
- ❌ La tabla `profiles` no existe (Error 404)

## 🛠️ Solución

Crear una nueva tabla `profiles` con políticas RLS apropiadas para almacenar información de contacto de usuarios.

## 📝 Pasos para Ejecutar la Migración

### 1. Acceder a Supabase Dashboard
- Ve a [supabase.com](https://supabase.com)
- Inicia sesión en tu cuenta
- Selecciona tu proyecto: `wnevxdjytvbelknmtglf`

### 2. Ejecutar SQL en el Editor SQL
- En el dashboard, ve a **SQL Editor**
- Crea un nuevo query
- Copia y pega el contenido del archivo `create_profiles_table.sql`

### 3. Verificar la Migración
- Ve a **Table Editor**
- Deberías ver la nueva tabla `profiles`
- Verifica que tenga las columnas: `id`, `full_name`, `email`, `phone`, `role`, `created_at`, `updated_at`

### 4. Probar la Aplicación
- Recarga la página de detalles de propiedad
- Verifica en la consola que no haya errores 404/406/403
- Los nombres de propietarios y agencias deberían aparecer

## 🔧 Estructura de la Tabla

```sql
profiles
├── id (UUID, PK, FK a auth.users)
├── full_name (TEXT)
├── email (TEXT)
├── phone (TEXT, opcional)
├── role (TEXT, default: 'guest')
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🔐 Políticas RLS

- **SELECT**: Acceso público (para mostrar información de contacto)
- **INSERT**: Solo usuarios autenticados
- **UPDATE**: Solo el propietario del perfil

## 🎯 Beneficios

- ✅ **Nombres reales** en lugar de IDs
- 🔒 **Seguridad** con RLS apropiado
- 📱 **Información de contacto** completa
- 🚀 **Escalabilidad** para futuras funcionalidades

## 🚨 Si Algo Sale Mal

1. **Verifica los logs** en la consola del navegador
2. **Revisa las políticas RLS** en Supabase
3. **Confirma que la tabla existe** en Table Editor
4. **Verifica los permisos** de tu usuario admin

## 📞 Soporte

Si tienes problemas, comparte:
- Los errores de la consola
- El estado de la tabla `profiles` en Supabase
- Los logs de la aplicación

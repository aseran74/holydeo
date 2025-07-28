# 🗄️ Configuración de Base de Datos - Sistema de Propiedades

## 📋 Estado Actual
Tu proyecto de Supabase está en estado **REMOVED** y necesita ser restaurado. Esto puede tomar hasta 30 minutos.

## 🔧 Pasos para Restaurar y Configurar

### 1. **Restaurar el Proyecto de Supabase**
- Ve a [app.supabase.com](https://app.supabase.com)
- Selecciona tu proyecto `loginroles`
- Si aparece como "REMOVED", haz clic en "Restore Project"
- Espera hasta 30 minutos para que se complete la restauración

### 2. **Ejecutar el Esquema de Base de Datos**
Una vez que el proyecto esté activo:

1. Ve al **SQL Editor** en tu dashboard de Supabase
2. Copia y pega todo el contenido del archivo `database_schema.sql`
3. Ejecuta el script completo

### 3. **Verificar las Tablas Creadas**
El script creará las siguientes tablas:

#### 🏠 **Tablas Principales:**
- `properties` - Propiedades inmobiliarias
- `blocked_dates` - Fechas bloqueadas para reservas
- `special_prices` - Precios especiales por fecha
- `experiences` - Experiencias turísticas
- `messages` - Sistema de mensajería
- `bookings` - Reservas de propiedades
- `reviews` - Reseñas de propiedades

#### 🔐 **Seguridad:**
- **RLS (Row Level Security)** habilitado en todas las tablas
- **Políticas de acceso** configuradas para diferentes roles
- **Índices optimizados** para consultas rápidas

### 4. **Configurar Variables de Entorno**
Asegúrate de que tu archivo `.env` tenga:

```env
VITE_SUPABASE_URL=https://mhfegdmspiwnyinknlhm.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui
```

### 5. **Probar la Conexión**
Una vez configurado, puedes probar la conexión desde tu aplicación:

1. Ve a la página de **Propiedades** (`/properties`)
2. Deberías ver las propiedades de ejemplo
3. Puedes crear, editar y eliminar propiedades

## 🎯 Funcionalidades Disponibles

### **Propiedades:**
- ✅ Crear/editar propiedades
- ✅ Subir imágenes a la galería
- ✅ Configurar precios por día/semana
- ✅ Gestionar comodidades
- ✅ Integración con Google Maps
- ✅ Calendario de disponibilidad

### **Reservas:**
- ✅ Sistema de reservas completo
- ✅ Fechas bloqueadas
- ✅ Precios especiales
- ✅ Importación/exportación iCal

### **Experiencias:**
- ✅ Gestión de experiencias turísticas
- ✅ Categorías y precios
- ✅ Fechas recurrentes

### **Mensajería:**
- ✅ Sistema de mensajes entre usuarios
- ✅ Diferentes tipos de destinatarios

## 🚨 Solución de Problemas

### **Si el proyecto no se restaura:**
1. Abre un ticket en [Supabase Support](https://app.supabase.com/support/new)
2. Menciona que el proyecto está en estado REMOVED
3. Proporciona el ID del proyecto: `mhfegdmspiwnyinknlhm`

### **Si hay errores de permisos:**
1. Verifica que las políticas RLS estén configuradas correctamente
2. Asegúrate de que el usuario esté autenticado con Clerk
3. Revisa los logs en la consola del navegador

### **Si las imágenes no se suben:**
1. Configura el bucket de Storage en Supabase
2. Verifica las políticas de Storage
3. Asegúrate de que la URL del bucket esté correcta

## 📞 Soporte
Si necesitas ayuda adicional:
- Revisa los logs de la consola del navegador
- Verifica la conexión a Supabase en el componente `SupabaseTest`
- Consulta la documentación de Supabase para políticas RLS 
# 🔧 Actualización de Variables de Entorno

## 📋 Credenciales del Proyecto Activo

Tu proyecto de Supabase está **ACTIVO** y funcionando. Necesitas actualizar tu archivo `.env` con estas credenciales:

```env
# Supabase - Proyecto ACTIVO
VITE_SUPABASE_URL=https://wnevxdjytvbelknmtglf.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_del_proyecto_holydeo

# Google Maps (para mapas y geocodificación)
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui

# Clerk (autenticación)
VITE_CLERK_PUBLISHABLE_KEY=tu_clave_de_clerk_aqui
```

## 🎯 Estado de la Base de Datos

✅ **Proyecto:** `holydeo` (ACTIVE_HEALTHY)  
✅ **Región:** eu-north-1  
✅ **PostgreSQL:** 17.4.1.052  
✅ **Tablas:** 12 tablas configuradas  
✅ **Datos:** 20 propiedades, 30 usuarios, 9 reservas  

## 📊 Tablas Disponibles

### **Propiedades:**
- `properties` - 20 propiedades con datos completos
- `blocked_dates` - Fechas bloqueadas
- `special_prices` - Precios especiales
- `bookings` - Reservas

### **Usuarios:**
- `users` - Sistema de usuarios con roles
- `agencies` - Agencias inmobiliarias
- `agents` - Agentes inmobiliarios
- `owners` - Propietarios
- `guests` - Huéspedes

### **Funcionalidades:**
- `experiences` - Experiencias turísticas
- `ical_configs` - Integración con calendarios
- `property_agents` - Gestión de agentes por propiedad

## 🚀 Funcionalidades Listas

Una vez actualizadas las credenciales, tendrás acceso a:

✅ **Gestión completa de propiedades**  
✅ **Sistema de reservas**  
✅ **Calendarios iCal**  
✅ **Experiencias turísticas**  
✅ **Gestión de usuarios y roles**  
✅ **Mapas y geocodificación**  
✅ **Sistema de precios dinámicos**  

## 🔑 Obtener la Clave Anónima

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Selecciona el proyecto `holydeo`
3. Ve a Settings > API
4. Copia la "anon public" key
5. Pégala en tu archivo `.env`

¡Tu aplicación estará completamente funcional con todos los datos existentes! 
# 🔑 Credenciales CORRECTAS - Proyecto ACTIVO

## 🚨 PROBLEMA IDENTIFICADO

Tu aplicación está intentando conectarse a `mhfegdmspiwnyinknlhm.supabase.co` (proyecto inactivo) en lugar de `wnevxdjytvbelknmtglf.supabase.co` (proyecto activo).

## ✅ SOLUCIÓN

### **Actualiza tu archivo `.env` con estas credenciales CORRECTAS:**

```env
# Supabase - Proyecto ACTIVO (holydeo)
VITE_SUPABASE_URL=https://wnevxdjytvbelknmtglf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZXZ4ZGp5dHZiZWxrbm10Z2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzQxMjksImV4cCI6MjA2NzcxMDEyOX0.akA0n6yo5CbgB71dOTZBIEsityuohWegUpTTwQXdDA0

# Clerk (autenticación)
VITE_CLERK_PUBLISHABLE_KEY=tu_clave_de_clerk_aqui

# Google Maps (opcional)
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui
```

## 📊 Estado del Proyecto ACTIVO

✅ **Proyecto:** `holydeo` (ACTIVE_HEALTHY)  
✅ **ID:** `wnevxdjytvbelknmtglf`  
✅ **Región:** eu-north-1  
✅ **PostgreSQL:** 17.4.1.052  
✅ **Datos disponibles:**

- **🏠 20 Propiedades** con información completa
- **👥 30 Usuarios** con sistema de roles
- **📅 9 Reservas** activas
- **🏢 10 Agencias** inmobiliarias
- **👨‍💼 10 Agentes** inmobiliarios
- **🏠 10 Propietarios**
- **🛏️ 11 Huéspedes**
- **📅 74 Fechas bloqueadas**
- **💰 12 Precios especiales**
- **📅 6 Configuraciones iCal**

## 🚀 Pasos para Solucionar

1. **Actualiza tu archivo `.env`** con las credenciales de arriba
2. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. **Ve a la URL correcta:** `http://localhost:5174`
4. **Revisa el dashboard** - Verás todos los componentes funcionando
5. **Ve a Propiedades:** `http://localhost:5174/properties`

## 🔍 Verificación

Una vez actualizadas las credenciales, deberías ver en el dashboard:

- ✅ **Variables de Entorno:** Todas configuradas
- ✅ **Conexión Supabase:** Exitosa con 20 propiedades
- ✅ **Debug Clerk:** Estado de autenticación
- ✅ **Propiedades:** Lista de propiedades de ejemplo

## 📱 URLs de Acceso

- **Dashboard:** `http://localhost:5174`
- **Propiedades:** `http://localhost:5174/properties`
- **Reservas:** `http://localhost:5174/bookings`
- **Experiencias:** `http://localhost:5174/experiences`
- **Agencias:** `http://localhost:5174/agencies`
- **Agentes:** `http://localhost:5174/agents`
- **Propietarios:** `http://localhost:5174/owners`
- **Huéspedes:** `http://localhost:5174/guests`
- **Mensajes:** `http://localhost:5174/messages`

## 🎯 Tablas Disponibles

- `properties` - 20 propiedades
- `users` - 30 usuarios
- `bookings` - 9 reservas
- `agencies` - 10 agencias
- `agents` - 10 agentes
- `owners` - 10 propietarios
- `guests` - 11 huéspedes
- `blocked_dates` - 74 fechas bloqueadas
- `special_prices` - 12 precios especiales
- `experiences` - Experiencias turísticas
- `ical_configs` - 6 configuraciones iCal
- `property_agents` - Relación propiedades-agentes

¡Tu aplicación estará completamente funcional con todos los datos existentes! 🚀 
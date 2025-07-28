# 📅 Sistema de Gestión de Calendario - Proyecto Holydeo

## 🎯 Estado Actual del Proyecto

### ✅ **Base de Datos Configurada**
Tu proyecto `wnevxdjytvbelknmtglf` ya tiene todas las tablas necesarias:

- **`properties`** (20 registros) - Propiedades inmobiliarias
- **`blocked_dates`** (74 registros) - Fechas bloqueadas
- **`special_prices`** (12 registros) - Precios especiales
- **`bookings`** (9 registros) - Reservas de huéspedes
- **`ical_configs`** (6 registros) - Configuraciones iCal
- **`guests`** (11 registros) - Huéspedes registrados

### ✅ **Estructura de Datos Compatible**
El sistema está adaptado a tu estructura específica:

```sql
-- Reservas
bookings: id, property_id, guest_id, start_date, end_date, status, created_at

-- Fechas bloqueadas
blocked_dates: id, property_id, date, source, created_at

-- Precios especiales
special_prices: id, property_id, date, price, created_at

-- Configuraciones iCal
ical_configs: id, property_id, name, url, type, is_active, sync_interval, last_sync, created_at, updated_at

-- Huéspedes
guests: id, user_id, phone, clerk_id, created_at
```

## 🚀 Funcionalidades Implementadas

### **📅 Gestión de Calendario Avanzada**
- ✅ **Bloqueo de días**: Manual o importado desde iCal
- ✅ **Precios especiales**: Asignar precios específicos por día
- ✅ **Reservas**: Crear reservas directamente desde el calendario
- ✅ **Gestión de huéspedes**: Seleccionar de tu tabla `guests`
- ✅ **Códigos de colores**: Verde (reservas), Rojo (bloqueado), Amarillo (iCal), Azul (precios)

### **🔄 Sincronización iCal**
- ✅ **Importación iCal**: Desde Airbnb, Booking.com, etc.
- ✅ **Exportación iCal**: Para sincronizar con otras plataformas
- ✅ **Configuraciones múltiples**: Gestionar múltiples fuentes
- ✅ **URL de sincronización**: Para sincronización bidireccional

### **🎨 Interfaz Intuitiva**
- ✅ **4 pestañas**: Calendario, Configuración iCal, Reservas, Precios
- ✅ **Modos de operación**: Ver, Bloquear, Precios, Reservas
- ✅ **Estadísticas en tiempo real**: Resumen de actividad
- ✅ **Acceso directo**: Botón "Calendario" en cada propiedad

## 🛠️ Cómo Usar el Sistema

### **1. Acceder a la Gestión de Calendario**

1. Ve a **Propiedades** (`/properties`)
2. En cualquier propiedad, haz clic en el botón **"Calendario"** (verde)
3. O navega directamente a: `/calendar-management/{propertyId}`

### **2. Gestión de Calendario (Pestaña Principal)**

#### **Modos de Operación:**
- **Ver**: Solo visualizar el calendario
- **Bloquear**: Bloquear/desbloquear días
- **Precios**: Asignar precios especiales
- **Reservas**: Crear reservas para huéspedes

#### **Funcionalidades:**
- **Clic en día**: Abre modal con opciones según el modo
- **Códigos de colores**: 
  - 🟢 Verde: Reserva confirmada
  - 🔴 Rojo: Día bloqueado manualmente
  - 🟡 Amarillo: Bloqueado por iCal
  - 🔵 Azul: Precio especial

### **3. Configuración iCal (Pestaña iCal)**

#### **URL de Sincronización:**
- Cada propiedad tiene su URL única
- Copia la URL para sincronizar con otras plataformas

#### **Configuraciones de Sincronización:**
- **Agregar configuración**: Nombre, URL, tipo, intervalo
- **Tipos soportados**: Importación, Exportación
- **Intervalos**: Configurable en horas (1-168)
- **Estado**: Activar/desactivar sincronizaciones

### **4. Importación/Exportación iCal**

#### **Importar iCal:**
1. Haz clic en "Importar iCal"
2. Selecciona archivo `.ics`
3. Las fechas se importan automáticamente como bloqueadas

#### **Exportar iCal:**
1. Haz clic en "Exportar iCal"
2. Se descarga archivo con todas las fechas
3. Incluye reservas, bloqueos y precios especiales

## 📊 Datos Actuales del Proyecto

### **Estadísticas de tu Base de Datos:**
- **Propiedades**: 20 propiedades registradas
- **Fechas bloqueadas**: 74 días bloqueados
- **Precios especiales**: 12 días con precios especiales
- **Reservas**: 9 reservas activas
- **Configuraciones iCal**: 6 configuraciones
- **Huéspedes**: 11 huéspedes registrados

### **Estructura de Relaciones:**
```
properties
├── blocked_dates (property_id)
├── special_prices (property_id)
├── bookings (property_id)
├── ical_configs (property_id)
└── property_agents (property_id)

guests
├── users (user_id)
└── bookings (guest_id)

users
├── owners (user_id)
├── agents (user_id)
└── guests (user_id)
```

## 🔧 Configuración Técnica

### **Rutas Configuradas:**
```typescript
/calendar-management/:propertyId  -- Gestión de calendario
/image-upload-test               -- Prueba de subida de imágenes
```

### **Componentes Creados:**
```
src/components/CalendarManagement/
├── AdvancedCalendarManager.tsx    -- Calendario principal
├── ICalConfiguration.tsx          -- Configuración iCal
└── CalendarManagement.tsx         -- Página principal

src/pages/CalendarManagement/
└── CalendarManagement.tsx         -- Página con pestañas
```

## 🎨 Interfaz de Usuario

### **Códigos de Colores:**
- **🟢 Verde**: Reserva confirmada
- **🔴 Rojo**: Día bloqueado manualmente
- **🟡 Amarillo**: Bloqueado por importación iCal
- **🔵 Azul**: Precio especial asignado
- **⚪ Blanco**: Día disponible

### **Botones de Acción:**
- **Calendario**: Acceso directo desde tarjetas de propiedades
- **Exportar**: Descargar calendario en formato iCal
- **Importar**: Subir archivo iCal para bloquear fechas
- **Sincronizar**: Sincronizar todas las configuraciones activas

## 🔄 Sincronización con Plataformas

### **Configuración para Airbnb:**
1. Ve a tu cuenta de Airbnb
2. Busca la URL del calendario
3. Agrega configuración en pestaña iCal
4. Selecciona tipo "Importación"
5. Configura intervalo de sincronización

### **Configuración para Booking.com:**
1. Accede a tu panel de Booking.com
2. Encuentra la URL del calendario
3. Agrega configuración en pestaña iCal
4. Selecciona tipo "Importación"
5. Configura intervalo de sincronización

## 📈 Estadísticas y Métricas

### **Panel de Estadísticas:**
- **Reservas Activas**: Número de reservas confirmadas
- **Días Bloqueados**: Total de días no disponibles
- **Precios Especiales**: Días con precios personalizados
- **Sincronizaciones**: Configuraciones iCal activas

### **Información en Tiempo Real:**
- Actualización automática al hacer cambios
- Contadores dinámicos
- Estado de sincronización

## 🛠️ Mantenimiento y Soporte

### **Verificación de Funcionamiento:**
1. Ve a `/image-upload-test` para probar subida de imágenes
2. Verifica que las configuraciones iCal estén activas
3. Revisa los logs de la consola para errores
4. Verifica la conexión a Supabase

### **Solución de Problemas Comunes:**

#### **Las fechas no se bloquean:**
- Verifica que estés autenticado con Clerk
- Revisa las políticas RLS en Supabase
- Verifica la conexión a la base de datos

#### **La sincronización iCal no funciona:**
- Verifica que la URL del calendario sea correcta
- Asegúrate de que el archivo iCal tenga el formato correcto
- Revisa que la configuración esté activa

#### **Los precios especiales no se guardan:**
- Verifica que el campo precio sea numérico
- Revisa que tengas permisos para editar la propiedad
- Verifica la conexión a Supabase

## 🚀 Próximas Mejoras

### **Funcionalidades Planificadas:**
- 📊 Dashboard de estadísticas avanzadas
- 📅 Vista de calendario semanal y anual
- 🔄 Sincronización automática programada
- 📱 Notificaciones de reservas
- 💰 Gestión avanzada de precios por temporada
- 👥 Gestión completa de huéspedes
- 📈 Reportes y analytics

### **Integraciones Futuras:**
- 🏠 Más plataformas de alquiler
- 📧 Notificaciones por email
- 💳 Integración con sistemas de pago
- 📱 Aplicación móvil
- 🤖 Automatización con IA

---

## 🎉 ¡Sistema Listo para Usar!

Tu sistema de gestión de calendario está completamente funcional y adaptado a tu estructura de base de datos existente. 

**Datos actuales:**
- ✅ 20 propiedades
- ✅ 74 días bloqueados
- ✅ 12 precios especiales
- ✅ 9 reservas activas
- ✅ 6 configuraciones iCal
- ✅ 11 huéspedes registrados

**Acceso:**
- Ve a `/properties` y haz clic en "Calendario" en cualquier propiedad
- O navega directamente a `/calendar-management/{propertyId}`

¡El sistema está listo para gestionar el calendario de todas tus propiedades! 🚀 
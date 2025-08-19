<img width="1212" height="836" alt="image" src="https://github.com/user-attachments/assets/32849789-b5e1-45eb-b968-2c4554052603" />

<<<<<<< HEAD
A free React admin dashboard template built with Tailwind CSS and TypeScript, featuring a comprehensive booking management system with role-based access control.
=======
<img width="1195" height="720" alt="image" src="https://github.com/user-attachments/assets/e308bb8f-20c8-42d9-8032-746c5d4ad9c3" />
>>>>>>> e54bd724f23f4c5d4f7a17d1daeb5207a0c5c1b7

https://holydeo.vercel.app/

<<<<<<< HEAD
- Modern and clean design with Tailwind CSS
- Responsive layout for all devices
- Dark mode support
- TypeScript support for type safety
- Role-based access control (Admin, Owner, Guest)
- Property and experience booking system
- Social network integration
- Real-time notifications for guest users
- Firebase authentication with Google OAuth
- Supabase backend integration
- Dynamic sidebar navigation based on user role
=======
🏠 Holydeo 
>>>>>>> e54bd724f23f4c5d4f7a17d1daeb5207a0c5c1b7

Un dashboard administrativo moderno y completo construido con React, TypeScript, Tailwind CSS y Supabase, diseñado para la gestión de propiedades inmobiliarias, reservas y experiencias turísticas.

<<<<<<< HEAD
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables (see Configuration section)
4. Start development server: `npm run dev`
5. Build for production: `npm run build`

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## User Roles

### Admin
- Full access to all features
- User management
- Social media management
- Property and experience oversight

### Owner
- Property management
- Booking management
- Analytics dashboard

### Guest
- Limited dashboard with "Mis Reservas" and "Red Social"
- Property and experience search
- Booking management
- Real-time notifications for booking changes and social updates

## Features in Detail

### Notification System for Guest Users

The application includes a comprehensive notification system specifically designed for guest users:

- **Real-time Updates**: Notifications are updated every 5 minutes automatically
- **Booking Notifications**: 
  - New booking confirmations
  - Status changes (confirmed, pending, cancelled, completed)
  - Booking updates and modifications
- **Social Media Notifications**: 
  - New posts in the community
  - Updates from followed categories
- **Smart Filtering**: Only shows relevant notifications from the last 24 hours
- **Visual Indicators**: Different icons and colors for different notification types
- **Mark as Read**: Users can mark notifications as read to manage their notification list

### Dashboard Features

- **Guest Dashboard**: Simplified view with essential features
- **Quick Search**: Direct access to property and experience search
- **Recent Bookings**: Overview of latest reservations
- **Social Feed**: Latest community updates
- **Responsive Design**: Works seamlessly on all devices

## Technical Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Authentication**: Firebase Authentication with Google OAuth
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **State Management**: React Context API
- **UI Components**: Custom components with Framer Motion animations
- **Build Tool**: Vite
=======
![Dashboard Preview](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.0.0-3ECF8E?style=for-the-badge&logo=supabase)
>>>>>>> e54bd724f23f4c5d4f7a17d1daeb5207a0c5c1b7

## ✨ Características Principales

### 🏗️ **Gestión de Propiedades**
- Sistema completo de CRUD para propiedades inmobiliarias
- Gestión de imágenes múltiples con Supabase Storage
- Integración con Google Maps para ubicaciones
- Sistema de filtros avanzados y búsqueda
- Cálculo automático de precios

<<<<<<< HEAD
---

**Last Updated**: March 8, 2025
**Version**: 2.0.2
=======
### 📅 **Sistema de Calendario**
- Calendario interactivo con MUI Date Picker
- Gestión de disponibilidad en tiempo real
- Sincronización iCal para reservas externas
- Vista de reservas por propiedad
- Sistema de bloqueo de fechas

### 💬 **Sistema de Mensajería**
- Chat en tiempo real entre usuarios
- Notificaciones push
- Historial de conversaciones
- Sistema de mensajes no leídos

### 🎯 **Experiencias Turísticas**
- Gestión de experiencias y tours
- Categorización por tipo de actividad
- Sistema de reservas para experiencias
- Gestión de participantes máximos

### 👥 **Gestión de Usuarios**
- Sistema de roles (Admin, Owner, Agent, User)
- Perfiles personalizables
- Gestión de agencias inmobiliarias
- Sistema de permisos granular

### 📱 **Feed Social**
- Posts con imágenes y texto
- Sistema de likes y comentarios
- Feed personalizado por usuario
- Interacción social completa

### 🔐 **Autenticación y Seguridad**
- Integración con Supabase Auth
- Row Level Security (RLS)
- Políticas de acceso granulares
- JWT tokens seguros

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework CSS utilitario
- **Vite** - Herramienta de construcción rápida
- **React Router** - Enrutamiento de aplicaciones

### Backend y Base de Datos
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Base de datos relacional
- **PostGIS** - Extensiones geoespaciales
- **Row Level Security** - Seguridad a nivel de fila

### Componentes UI
- **MUI (Material-UI)** - Componentes de calendario
- **Headless UI** - Componentes accesibles
- **React Hook Form** - Gestión de formularios
- **React Query** - Gestión de estado del servidor

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📋 Requisitos Previos

- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior
- **Cuenta de Supabase** (gratuita)
- **Cuenta de Google Cloud** (para Maps API)

## 🛠️ Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/free-react-tailwind-admin-dashboard.git
cd free-react-tailwind-admin-dashboard
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=tu_clave_api_de_google_maps

# Configuración de la App
VITE_APP_NAME=Dashboard Inmobiliario
VITE_APP_URL=http://localhost:5173
```

### 4. Configurar Base de Datos
Ejecutar el archivo `schema.sql` en tu proyecto de Supabase:

```bash
# Opción 1: Desde el dashboard de Supabase
# Copiar y pegar el contenido de schema.sql en el SQL Editor

# Opción 2: Desde la línea de comandos
psql -h tu-host -U tu-usuario -d tu-base-de-datos -f schema.sql
```

### 5. Ejecutar la Aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🗄️ Estructura de la Base de Datos

El proyecto incluye las siguientes tablas principales:

- **`profiles`** - Perfiles de usuario
- **`agencies`** - Agencias inmobiliarias
- **`properties`** - Propiedades inmobiliarias
- **`bookings`** - Sistema de reservas
- **`messages`** - Sistema de mensajería
- **`experiences`** - Experiencias turísticas
- **`reviews`** - Sistema de reseñas
- **`availability`** - Gestión de disponibilidad
- **`social_posts`** - Feed social
- **`notifications`** - Sistema de notificaciones

## 🎨 Personalización

### Temas y Colores
El proyecto utiliza Tailwind CSS con un sistema de temas personalizable. Puedes modificar los colores en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // ... más colores personalizados
      }
    }
  }
}
```

### Componentes
Todos los componentes están en `src/components/` y pueden ser fácilmente personalizados o extendidos según tus necesidades.

## 📱 Características Responsivas

- **Mobile First** - Diseño optimizado para móviles
- **Breakpoints** - Adaptable a tablets y desktop
- **Touch Friendly** - Interacciones optimizadas para touch
- **Progressive Web App** - Funcionalidad offline básica

## 🔒 Seguridad

- **Row Level Security (RLS)** en todas las tablas
- **Políticas de acceso** granulares por usuario y rol
- **Autenticación JWT** segura
- **Validación de entrada** en frontend y backend
- **Sanitización de datos** automática

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Subir la carpeta dist/ a Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE.md` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 **Email**: tu-email@ejemplo.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/free-react-tailwind-admin-dashboard/issues)
- 💬 **Discord**: [Servidor de Discord](https://discord.gg/tu-servidor)

## 🙏 Agradecimientos

- [Tailwind CSS](https://tailwindcss.com/) por el increíble framework CSS
- [Supabase](https://supabase.com/) por el backend-as-a-service
- [React](https://reactjs.org/) por la biblioteca de UI
- [Vite](https://vitejs.dev/) por la herramienta de construcción
- [Material-UI](https://mui.com/) por los componentes de calendario

## 📊 Estadísticas del Proyecto

![GitHub stars](https://img.shields.io/github/stars/tu-usuario/free-react-tailwind-admin-dashboard?style=social)
![GitHub forks](https://img.shields.io/github/forks/tu-usuario/free-react-tailwind-admin-dashboard?style=social)
![GitHub issues](https://img.shields.io/github/issues/tu-usuario/free-react-tailwind-admin-dashboard)
![GitHub pull requests](https://img.shields.io/github/issues-pr/tu-usuario/free-react-tailwind-admin-dashboard)

---

⭐ **Si te gusta este proyecto, ¡dale una estrella en GitHub!** ⭐
>>>>>>> e54bd724f23f4c5d4f7a17d1daeb5207a0c5c1b7

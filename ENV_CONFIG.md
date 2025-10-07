# Configuración de Variables de Entorno

## Archivos de Entorno

### Archivos Públicos (visibles en GitHub)
- `.env.example` - Plantilla con valores de ejemplo
- `.env.development` - Configuración para desarrollo
- `.env` - Configuración base

### Archivos Privados (ocultos en GitHub)
- `.env.production` - Configuración de producción (contiene datos sensibles)
- `.env.local` - Configuración local del desarrollador
- `.env.production.local` - Configuración local de producción

## Variables de Entorno Requeridas

```bash
# Base de datos Supabase
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Configuración de la aplicación
VITE_APP_NAME=HolyDeo Admin Dashboard
VITE_APP_VERSION=1.0.0

# Configuración de Firebase (opcional)
VITE_FIREBASE_API_KEY=tu_firebase_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id

# Configuración de Google Maps (opcional)
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key_aqui

# Configuración de desarrollo
VITE_NODE_ENV=development
VITE_DEBUG=true
```

## Cómo Configurar

1. Copia el archivo `.env.example` a `.env`
2. Reemplaza los valores de ejemplo con tus valores reales
3. Para producción, crea `.env.production` con los valores de producción
4. Los archivos de producción NO se suben a GitHub por seguridad

## Seguridad

- **NUNCA** subas archivos `.env.production` a GitHub
- Usa `.env.example` como plantilla pública
- Mantén las claves de API y URLs de producción en archivos locales únicamente

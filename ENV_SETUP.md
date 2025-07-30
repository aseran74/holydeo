# 🔧 Configuración de Variables de Entorno

## ❌ Error Actual
El error indica que falta la clave pública de Clerk:
```
Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.
```

## ✅ Solución

### 1. Crear archivo `.env` en la raíz del proyecto

Crea un archivo llamado `.env` en la carpeta raíz del proyecto con el siguiente contenido:

```env
# Clerk - Autenticación
VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Supabase - Base de datos
VITE_SUPABASE_URL=https://wnevxdjytvbelknmtglf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZXZ4ZGp5dHZiZWxrbm10Z2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzQxMjksImV4cCI6MjA2NzcxMDEyOX0.akA0n6yo5CbgB71dOTZBIEsityuohWegUpTTwQXdDA0

# Google Maps (opcional)
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui
```

### 2. Obtener tu clave de Clerk

1. Ve a [clerk.com](https://clerk.com)
2. Crea una cuenta o inicia sesión
3. Crea una nueva aplicación
4. Ve a **API Keys** en el dashboard
5. Copia la **Publishable Key**
6. Reemplaza `pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` con tu clave real

### 3. Reiniciar el servidor

```bash
npm run dev
```

## 🔍 Verificación

Una vez configurado, el error debería desaparecer y podrás:
- ✅ Ver la landing page sin errores
- ✅ Usar la autenticación de Clerk
- ✅ Acceder al dashboard

## 📝 Nota

El archivo `.env` está en `.gitignore` por seguridad, por lo que no se sube al repositorio. 
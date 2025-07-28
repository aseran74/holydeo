# 🔐 Configuración de Clerk - Autenticación

## 📋 Problema Identificado

El login de Clerk no está funcionando porque:
1. Las páginas de SignIn/SignUp no están usando los componentes de Clerk
2. La clave de Clerk puede no estar configurada correctamente
3. El Header no está mostrando el estado de autenticación

## ✅ Soluciones Aplicadas

### **1. Páginas de Autenticación Corregidas**

- ✅ `src/pages/AuthPages/SignIn.tsx` - Ahora usa `<SignIn />` de Clerk
- ✅ `src/pages/AuthPages/SignUp.tsx` - Ahora usa `<SignUp />` de Clerk
- ✅ `src/components/header/Header.tsx` - Ahora usa `UserButton` y `SignedIn/SignedOut`

### **2. Componentes de Debug Agregados**

- ✅ `src/components/ClerkDebug.tsx` - Para verificar el estado de Clerk
- ✅ Logs de debug en `src/supabaseClient.ts`

## 🔧 Configuración Requerida

### **1. Obtener Clave de Clerk**

1. Ve a [clerk.com](https://clerk.com)
2. Crea una cuenta o inicia sesión
3. Crea una nueva aplicación
4. Ve a **API Keys** en el dashboard
5. Copia la **Publishable Key**

### **2. Actualizar Variables de Entorno**

Actualiza tu archivo `.env` con:

```env
# Clerk - Autenticación
VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Supabase - Base de datos
VITE_SUPABASE_URL=https://wnevxdjytvbelknmtglf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZXZ4ZGp5dHZiZWxrbm10Z2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzQxMjksImV4cCI6MjA2NzcxMDEyOX0.akA0n6yo5CbgB71dOTZBIEsityuohWegUpTTwQXdDA0

# Google Maps (opcional)
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui
```

### **3. Configurar URLs de Redirección**

En tu dashboard de Clerk:

1. Ve a **User & Authentication** > **Email, Phone, Username**
2. En **Redirect URLs**, agrega:
   - `http://localhost:5177/signin`
   - `http://localhost:5177/signup`
   - `http://localhost:5177/`

## 🚀 Pasos para Probar

1. **Actualiza tu archivo `.env`** con la clave de Clerk
2. **Reinicia el servidor:**
   ```bash
   npm run dev
   ```
3. **Ve a:** `http://localhost:5177`
4. **Revisa el dashboard** - Verás el componente "Debug Clerk"
5. **Haz clic en "Iniciar Sesión"** en el header
6. **Regístrate o inicia sesión** con Clerk

## 🔍 Verificación

Una vez configurado, deberías ver:

- ✅ **Debug Clerk:** Estado de carga y autenticación
- ✅ **Header:** Botón "Iniciar Sesión" o `UserButton` si estás autenticado
- ✅ **Páginas de auth:** Formularios de Clerk funcionando
- ✅ **Redirección:** Después del login, vuelves al dashboard

## 📱 URLs de Acceso

- **Dashboard:** `http://localhost:5177`
- **Iniciar Sesión:** `http://localhost:5177/signin`
- **Registrarse:** `http://localhost:5177/signup`
- **Propiedades:** `http://localhost:5177/properties`

## 🆘 Solución de Problemas

### **Si no aparece el formulario de login:**
1. Verifica que la clave de Clerk esté en `.env`
2. Revisa la consola del navegador para errores
3. Asegúrate de que las URLs de redirección estén configuradas en Clerk

### **Si no se redirige después del login:**
1. Verifica las URLs de redirección en el dashboard de Clerk
2. Asegúrate de que `afterSignOutUrl="/signin"` esté configurado

### **Si hay errores de CORS:**
1. Verifica que estés usando `http://localhost:5177` (no 5173)
2. Asegúrate de que las URLs de redirección incluyan el puerto correcto

¡Una vez configurado, tendrás autenticación completa con Clerk! 🔐 
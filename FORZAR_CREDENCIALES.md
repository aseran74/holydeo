# 🚨 FORZAR ACTUALIZACIÓN DE CREDENCIALES

## **El problema:**
Tu aplicación sigue usando las credenciales del proyecto anterior. Necesitamos forzar la actualización.

## **Solución Paso a Paso:**

### **1. DETENER EL SERVIDOR**
```bash
Ctrl + C
```

### **2. VERIFICAR EL ARCHIVO .env**
Abre el archivo `.env` en la raíz del proyecto y asegúrate de que tenga EXACTAMENTE esto:

```env
VITE_SUPABASE_URL=https://wnevxdjytvbelknmtglf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZXZ4ZGp5dHZiZWxrbm10Z2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzQxMjksImV4cCI6MjA2NzcxMDEyOX0.akA0n6yo5CbgB71dOTZBIEsityuohWegUpTTwQXdDA0
VITE_CLERK_PUBLISHABLE_KEY=tu_clave_de_clerk_aqui
VITE_GOOGLE_MAPS_API_KEY=tu_clave_de_google_maps_aqui
```

### **3. LIMPIAR CACHE (OPCIONAL)**
```bash
npm run build
rm -rf dist
```

### **4. REINICIAR EL SERVIDOR**
```bash
npm run dev
```

### **5. VERIFICAR**
1. Ve a: `http://localhost:5174`
2. Busca el componente "Debug Detallado de Credenciales"
3. Debería mostrar:
   - ✅ URL CORRECTA
   - ✅ Clave configurada
   - ✅ CONEXIÓN EXITOSA

## **Si sigue fallando:**

### **Opción A: Crear nuevo archivo .env**
1. Elimina el archivo `.env` actual
2. Crea un nuevo archivo `.env` con el contenido de arriba
3. Reinicia el servidor

### **Opción B: Verificar en el navegador**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Busca los logs que dicen:
   - "Supabase URL:"
   - "Supabase Anon Key configured:"
   - "Supabase Anon Key length:"

### **Opción C: Forzar recarga**
1. Ctrl + Shift + R (recarga forzada)
2. O borrar cache del navegador

## **Verificación Final:**
Una vez que funcione, deberías ver:
- ✅ 20 propiedades en `/properties`
- ✅ Sin errores 401 (Unauthorized)
- ✅ Todos los componentes funcionando

---

**⚠️ IMPORTANTE:** Las credenciales del proyecto anterior `mhfegdmspiwnyinknlhm` NO funcionan. Solo las del proyecto activo `wnevxdjytvbelknmtglf` funcionan. 
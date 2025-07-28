# 🔧 Solución para Subida de Imágenes en Edición

## 🚨 Problema Identificado

El problema es que el componente `SimplePropertyForm` no tenía implementada la funcionalidad de subida de imágenes, mientras que `PropertyForm` sí la tenía. Además, es posible que el bucket de Storage en Supabase no esté configurado correctamente.

## ✅ Soluciones Implementadas

### 1. **Funcionalidad de Subida Agregada al SimplePropertyForm**

He agregado la funcionalidad completa de subida de imágenes al `SimplePropertyForm`:

- ✅ Estados para manejar imágenes (`imagePaths`, `uploading`)
- ✅ Función `handleImageUpload` para subir múltiples imágenes
- ✅ Función `handleRemoveImage` para eliminar imágenes
- ✅ Función `handleDrop` para drag and drop
- ✅ Interfaz de usuario con preview de imágenes
- ✅ Integración con Supabase Storage

### 2. **Script de Configuración de Storage**

He creado el archivo `storage_setup.sql` que contiene:

- ✅ Creación del bucket `property-images`
- ✅ Creación del bucket `profile-photos`
- ✅ Políticas de seguridad para usuarios autenticados
- ✅ Políticas de lectura pública para imágenes
- ✅ Límites de tamaño de archivo (50MB para propiedades, 10MB para perfiles)

### 3. **Componente de Prueba**

He creado `ImageUploadTest` para diagnosticar problemas:

- ✅ Prueba de acceso al bucket
- ✅ Subida de imágenes de prueba
- ✅ Información de debug detallada
- ✅ Manejo de errores

## 🚀 Pasos para Solucionar

### **Paso 1: Configurar Storage en Supabase**

1. Ve a tu dashboard de Supabase: [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega el contenido del archivo `storage_setup.sql`
5. Ejecuta el script

### **Paso 2: Verificar la Configuración**

1. Ve a **Storage** en tu dashboard de Supabase
2. Verifica que existan los buckets:
   - `property-images`
   - `profile-photos`
3. Verifica que las políticas estén configuradas

### **Paso 3: Probar la Funcionalidad**

1. Ve a tu aplicación: `http://localhost:5174`
2. Ve a la ruta de prueba: `http://localhost:5174/image-upload-test`
3. Prueba subir algunas imágenes
4. Verifica que aparezcan en la lista

### **Paso 4: Probar en el Formulario de Propiedades**

1. Ve a `/properties`
2. Haz clic en "Añadir Propiedad" o edita una existente
3. Busca la sección "Galería de fotos"
4. Prueba subir imágenes

## 🔍 Diagnóstico de Problemas

### **Si las imágenes no se suben:**

1. **Verifica las credenciales de Supabase:**
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

2. **Verifica que el bucket existe:**
   - Ve a Storage en Supabase
   - Busca el bucket `property-images`

3. **Verifica las políticas:**
   - Las políticas deben permitir INSERT para usuarios autenticados
   - Las políticas deben permitir SELECT para todos

4. **Revisa la consola del navegador:**
   - Busca errores relacionados con Storage
   - Verifica que las peticiones a Supabase funcionen

### **Errores Comunes:**

- **"Bucket not found"**: El bucket no existe, ejecuta el script SQL
- **"Policy violation"**: Las políticas no están configuradas correctamente
- **"Unauthorized"**: El usuario no está autenticado con Clerk
- **"File too large"**: El archivo excede el límite de 50MB

## 📋 Código Agregado

### **En SimplePropertyForm.tsx:**

```typescript
// Estados para imágenes
const [imagePaths, setImagePaths] = useState<string[]>(property?.image_paths || []);
const [uploading, setUploading] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

// Función de subida
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  // ... código de subida
};

// Función de eliminación
const handleRemoveImage = async (url: string) => {
  // ... código de eliminación
};

// Interfaz de usuario
<div className="mb-4">
  <label>Galería de fotos</label>
  <div className="border-dashed border-2 p-6">
    {/* ... interfaz de subida */}
  </div>
</div>
```

## 🎯 Resultado Esperado

Una vez implementadas estas soluciones:

- ✅ Los usuarios pueden subir imágenes al editar propiedades
- ✅ Las imágenes se almacenan en Supabase Storage
- ✅ Las imágenes se muestran en preview
- ✅ Los usuarios pueden eliminar imágenes
- ✅ La funcionalidad funciona tanto en creación como en edición

## 📞 Soporte Adicional

Si sigues teniendo problemas:

1. **Revisa los logs de la consola** del navegador
2. **Verifica la conexión a Supabase** en el componente de prueba
3. **Asegúrate de estar autenticado** con Clerk
4. **Verifica que las variables de entorno** estén configuradas correctamente

---

**Nota:** El componente de prueba estará disponible en `/image-upload-test` para diagnosticar cualquier problema con la subida de imágenes. 
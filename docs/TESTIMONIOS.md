# Sistema de Testimonios

## Descripción

Sistema completo para gestionar testimonios de clientes que se muestran en la landing page. Incluye:

- Componente de testimonios para la landing page
- Panel de administración completo (CRUD)
- Base de datos con Supabase
- Hook personalizado para gestión de estado
- Sistema de avatares con storage

## Características

### 🎯 **Funcionalidades Principales**
- **Landing Page**: Muestra 3 testimonios destacados con diseño moderno
- **Admin Dashboard**: Gestión completa de testimonios (crear, editar, eliminar)
- **Avatares**: Sistema de imágenes de perfil para clientes
- **Calificaciones**: Sistema de estrellas de 1 a 5
- **Responsive**: Diseño adaptativo para móvil y escritorio

### 🎨 **Diseño Visual**
- **Cards modernas** con efectos hover y sombras
- **Gradientes** y colores atractivos
- **Iconos** de Lucide React
- **Animaciones** suaves y transiciones
- **Modo oscuro** compatible

## Estructura de Archivos

```
src/
├── components/
│   └── landing/
│       └── TestimonialsSection.tsx    # Componente para landing page
├── pages/
│   └── Admin/
│       └── Testimonials.tsx           # Panel de administración
├── hooks/
│   └── useTestimonials.ts             # Hook personalizado
└── supabase/
    └── migrations/
        └── 003_create_testimonials_table.sql  # Migración SQL
```

## Instalación y Configuración

### 1. **Ejecutar Migración SQL**

```sql
-- Ejecutar en Supabase SQL Editor
-- Archivo: src/supabase/migrations/003_create_testimonials_table.sql
```

### 2. **Configurar Storage Bucket**

El bucket `avatars` se crea automáticamente con la migración, pero asegúrate de que las políticas RLS estén configuradas correctamente.

### 3. **Importar Componentes**

```tsx
// En la landing page
import TestimonialsSection from '../components/landing/TestimonialsSection';

// En el admin dashboard
import Testimonials from '../pages/Admin/Testimonials';
```

## Uso

### **Landing Page**

```tsx
import TestimonialsSection from '../components/landing/TestimonialsSection';

const LandingPage = () => {
  return (
    <div>
      {/* Otros componentes */}
      <TestimonialsSection />
      {/* Más componentes */}
    </div>
  );
};
```

### **Admin Dashboard**

```tsx
import Testimonials from '../pages/Admin/Testimonials';

// Agregar a las rutas del admin
<Route path="/admin/testimonials" element={<Testimonials />} />
```

### **Hook Personalizado**

```tsx
import { useTestimonials } from '../hooks/useTestimonials';

const MyComponent = () => {
  const { 
    testimonials, 
    loading, 
    createTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
  } = useTestimonials();

  // Usar las funciones según necesites
};
```

## Estructura de Datos

### **Tabla `testimonials`**

```sql
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,           -- Nombre del cliente
  role VARCHAR(255) NOT NULL,           -- Rol/ocupación del cliente
  content TEXT NOT NULL,                -- Contenido del testimonio
  rating INTEGER NOT NULL,              -- Calificación (1-5 estrellas)
  avatar TEXT,                          -- URL del avatar (opcional)
  location VARCHAR(255),                -- Ubicación del cliente
  created_at TIMESTAMP WITH TIME ZONE,  -- Fecha de creación
  updated_at TIMESTAMP WITH TIME ZONE   -- Fecha de última actualización
);
```

### **Bucket `avatars`**

- **Nombre**: `avatars`
- **Público**: Sí
- **Políticas**: Solo usuarios autenticados pueden subir
- **Estructura**: `testimonials/{timestamp}_{filename}`

## Funcionalidades del Admin

### **Crear Testimonio**
- Formulario completo con validación
- Subida de avatar opcional
- Sistema de calificación visual
- Campos requeridos marcados

### **Editar Testimonio**
- Carga datos existentes
- Permite modificar todos los campos
- Actualiza avatar si es necesario
- Mantiene historial de cambios

### **Eliminar Testimonio**
- Confirmación antes de eliminar
- Eliminación permanente
- Actualización automática de la lista

### **Gestión de Avatares**
- Subida de imágenes
- Preview en tiempo real
- Validación de tipos de archivo
- Almacenamiento en Supabase Storage

## Personalización

### **Estilos CSS**

Los estilos están basados en Tailwind CSS y se pueden personalizar fácilmente:

```tsx
// Cambiar colores del tema
className="bg-blue-600 hover:bg-blue-700"

// Modificar espaciado
className="py-20" // Cambiar padding vertical

// Ajustar grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### **Datos por Defecto**

Los testimonios por defecto se pueden modificar en `TestimonialsSection.tsx`:

```tsx
const defaultTestimonials: Testimonial[] = [
  // Modificar aquí los testimonios iniciales
];
```

## Seguridad

### **Políticas RLS (Row Level Security)**

- **SELECT**: Acceso público para lectura
- **INSERT**: Solo usuarios autenticados
- **UPDATE**: Solo usuarios autenticados
- **DELETE**: Solo usuarios autenticados

### **Validación de Datos**

- Campos requeridos marcados
- Validación de calificación (1-5)
- Sanitización de contenido
- Validación de tipos de archivo

## Rendimiento

### **Optimizaciones Implementadas**

- **Índices** en campos de búsqueda frecuente
- **Lazy loading** de imágenes
- **Paginación** implícita (máximo 3 en landing)
- **Caché** del hook personalizado

### **Monitoreo**

- Logs de errores en consola
- Toast notifications para feedback
- Estados de loading para UX
- Manejo de errores robusto

## Mantenimiento

### **Tareas Regulares**

1. **Revisar testimonios** mensualmente
2. **Actualizar avatares** cuando sea necesario
3. **Monitorear storage** de imágenes
4. **Verificar políticas** de seguridad

### **Backup**

- Los testimonios se almacenan en Supabase
- Backup automático configurado
- Exportación manual disponible vía SQL

## Troubleshooting

### **Problemas Comunes**

#### **Avatar no se sube**
- Verificar permisos del bucket `avatars`
- Comprobar políticas RLS
- Revisar tamaño del archivo

#### **Testimonios no se cargan**
- Verificar conexión a Supabase
- Comprobar políticas de la tabla
- Revisar logs de consola

#### **Errores de validación**
- Verificar campos requeridos
- Comprobar formato de calificación
- Validar tipos de datos

### **Logs y Debugging**

```tsx
// Habilitar logs detallados
console.log('Testimonials:', testimonials);
console.log('Loading state:', loading);
console.log('Error state:', error);
```

## Contribución

### **Mejoras Sugeridas**

1. **Filtros** por calificación o fecha
2. **Búsqueda** de testimonios
3. **Categorías** de testimonios
4. **Moderación** de contenido
5. **Analytics** de engagement

### **Estándares de Código**

- **TypeScript** estricto
- **Hooks** personalizados
- **Componentes** funcionales
- **Tailwind CSS** para estilos
- **Supabase** para backend

## Licencia

Este sistema es parte del proyecto principal y sigue las mismas condiciones de licencia.

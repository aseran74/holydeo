# TailGrids Date Range Picker

## 📋 Descripción

Componente de selección de fechas inspirado en el diseño elegante de TailGrids, implementado con React, TypeScript y Tailwind CSS.

## ✨ Características

### 🎨 Diseño Moderno
- **Inspirado en TailGrids**: Diseño limpio y profesional
- **Animaciones suaves**: Transiciones fluidas entre estados
- **Modo oscuro**: Soporte completo para tema oscuro
- **Responsive**: Adaptable a diferentes dispositivos

### 📅 Funcionalidad Avanzada
- **Selección de rango**: Click para seleccionar fecha de inicio y fin
- **Validación inteligente**: Previene selección de fechas pasadas
- **Navegación de meses**: Botones para navegar entre meses
- **Visualización clara**: Rango seleccionado destacado visualmente

### 🎯 Experiencia de Usuario
- **Botones de acción**: Aplicar/Cancelar para confirmar selección
- **Limpieza rápida**: Botón X para limpiar fechas seleccionadas
- **Cierre automático**: Se cierra al hacer clic fuera del componente
- **Formato español**: Fechas en formato DD/MM/YYYY

## 🚀 Instalación

El componente ya está integrado en el proyecto. No requiere dependencias adicionales.

## 📖 Uso

### Importación

```typescript
import TailGridsDateRangePicker from './components/common/TailGridsDateRangePicker';
```

### Uso Básico

```typescript
import React, { useState } from 'react';
import TailGridsDateRangePicker from './components/common/TailGridsDateRangePicker';

const MyComponent = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  return (
    <TailGridsDateRangePicker
      checkIn={checkIn}
      checkOut={checkOut}
      onCheckInChange={setCheckIn}
      onCheckOutChange={setCheckOut}
      placeholder="Seleccionar fechas"
      variant="hero"
    />
  );
};
```

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `checkIn` | `string` | ✅ | Fecha de llegada en formato YYYY-MM-DD |
| `checkOut` | `string` | ✅ | Fecha de salida en formato YYYY-MM-DD |
| `onCheckInChange` | `(date: string) => void` | ✅ | Callback para cambio de fecha de llegada |
| `onCheckOutChange` | `(date: string) => void` | ✅ | Callback para cambio de fecha de salida |
| `placeholder` | `string` | ❌ | Texto placeholder (default: "Seleccionar fechas") |
| `className` | `string` | ❌ | Clases CSS adicionales |
| `variant` | `'hero' \| 'search'` | ❌ | Variante de estilo (default: 'hero') |

## 🎨 Variantes

### Hero Variant
```typescript
<TailGridsDateRangePicker
  variant="hero"
  // ... otras props
/>
```
- Fondo con blur y transparencia
- Ideal para landing pages
- Diseño más prominente

### Search Variant
```typescript
<TailGridsDateRangePicker
  variant="search"
  // ... otras props
/>
```
- Fondo sólido
- Ideal para formularios de búsqueda
- Diseño más compacto

## 🔧 Implementación en el Proyecto

### Landing Page
El componente está integrado en `DateSearchForm` para la landing page:

```typescript
// src/components/common/DateSearchForm.tsx
import TailGridsDateRangePicker from './TailGridsDateRangePicker';

// Uso en el formulario
<TailGridsDateRangePicker
  checkIn={searchData.checkIn}
  checkOut={searchData.checkOut}
  onCheckInChange={(date) => setSearchData(prev => ({ ...prev, checkIn: date }))}
  onCheckOutChange={(date) => setSearchData(prev => ({ ...prev, checkOut: date }))}
  placeholder="Seleccionar fechas"
  variant={variant}
/>
```

### Search Page
También está integrado en `EnhancedSearchFilters` para la página de búsqueda:

```typescript
// src/components/common/EnhancedSearchFilters.tsx
import TailGridsDateRangePicker from './TailGridsDateRangePicker';

// Uso en los filtros
<TailGridsDateRangePicker
  checkIn={searchData.checkIn}
  checkOut={searchData.checkOut}
  onCheckInChange={(date) => setSearchData(prev => ({ ...prev, checkIn: date }))}
  onCheckOutChange={(date) => setSearchData(prev => ({ ...prev, checkOut: date }))}
  placeholder="Seleccionar fechas"
  variant="search"
  className="w-full"
/>
```

## 🎯 Características Técnicas

### Validación
- **Fechas pasadas**: No se pueden seleccionar fechas anteriores a hoy
- **Rango válido**: La fecha de salida debe ser posterior a la de llegada
- **Auto-corrección**: Si se selecciona una fecha de salida anterior a la de llegada, se intercambian automáticamente

### Accesibilidad
- **Navegación por teclado**: Soporte completo para navegación con teclado
- **Lectores de pantalla**: Compatible con tecnologías de asistencia
- **ARIA labels**: Etiquetas apropiadas para accesibilidad

### Rendimiento
- **Renderizado optimizado**: Solo se re-renderiza cuando es necesario
- **Event listeners**: Limpieza automática de event listeners
- **Memoización**: Uso eficiente de React hooks

## 🎨 Personalización

### Colores
Los colores se pueden personalizar modificando las clases de Tailwind:

```typescript
// Para cambiar el color principal
className="bg-blue-500" // Cambiar a otro color
```

### Tamaños
El componente es responsive y se adapta automáticamente:

```typescript
// Para cambiar el tamaño del input
className="py-3" // Ajustar padding vertical
```

## 📱 Responsive Design

El componente se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Calendario completo con navegación de meses
- **Tablet**: Calendario optimizado para pantallas medianas
- **Mobile**: Calendario compacto con navegación táctil

## 🌙 Modo Oscuro

Soporte completo para modo oscuro con clases condicionales:

```typescript
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## 🧪 Testing

### Página de Demostración
Visita `/tailgrids-demo` para ver una demostración completa del componente.

### Casos de Uso
1. **Selección básica**: Click en fecha de inicio y fin
2. **Navegación**: Usar botones para cambiar de mes
3. **Limpieza**: Click en X para limpiar fechas
4. **Cancelar**: Click en "Cancelar" para descartar cambios
5. **Aplicar**: Click en "Aplicar" para confirmar selección

## 🔄 Migración desde MUI X

Si estás migrando desde el componente MUI X, el cambio es directo:

```typescript
// Antes (MUI X)
<EnhancedDateRangePicker
  checkIn={checkIn}
  checkOut={checkOut}
  onCheckInChange={setCheckIn}
  onCheckOutChange={setCheckOut}
/>

// Después (TailGrids)
<TailGridsDateRangePicker
  checkIn={checkIn}
  checkOut={checkOut}
  onCheckInChange={setCheckIn}
  onCheckOutChange={setCheckOut}
/>
```

## 📈 Ventajas sobre MUI X

1. **Sin dependencias externas**: No requiere MUI X ni dayjs
2. **Diseño personalizado**: Totalmente adaptado al proyecto
3. **Mejor rendimiento**: Menos overhead de librerías
4. **Control total**: Personalización completa del comportamiento
5. **Tamaño reducido**: Menor bundle size

## 🐛 Solución de Problemas

### Problema: El calendario no se abre
**Solución**: Verificar que el componente esté dentro de un contenedor con `position: relative`

### Problema: Las fechas no se actualizan
**Solución**: Asegurar que los callbacks `onCheckInChange` y `onCheckOutChange` estén correctamente implementados

### Problema: Estilos no se aplican
**Solución**: Verificar que Tailwind CSS esté correctamente configurado

## 📝 Changelog

### v1.0.0
- ✅ Implementación inicial del componente
- ✅ Soporte para modo oscuro
- ✅ Validación de fechas
- ✅ Integración con landing page y search page
- ✅ Documentación completa

## 🤝 Contribución

Para contribuir al componente:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Añade tests si es necesario
5. Envía un pull request

## 📄 Licencia

Este componente es parte del proyecto y sigue la misma licencia. 
# Configuración de Google Maps para Experiencias

## Pasos para configurar Google Maps:

### 1. Obtener API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Maps JavaScript API** y **Geocoding API**
4. Ve a **Credentials** y crea una nueva **API Key**
5. Restringe la API key a tu dominio por seguridad

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

### 3. Funcionalidades del Mapa

El componente `GoogleMap` incluye:

- ✅ **Geocodificación automática** de direcciones
- ✅ **Marcadores personalizados** con animación
- ✅ **Ventanas de información** interactivas
- ✅ **Controles de mapa** (zoom, street view, fullscreen)
- ✅ **Estilos personalizados** del mapa
- ✅ **Responsive design** para móviles
- ✅ **Manejo de errores** y estados de carga

### 4. Uso en Experiencias

```tsx
<GoogleMap 
  location="Madrid, España"
  height="h-96"
  zoom={15}
  showMarker={true}
  showInfoWindow={true}
/>
```

### 5. Propiedades del Componente

- `location`: Dirección o ubicación a mostrar
- `height`: Altura del mapa (clases de Tailwind)
- `zoom`: Nivel de zoom inicial (1-20)
- `showMarker`: Mostrar marcador en la ubicación
- `showInfoWindow`: Mostrar ventana de información

### 6. Seguridad

- ✅ La API key se usa solo en el cliente
- ✅ Restringe la API key a tu dominio
- ✅ No expongas la API key en repositorios públicos

### 7. Costos

- **Maps JavaScript API**: $7 por 1000 cargas
- **Geocoding API**: $5 por 1000 solicitudes
- **Uso gratuito**: 200$ de crédito mensual

### 8. Alternativas

Si prefieres no usar Google Maps, puedes:

1. Usar **OpenStreetMap** (gratuito)
2. Usar **Mapbox** (alternativa popular)
3. Mantener el componente `SimpleMap` actual

## Nota Importante

**NO subas tu API key real a Git**. Solo usa el archivo `.env.local` que está en `.gitignore`.

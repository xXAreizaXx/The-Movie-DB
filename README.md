# 📱 Flixora — The Movie DB

Aplicación móvil de exploración de películas construida con **React Native + Expo**, consumiendo la API de [The Movie Database (TMDB)](https://www.themoviedb.org/).

---

## 📋 Requisitos previos

| Herramienta | Versión mínima                             |
| ----------- | ------------------------------------------ |
| Node.js     | 20.x                                       |
| npm         | 10.x                                       |
| Expo CLI    | SDK 54                                     |
| iOS         | Simulator o dispositivo físico con Expo Go |
| Android     | Emulador o dispositivo físico con Expo Go  |

---

## 🚀 Cómo ejecutar la aplicación

### 1. Clonar el repositorio

```bash
git clone https://github.com/<tu-usuario>/the-movie-db.git
cd the-movie-db
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y agrega tu Bearer Token de TMDB:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```
EXPO_PUBLIC_API_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_IMAGE_URL=https://image.tmdb.org/t/p
EXPO_PUBLIC_API_KEY=tu_bearer_token_de_tmdb
```

> Obtén tu token gratuito en [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### 4. Iniciar el servidor de desarrollo

```bash
npx expo start
```

### 5. Ejecutar en plataforma

```bash
# iOS
npm run ios

# Android
npm run android
```

---

## 🧱 Arquitectura

El proyecto sigue los principios de **Clean Architecture** con estructura basada en features:

```
src/
├── core/                        # Infraestructura base
│   ├── config/                  # Variables de entorno (ENV)
│   ├── network/                 # Cliente HTTP (Axios)
│   └── theme/                   # Tokens de color y tema (dark/light)
├── features/                    # Módulos de funcionalidad
│   └── movies/
│       ├── data/                # Capa de datos
│       │   ├── datasources/     # API remota + esquemas Zod
│       │   ├── mappers/         # DTO → Entidad
│       │   └── repositories/    # Implementación de repositorios
│       ├── domain/              # Capa de dominio
│       │   ├── entities/        # Interfaces (Movie, MovieDetail, CastMember, etc.)
│       │   ├── repositories/    # Contratos de repositorio
│       │   └── useCases/        # Casos de uso (getPopular, search, filterByLetter, etc.)
│       ├── di/                  # Inyección de dependencias (container)
│       └── presentation/        # Capa de presentación
│           ├── components/      # MovieCard, MovieListItem, CastCard
│           ├── hooks/           # usePopularMovies, useSearchMovies, useFilterMoviesByLetter, etc.
│           ├── screens/         # HomeScreen, SearchScreen, WatchlistScreen, MovieDetailScreen
│           └── store/           # Zustand store (watchlist)
├── infrastructure/              # Navegación y providers
│   ├── navigation/              # React Navigation (Stack + Tabs)
│   └── providers/               # QueryProvider (TanStack Query + persist)
└── shared/                      # Código compartido
    ├── components/              # OfflineBanner
    ├── hooks/                   # useDebounce, useOnlineStatus, useNotificationNavigation
    └── services/                # watchlistReminder (notificaciones inteligentes)
```

**Flujo de datos:** `API → Datasource (Zod) → Mapper → Repository → UseCase → Hook (TanStack Query) → Screen`

---

## 🚀 Stack tecnológico

| Categoría         | Tecnología                                    |
| ----------------- | --------------------------------------------- |
| Framework         | React Native + Expo (SDK 54)                  |
| Lenguaje          | TypeScript (strict mode)                      |
| Navegación        | React Navigation (native stack + bottom tabs) |
| Estado local      | Zustand + AsyncStorage persist                |
| Estado servidor   | TanStack Query + AsyncStorage persist         |
| HTTP              | Axios                                         |
| Validación        | Zod                                           |
| Imágenes          | Expo Image                                    |
| Notificaciones    | expo-notifications                            |
| Conectividad      | @react-native-community/netinfo               |
| Estilos           | NativeWind (TailwindCSS)                      |
| Calidad de código | ESLint + Prettier + Husky + lint-staged       |

---

## ✅ Funcionalidades implementadas

### 🏠 Pantalla principal (Home)

- Lista de películas populares y mejor valoradas obtenidas desde la API
- **Infinite scroll** para cargar más resultados al desplazarse
- Muestra título e imagen de portada
- Scroll fluido con `expo-image` (carga optimizada y transiciones)
- Rating badge y bookmark toggle directamente en cada card

### 🎬 Pantalla de detalles (MovieDetail)

- Información completa: título, portada, backdrop, géneros, elenco, descripción
- Carrusel horizontal de cast con fotos de perfil
- Datos adicionales: duración, presupuesto, recaudación, productoras
- Botón inline y FAB para agregar/quitar de la watchlist

### 🔍 Pantalla de búsqueda (Search)

- **Modo Buscar**: búsqueda por texto libre con resultados paginados (infinite scroll)
- **Modo Filtro por letra**: filtro avanzado con las siguientes condiciones:
  - El título debe comenzar con la letra ingresada (case-insensitive)
  - La película debe tener **≥3 géneros**
  - Debe tener **≥3 actrices** (`gender === 1`) y **≥3 actores** (`gender === 2`) en su cast principal
- Selector de modo (pills) para alternar entre búsqueda y filtro
- Grid de tendencias cuando no hay búsqueda activa
- Deduplicación de resultados para evitar keys duplicadas

### 📌 Gestión de Watchlist (Favoritos)

- Agregar/quitar películas desde cualquier card, lista o detalle
- **Zustand** con persistencia en **AsyncStorage**
- Pantalla dedicada de watchlist con botón de eliminar + confirmación
- Badge visual de bookmark en MovieCard y MovieListItem
- Botón para vaciar la lista completa

### 🌐 Soporte Offline

- **TanStack Query Persist** con AsyncStorage (cache de 24h)
- `onlineManager` sincronizado con **NetInfo** — TanStack Query pausa refetches automáticamente cuando no hay conexión
- **Banner visual rojo** en la parte superior: _"Sin conexión · Mostrando datos guardados"_
- Navegación completamente funcional en modo offline
- Watchlist disponible offline (Zustand + AsyncStorage)

### 🔔 Recordatorio inteligente de Watchlist

- Notificación local **3 minutos** después de agregar una película: _"¿Listo para ver {título}?"_
- **Cancelación automática** si el usuario abre el detalle de esa película antes de los 3 minutos
- **Sin duplicados**: agregar/quitar/agregar rápidamente solo genera una notificación
- Al hacer **tap en la notificación**, navega directamente al detalle de la película
- Mensaje **dinámico** con el título real de la película

---

## 🔌 API — Endpoints utilizados

| Método | Endpoint              | Descripción               |
| ------ | --------------------- | ------------------------- |
| GET    | `/movie/popular`      | Películas populares       |
| GET    | `/movie/top_rated`    | Películas mejor valoradas |
| GET    | `/trending/movie/day` | Tendencias del día        |
| GET    | `/movie/{id}`         | Detalle de película       |
| GET    | `/search/movie`       | Búsqueda por texto        |

El detalle incluye `?append_to_response=credits` para obtener cast y crew en una sola petición.

**Imágenes:** `https://image.tmdb.org/t/p/{size}/{path}` (sizes: `w185`, `w500`, `w780`)

---

## 📐 Decisiones de diseño

| Decisión                            | Justificación                                                        |
| ----------------------------------- | -------------------------------------------------------------------- |
| Clean Architecture por features     | Testabilidad, separación de responsabilidades, escalabilidad         |
| Zustand sobre Redux                 | Boilerplate mínimo, TypeScript-first, ideal para estado de watchlist |
| TanStack Query para estado servidor | Caché built-in, paginación, persistencia offline                     |
| Zod para validación                 | Type-safety en runtime para respuestas de API                        |
| expo-notifications                  | Notificaciones locales cross-platform sin config nativa              |
| NetInfo + onlineManager             | Detección de red nativa, integración directa con TanStack Query      |
| AsyncStorage sobre MMKV             | Compatibilidad con Expo out-of-the-box                               |
| NativeWind                          | DX de TailwindCSS en React Native con menor bundle size              |

---

## 🧪 Calidad de código

- Principios **SOLID** aplicados en toda la arquitectura
- **TypeScript strict** mode habilitado
- Sin lógica de negocio en componentes de presentación
- Pre-commit hooks con **Husky + lint-staged**
- Validación de esquemas API con **Zod** (runtime type safety)

### Scripts disponibles

```bash
npm run lint          # Ejecutar ESLint
npm run lint:fix      # Corregir errores de ESLint automáticamente
npm run format        # Formatear con Prettier
npm run typecheck     # Verificar tipos TypeScript
npm run check:bundle  # Verificar que el bundle compila correctamente
```

---

## 📱 Navegación

```
RootNavigator (Stack)
├── Main (Bottom Tabs)
│   ├── Home       → Películas populares y top rated
│   ├── Search     → Búsqueda + Filtro por letra balanceado
│   └── Watchlist  → Lista de películas por ver
└── MovieDetail    → Detalle completo de película
```

La navegación es completamente funcional en modo offline utilizando datos cacheados.

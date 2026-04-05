# 📱 Flixora

Aplicación móvil de descubrimiento de películas construida con **React Native + Expo SDK 54**, consumiendo la API de [The Movie Database (TMDB)](https://www.themoviedb.org/). Implementa Clean Architecture, soporte offline, notificaciones inteligentes y un filtro avanzado por reparto balanceado.

---

## 📋 Requisitos

| Requisito               | Detalle                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| **Node.js**             | v20.x o superior                                                       |
| **npm**                 | v10.x o superior (incluido con Node 20)                                |
| **Expo CLI**            | Se instala automáticamente con `npx expo`                              |
| **Xcode**               | v16+ (solo macOS, necesario para iOS Simulator y builds nativos)       |
| **Android Studio**      | Con emulador configurado o dispositivo físico conectado vía USB/Wi-Fi  |
| **Watchman** (opcional) | Recomendado en macOS: `brew install watchman`                          |
| **Cuenta TMDB**         | Para obtener un Bearer Token (API Read Access Token) gratuito          |
| **EAS CLI** (opcional)  | `npm install -g eas-cli` — solo si deseas generar builds con EAS Build |

> **Nota:** La app usa **development builds** (no Expo Go) porque integra `expo-notifications`, que requiere código nativo. Los comandos `npm run ios` y `npm run android` generan el build nativo automáticamente la primera vez.

---

## 🚀 Cómo ejecutar la aplicación

### 1. Clonar el repositorio

```bash
git clone https://github.com/xXAreizaXx/The-Movie-DB.git
cd The-Movie-DB
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo con tu Bearer Token de TMDB:

```bash
cp .env.example .env
```

Contenido del archivo `.env`:

```env
EXPO_PUBLIC_API_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_IMAGE_URL=https://image.tmdb.org/t/p
EXPO_PUBLIC_API_KEY=tu_bearer_token_aqui
```

> **¿Cómo obtener el token?**
>
> 1. Crea una cuenta en [themoviedb.org](https://www.themoviedb.org/signup)
> 2. Ve a [Configuración > API](https://www.themoviedb.org/settings/api)
> 3. Copia el valor de **API Read Access Token (v4 auth)** — es el Bearer Token

### 4. Generar los directorios nativos (primera vez)

```bash
npx expo prebuild
```

### 5. Ejecutar la aplicación

```bash
# iOS (requiere macOS + Xcode)
npm run ios

# Android (requiere Android Studio + emulador o dispositivo)
npm run android
```

> Estos comandos compilan el código nativo y abren la app en el simulador/emulador. La primera ejecución tarda más porque genera el build completo. Las siguientes son incrementales y mucho más rápidas.

### 6. Ejecutar con Expo (modo desarrollo)

Si ya generaste el build nativo previamente:

```bash
npm run start
```

Luego presiona `i` (iOS) o `a` (Android) en la terminal para abrir la app.

---

## 🧱 Arquitectura

El proyecto sigue los principios de **Clean Architecture** con estructura basada en features:

```
src/
├── core/                        # Infraestructura base
│   ├── config/                  # Variables de entorno (env.ts)
│   ├── network/                 # Cliente HTTP (Axios + interceptores)
│   └── theme/                   # Tokens de color y tema (dark/light)
├── features/                    # Módulos de funcionalidad
│   └── movies/
│       ├── data/                # Capa de datos
│       │   ├── datasources/     # API remota + esquemas Zod
│       │   ├── mappers/         # DTO → Entidad
│       │   └── repositories/    # Implementación de repositorios
│       ├── domain/              # Capa de dominio
│       │   ├── entities/        # Interfaces (Movie, MovieDetail, CastMember, etc.)
│       │   ├── repositories/    # Contratos de repositorio (interfaces)
│       │   └── useCases/        # Casos de uso (getPopular, search, filterByLetter)
│       ├── di/                  # Inyección de dependencias (container.ts)
│       └── presentation/        # Capa de presentación
│           ├── components/      # MovieCard, MovieListItem, CastCard, FeaturedBanner
│           ├── hooks/           # usePopularMovies, useSearchMovies, useFilterMoviesByLetter
│           ├── screens/         # HomeScreen, SearchScreen, WatchlistScreen, MovieDetailScreen
│           └── store/           # Zustand store (watchlistStore)
├── infrastructure/              # Navegación y providers
│   ├── navigation/              # React Navigation (Stack + Bottom Tabs)
│   └── providers/               # QueryProvider (TanStack Query + AsyncStorage persist)
└── shared/                      # Código compartido
    ├── components/              # OfflineBanner
    ├── hooks/                   # useDebounce, useOnlineStatus, useNotificationNavigation
    └── services/                # watchlistReminder (notificaciones inteligentes)
```

**Flujo de datos:**

```
TMDB API → Datasource (Zod validation) → Mapper (DTO → Entity) → Repository → UseCase → Hook (TanStack Query) → Screen
```

---

## � Stack tecnológico

| Categoría         | Tecnología                                    |
| ----------------- | --------------------------------------------- |
| Framework         | React Native 0.81 + Expo SDK 54               |
| Lenguaje          | TypeScript (strict mode)                      |
| Navegación        | React Navigation (native stack + bottom tabs) |
| Estado local      | Zustand + AsyncStorage persist                |
| Estado servidor   | TanStack Query v5 + AsyncStorage persist      |
| HTTP              | Axios                                         |
| Validación        | Zod v4                                        |
| Imágenes          | Expo Image                                    |
| Notificaciones    | expo-notifications                            |
| Conectividad      | @react-native-community/netinfo               |
| Estilos           | NativeWind (TailwindCSS)                      |
| Calidad de código | ESLint + Prettier + Husky + lint-staged       |

---

## ✅ Funcionalidades implementadas

### 🏠 Pantalla principal (Home)

- Listas horizontales de películas: **Tendencias**, **Populares** y **Mejor Valoradas**
- **Infinite scroll** horizontal para cargar más películas al desplazarse
- Banner destacado con la película trending del día
- Rating badge y bookmark toggle directamente en cada card
- Pull-to-refresh para actualizar datos

### 🎬 Pantalla de detalles (MovieDetail)

- Información completa: título, portada, backdrop, sinopsis, géneros, elenco
- Carrusel horizontal de cast con fotos de perfil y nombre del personaje
- Datos adicionales: duración, presupuesto, recaudación, productoras
- Botón inline y FAB flotante para agregar/quitar de la watchlist

### 🔍 Pantalla de búsqueda (Search)

- **Modo Buscar**: búsqueda por texto libre con resultados paginados (infinite scroll)
- **Modo Filtro por letra**: filtro avanzado que cumple **todas** las siguientes condiciones simultáneamente:
  1. El título de la película comienza con la letra ingresada (case-insensitive)
  2. La película tiene **al menos 3 géneros**
  3. El reparto principal tiene **al menos 3 mujeres** (`gender === 1`)
  4. El reparto principal tiene **al menos 3 hombres** (`gender === 2`)
- Busca en múltiples páginas de TMDB (hasta 5) para maximizar resultados
- Selector de modo (pills) para alternar entre búsqueda y filtro
- Grid de tendencias cuando no hay búsqueda activa

### 📌 Gestión de Watchlist (Favoritos)

- Agregar/quitar películas desde cualquier card, lista o pantalla de detalle
- Persistencia con **Zustand + AsyncStorage** (sobrevive cierres de app)
- Pantalla dedicada de watchlist con botón de eliminar + confirmación (Alert)
- Badge visual de bookmark en MovieCard y MovieListItem
- Botón para vaciar la lista completa

### 🌐 Soporte Offline

- **TanStack Query Persist** con AsyncStorage para caché de respuestas API (24h)
- `onlineManager` sincronizado con **NetInfo** — TanStack Query pausa refetches automáticamente sin conexión
- **Banner visual** fijo en la parte superior: _"Sin conexión · Mostrando datos guardados"_
- Navegación completamente funcional en modo offline con datos cacheados
- Watchlist disponible offline (Zustand + AsyncStorage)

### 🔔 Recordatorio inteligente de Watchlist

- Notificación local **3 minutos** después de agregar una película a la watchlist
- Mensaje: _"🎬 Watchlist — ¿Listo para ver {título}?"_
- **Cancelación automática** si el usuario abre el detalle de esa película antes de los 3 minutos
- **Sin duplicados**: agregar/quitar/agregar rápidamente solo genera una notificación activa
- Al hacer **tap en la notificación**, navega directamente a la pantalla de detalle de la película (deep link)
- Solicita **permisos de notificación** al usuario automáticamente la primera vez
- Canal de notificación dedicado en Android (`watchlist`)

---

## 🔌 API — Endpoints utilizados

| Método | Endpoint              | Descripción                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/movie/popular`      | Películas populares (paginado) |
| GET    | `/movie/top_rated`    | Mejor valoradas (paginado)     |
| GET    | `/trending/movie/day` | Tendencias del día (paginado)  |
| GET    | `/movie/{id}`         | Detalle completo de película   |
| GET    | `/search/movie`       | Búsqueda por texto (paginado)  |

- El detalle usa `?append_to_response=credits` para obtener cast y crew en una sola petición.
- Todas las respuestas se validan con **Zod** antes de ser procesadas.
- **Imágenes:** `https://image.tmdb.org/t/p/{size}/{path}` (sizes: `w185`, `w500`, `w780`)

---

## 📐 Decisiones de diseño

| Decisión                            | Justificación                                                         |
| ----------------------------------- | --------------------------------------------------------------------- |
| Clean Architecture por features     | Testabilidad, separación de responsabilidades, escalabilidad          |
| Zustand sobre Redux                 | Boilerplate mínimo, TypeScript-first, ideal para estado de watchlist  |
| TanStack Query para estado servidor | Caché built-in, paginación, persistencia offline                      |
| Zod para validación                 | Type-safety en runtime para respuestas de API                         |
| expo-notifications                  | Notificaciones locales cross-platform sin configuración nativa manual |
| NetInfo + onlineManager             | Detección de red nativa, integración directa con TanStack Query       |
| AsyncStorage sobre MMKV             | Compatibilidad nativa con Expo sin configuración extra                |
| NativeWind                          | Developer experience de TailwindCSS en React Native                   |
| Development builds sobre Expo Go    | Necesario para expo-notifications (código nativo)                     |

---

## 🧪 Calidad de código

- Principios **SOLID** aplicados en toda la arquitectura
- **TypeScript strict** mode habilitado
- Sin lógica de negocio en componentes de presentación
- Pre-commit hooks con **Husky + lint-staged** (lint + format automático)
- Validación de esquemas API con **Zod** (runtime type safety)
- Path aliases (`@core`, `@features`, `@infrastructure`, `@shared`) para imports limpios

### Scripts disponibles

```bash
npm run start         # Iniciar servidor de desarrollo Expo
npm run ios           # Compilar y ejecutar en iOS Simulator
npm run android       # Compilar y ejecutar en Android Emulator
npm run typecheck     # Verificar tipos TypeScript (tsc --noEmit)
npm run lint          # Ejecutar ESLint
npm run lint:fix      # Corregir errores de ESLint automáticamente
npm run format        # Formatear código con Prettier
npm run check:bundle  # Verificar que el bundle compila correctamente
npm run check:expo    # Verificar configuración de Expo (expo-doctor)
npm run precommit     # Ejecutar pre-commit hooks manualmente
npm run prepare       # Configurar Husky (se ejecuta en npm install)
```

---

## 📱 Navegación

```
RootNavigator (Native Stack)
├── Main (Bottom Tabs)
│   ├── Home       → Tendencias, Populares, Mejor Valoradas
│   ├── Search     → Búsqueda libre + Filtro por letra balanceado
│   └── Watchlist  → Lista de películas guardadas
└── MovieDetail    → Detalle completo (accesible desde cualquier pantalla + notificación)
```

La navegación es completamente funcional en modo offline utilizando datos cacheados.

---

## 📁 Variables de entorno

El proyecto utiliza el sistema de variables de entorno de Expo (`EXPO_PUBLIC_*`). Estas se cargan automáticamente al iniciar el servidor.

| Variable                | Descripción                          | Valor por defecto              |
| ----------------------- | ------------------------------------ | ------------------------------ |
| `EXPO_PUBLIC_API_URL`   | URL base de la API de TMDB           | `https://api.themoviedb.org/3` |
| `EXPO_PUBLIC_IMAGE_URL` | URL base para imágenes de TMDB       | `https://image.tmdb.org/t/p`   |
| `EXPO_PUBLIC_API_KEY`   | Bearer Token (API Read Access Token) | —                              |

El archivo `.env.example` incluido en el repositorio contiene la plantilla. Copia a `.env` y agrega tu token.

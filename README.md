# 📱 Flixora

A React Native movie discovery app built with Expo, powered by The Movie Database (TMDB) API.

## 🧱 Architecture

This project follows **Clean Architecture** principles with a feature-based structure:

```
src/
├── app/                  # App-level setup (navigation, providers)
│   ├── navigation/
│   └── providers/
├── core/                 # Core infrastructure
│   ├── config/           # Environment variables
│   ├── network/          # Axios API client
│   └── theme/            # Color palette & theme tokens
├── features/             # Feature modules
│   └── movies/
│       ├── data/         # Repositories & datasources
│       ├── domain/       # Entities & use cases
│       └── presentation/ # Hooks, components & screens
└── shared/               # Shared utilities, hooks & components
    ├── components/
    ├── hooks/
    └── utils/
```

Each feature follows the **domain → data → presentation** layer pattern with strict separation of concerns.

## 🚀 Tech Stack

| Category     | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | React Native + Expo (SDK 54)            |
| Language     | TypeScript (strict mode)                |
| Navigation   | React Navigation (native stack + tabs)  |
| State        | Zustand                                 |
| Server State | TanStack Query + persist                |
| HTTP         | Axios                                   |
| Storage      | AsyncStorage                            |
| Animations   | React Native Reanimated                 |
| Images       | Expo Image                              |
| Styling      | NativeWind (TailwindCSS)                |
| Validation   | Zod                                     |
| Code Quality | ESLint + Prettier + Husky + lint-staged |

## 📦 Setup

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🔌 API Configuration

This app uses the [TMDB API v3](https://developers.themoviedb.org/3).

1. Get a free API token at [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Add your Bearer token in `src/core/config/env.ts`

**Base URL:** `https://api.themoviedb.org/3`

**Endpoints used:**

- `GET /movie/popular` — Popular movies
- `GET /movie/top_rated` — Top rated movies
- `GET /trending/movie/day` — Trending today
- `GET /movie/{id}` — Movie detail
- `GET /search/movie` — Search movies

**Images:** `https://image.tmdb.org/t/p/w500/{poster_path}`

## 🌐 Offline Strategy

- **TanStack Query Persist** with AsyncStorage for caching API responses
- Cached data is available when the device is offline
- Stale-while-revalidate pattern for seamless UX

## 📐 Design Decisions (ADR)

| Decision                        | Rationale                                                          |
| ------------------------------- | ------------------------------------------------------------------ |
| NativeWind over Tamagui         | Better TailwindCSS DX, lower bundle size, simpler setup            |
| Zustand over Redux              | Minimal boilerplate, TypeScript-first, perfect for watchlist state |
| TanStack Query for server state | Built-in caching, pagination, offline persist support              |
| Clean Architecture              | Testability, separation of concerns, scalability                   |
| Zod for validation              | Runtime type safety for API responses                              |
| AsyncStorage over MMKV          | Expo compatibility out-of-the-box, sufficient for this use case    |

## 🧪 Code Quality

- **SOLID** principles applied throughout
- Strong typing with TypeScript strict mode
- No business logic in presentation components
- Pre-commit hooks via Husky + lint-staged

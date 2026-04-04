export const ENV = {
  TMDB_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: process.env.EXPO_PUBLIC_IMAGE_URL || 'https://image.tmdb.org/t/p',
  TMDB_API_TOKEN: process.env.EXPO_PUBLIC_API_KEY || '',
} as const;

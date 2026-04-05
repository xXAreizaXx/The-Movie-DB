import type { Movie } from '@features/movies/domain/entities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { watchlistReminder } from '@shared/services/watchlistReminder';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WatchlistState {
  movies: Movie[];
  add: (movie: Movie) => void;
  remove: (movieId: number) => void;
  toggle: (movie: Movie) => void;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      movies: [],

      add: (movie) =>
        set((state) => {
          if (state.movies.some((m) => m.id === movie.id)) return state;
          watchlistReminder.schedule(movie);
          return { movies: [movie, ...state.movies] };
        }),

      remove: (movieId) =>
        set((state) => {
          watchlistReminder.cancel(movieId);
          watchlistReminder.clearViewed(movieId);
          return { movies: state.movies.filter((m) => m.id !== movieId) };
        }),

      toggle: (movie) =>
        set((state) => {
          const exists = state.movies.some((m) => m.id === movie.id);
          if (exists) {
            watchlistReminder.cancel(movie.id);
            watchlistReminder.clearViewed(movie.id);
          } else {
            watchlistReminder.schedule(movie);
          }
          return {
            movies: exists
              ? state.movies.filter((m) => m.id !== movie.id)
              : [movie, ...state.movies],
          };
        }),

      clear: () => set({ movies: [] }),
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

import type { Movie } from '@features/movies/domain/entities';
import * as Notifications from 'expo-notifications';

const REMINDER_DELAY_SECONDS = 180; // 3 minutes

// Track scheduled notification identifiers by movieId
const scheduledMap = new Map<number, string>();

// Track movies the user has already opened (cancels pending reminder)
const viewedMovieIds = new Set<number>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const watchlistReminder = {
  /**
   * Schedule a reminder for a movie added to watchlist.
   * Cancels any existing reminder for that movie first (dedup).
   */
  async schedule(movie: Movie): Promise<void> {
    // Cancel previous if exists (handles add/remove/add quickly)
    await this.cancel(movie.id);

    // Don't schedule if user already viewed this movie
    if (viewedMovieIds.has(movie.id)) return;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎬 Watchlist',
        body: `¿Listo para ver ${movie.title}?`,
        data: { movieId: movie.id, title: movie.title },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: REMINDER_DELAY_SECONDS,
      },
    });

    scheduledMap.set(movie.id, identifier);
  },

  /**
   * Cancel a pending reminder for a movie.
   */
  async cancel(movieId: number): Promise<void> {
    const identifier = scheduledMap.get(movieId);
    if (identifier) {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      scheduledMap.delete(movieId);
    }
  },

  /**
   * Mark a movie as viewed — cancels any pending reminder.
   * Called when user opens MovieDetailScreen.
   */
  async markViewed(movieId: number): Promise<void> {
    viewedMovieIds.add(movieId);
    await this.cancel(movieId);
  },

  /**
   * Clear viewed status when a movie is removed from watchlist,
   * so it can be scheduled again if re-added later.
   */
  clearViewed(movieId: number): void {
    viewedMovieIds.delete(movieId);
  },
};

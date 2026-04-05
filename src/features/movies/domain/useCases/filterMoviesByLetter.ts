import type { MovieDetail } from '../entities';
import type { MovieRepository } from '../repositories';

export interface BalancedFilterResult {
  movie: MovieDetail;
}

/**
 * Filters movies by:
 * 1. Title starts with the given letter (case-insensitive)
 * 2. At least 3 genres
 * 3. At least 3 female cast members (gender === 1)
 * 4. At least 3 male cast members (gender === 2)
 *
 * Strategy: search TMDB by letter, then fetch detail for each result to check cast/genres.
 */
export const filterMoviesByLetter = (repository: MovieRepository) => {
  return async (letter: string, page: number): Promise<MovieDetail[]> => {
    const searchResult = await repository.searchMovies(letter, page);

    const candidates = searchResult.results.filter((m) =>
      m.title.toLowerCase().startsWith(letter.toLowerCase()),
    );

    const details = await Promise.allSettled(
      candidates.map((m) => repository.getMovieDetail(m.id)),
    );

    return details
      .filter((r): r is PromiseFulfilledResult<MovieDetail> => r.status === 'fulfilled')
      .map((r) => r.value)
      .filter((detail) => {
        const hasEnoughGenres = detail.genres.length >= 3;
        const femaleCount = detail.cast.filter((c) => c.gender === 1).length;
        const maleCount = detail.cast.filter((c) => c.gender === 2).length;
        return hasEnoughGenres && femaleCount >= 3 && maleCount >= 3;
      });
  };
};

import type { Movie, MovieDetail } from '../entities';
import type { MovieRepository } from '../repositories';

const MAX_PAGES = 5;
const BATCH_SIZE = 5;

/**
 * Filters movies by:
 * 1. Title starts with the given letter (case-insensitive)
 * 2. At least 3 genres
 * 3. At least 3 female cast members (gender === 1)
 * 4. At least 3 male cast members (gender === 2)
 *
 * Strategy: search TMDB by letter across multiple pages, deduplicate,
 * fetch detail for each candidate in batches, then apply all 4 conditions.
 */
export const filterMoviesByLetter = (repository: MovieRepository) => {
  return async (letter: string): Promise<MovieDetail[]> => {
    const letterLower = letter.toLowerCase();

    // 1. Collect candidates across multiple search pages
    const allCandidates: Movie[] = [];
    const seenIds = new Set<number>();

    for (let page = 1; page <= MAX_PAGES; page++) {
      const searchResult = await repository.searchMovies(letter, page);

      for (const m of searchResult.results) {
        if (!seenIds.has(m.id) && m.title.toLowerCase().startsWith(letterLower)) {
          seenIds.add(m.id);
          allCandidates.push(m);
        }
      }

      if (page >= searchResult.totalPages) break;
    }

    if (allCandidates.length === 0) return [];

    // 2. Fetch details in batches to avoid overwhelming the API
    const matched: MovieDetail[] = [];

    for (let i = 0; i < allCandidates.length; i += BATCH_SIZE) {
      const batch = allCandidates.slice(i, i + BATCH_SIZE);
      const details = await Promise.allSettled(batch.map((m) => repository.getMovieDetail(m.id)));

      for (const result of details) {
        if (result.status !== 'fulfilled') continue;
        const detail = result.value;

        // Condition 1: title starts with the letter (already filtered above)
        // Condition 2: at least 3 genres
        if (detail.genres.length < 3) continue;
        // Condition 3: at least 3 female cast (gender === 1)
        const femaleCount = detail.cast.filter((c) => c.gender === 1).length;
        if (femaleCount < 3) continue;
        // Condition 4: at least 3 male cast (gender === 2)
        const maleCount = detail.cast.filter((c) => c.gender === 2).length;
        if (maleCount < 3) continue;

        matched.push(detail);
      }
    }

    return matched;
  };
};

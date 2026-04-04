import type { Movie, PaginatedResult } from '../entities';
import type { MovieRepository } from '../repositories';

export const searchMovies = (repository: MovieRepository) => {
  return (query: string, page: number): Promise<PaginatedResult<Movie>> => {
    return repository.searchMovies(query, page);
  };
};

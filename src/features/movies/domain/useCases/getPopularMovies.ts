import type { Movie, PaginatedResult } from '../entities';
import type { MovieRepository } from '../repositories';

export const getPopularMovies = (repository: MovieRepository) => {
  return (page: number): Promise<PaginatedResult<Movie>> => {
    return repository.getPopularMovies(page);
  };
};

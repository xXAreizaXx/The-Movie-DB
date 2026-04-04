import type { Movie, PaginatedResult } from '../entities';
import type { MovieRepository } from '../repositories';

export const getTrendingMovies = (repository: MovieRepository) => {
  return (page: number): Promise<PaginatedResult<Movie>> => {
    return repository.getTrendingMovies(page);
  };
};

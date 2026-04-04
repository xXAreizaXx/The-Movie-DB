import type { Movie, PaginatedResult } from '../entities';
import type { MovieRepository } from '../repositories';

export const getTopRatedMovies = (repository: MovieRepository) => {
  return (page: number): Promise<PaginatedResult<Movie>> => {
    return repository.getTopRatedMovies(page);
  };
};

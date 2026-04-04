import type { MovieDetail } from '../entities';
import type { MovieRepository } from '../repositories';

export const getMovieDetail = (repository: MovieRepository) => {
  return (movieId: number): Promise<MovieDetail> => {
    return repository.getMovieDetail(movieId);
  };
};

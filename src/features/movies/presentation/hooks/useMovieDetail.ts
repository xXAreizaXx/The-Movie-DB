import { useQuery } from '@tanstack/react-query';
import { getMovieDetailUseCase } from '@features/movies/di/container';
import { movieKeys } from './queryKeys';

export const useMovieDetail = (movieId: number) => {
  return useQuery({
    queryKey: movieKeys.detail(movieId),
    queryFn: () => getMovieDetailUseCase(movieId),
    enabled: movieId > 0,
  });
};

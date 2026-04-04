import { useInfiniteQuery } from '@tanstack/react-query';
import { getPopularMoviesUseCase } from '@features/movies/di/container';
import { movieKeys } from './queryKeys';

export const usePopularMovies = () => {
  return useInfiniteQuery({
    queryKey: movieKeys.lists(),
    queryFn: ({ pageParam }) => getPopularMoviesUseCase(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};

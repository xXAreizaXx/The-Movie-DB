import { useInfiniteQuery } from '@tanstack/react-query';
import { getTrendingMoviesUseCase } from '@features/movies/di/container';
import { movieKeys } from './queryKeys';

export const useTrendingMovies = () => {
  return useInfiniteQuery({
    queryKey: [...movieKeys.lists(), 'trending'],
    queryFn: ({ pageParam }) => getTrendingMoviesUseCase(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};

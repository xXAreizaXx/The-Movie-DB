import { useInfiniteQuery } from '@tanstack/react-query';
import { searchMoviesUseCase } from '@features/movies/di/container';
import { movieKeys } from './queryKeys';

export const useSearchMovies = (query: string) => {
  return useInfiniteQuery({
    queryKey: [...movieKeys.all, 'search', query],
    queryFn: ({ pageParam }) => searchMoviesUseCase(query, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: query.trim().length > 0,
  });
};

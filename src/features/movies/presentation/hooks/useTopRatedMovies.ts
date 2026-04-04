import { useInfiniteQuery } from '@tanstack/react-query';
import { getTopRatedMoviesUseCase } from '@features/movies/di/container';
import { movieKeys } from './queryKeys';

export const useTopRatedMovies = () => {
  return useInfiniteQuery({
    queryKey: [...movieKeys.lists(), 'top-rated'],
    queryFn: ({ pageParam }) => getTopRatedMoviesUseCase(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
};

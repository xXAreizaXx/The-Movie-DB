import { useQuery } from '@tanstack/react-query';
import { filterMoviesByLetterUseCase } from '@features/movies/di/container';
import { movieKeys } from './queryKeys';

export const useFilterMoviesByLetter = (letter: string) => {
  return useQuery({
    queryKey: [...movieKeys.all, 'filter-letter', letter.toLowerCase()],
    queryFn: () => filterMoviesByLetterUseCase(letter, 1),
    enabled: letter.trim().length === 1,
    staleTime: 1000 * 60 * 10,
  });
};

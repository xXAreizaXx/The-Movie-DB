export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  popular: (page: number) => [...movieKeys.lists(), 'popular', page] as const,
  topRated: (page: number) => [...movieKeys.lists(), 'top-rated', page] as const,
  trending: (page: number) => [...movieKeys.lists(), 'trending', page] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
  search: (query: string, page: number) => [...movieKeys.all, 'search', query, page] as const,
};

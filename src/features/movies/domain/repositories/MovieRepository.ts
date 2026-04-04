import type { Movie, MovieDetail, PaginatedResult } from '../entities';

export interface MovieRepository {
  getPopularMovies(page: number): Promise<PaginatedResult<Movie>>;
  getTopRatedMovies(page: number): Promise<PaginatedResult<Movie>>;
  getTrendingMovies(page: number): Promise<PaginatedResult<Movie>>;
  getMovieDetail(movieId: number): Promise<MovieDetail>;
  searchMovies(query: string, page: number): Promise<PaginatedResult<Movie>>;
}

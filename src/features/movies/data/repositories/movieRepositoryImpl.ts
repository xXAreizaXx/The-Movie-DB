import type { Movie, MovieDetail, PaginatedResult } from '@features/movies/domain/entities';
import type { MovieRepository } from '@features/movies/domain/repositories';
import type { MovieRemoteDatasource } from '../datasources/movieRemoteDatasource';
import { movieMapper } from '../mappers/movieMapper';

export const createMovieRepository = (
  remoteDatasource: MovieRemoteDatasource,
): MovieRepository => ({
  async getPopularMovies(page: number): Promise<PaginatedResult<Movie>> {
    const dto = await remoteDatasource.getPopularMovies(page);
    return movieMapper.toPaginatedMovies(dto);
  },

  async getTopRatedMovies(page: number): Promise<PaginatedResult<Movie>> {
    const dto = await remoteDatasource.getTopRatedMovies(page);
    return movieMapper.toPaginatedMovies(dto);
  },

  async getTrendingMovies(page: number): Promise<PaginatedResult<Movie>> {
    const dto = await remoteDatasource.getTrendingMovies(page);
    return movieMapper.toPaginatedMovies(dto);
  },

  async getMovieDetail(movieId: number): Promise<MovieDetail> {
    const dto = await remoteDatasource.getMovieDetail(movieId);
    return movieMapper.toMovieDetail(dto);
  },

  async searchMovies(query: string, page: number): Promise<PaginatedResult<Movie>> {
    const dto = await remoteDatasource.searchMovies(query, page);
    return movieMapper.toPaginatedMovies(dto);
  },
});

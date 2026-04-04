import { movieRemoteDatasource } from '@features/movies/data/datasources';
import { createMovieRepository } from '@features/movies/data/repositories';
import type { MovieRepository } from '@features/movies/domain/repositories';
import {
  getMovieDetail,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  searchMovies,
} from '@features/movies/domain/useCases';

export const movieRepository: MovieRepository = createMovieRepository(movieRemoteDatasource);

export const getPopularMoviesUseCase = getPopularMovies(movieRepository);
export const getTopRatedMoviesUseCase = getTopRatedMovies(movieRepository);
export const getTrendingMoviesUseCase = getTrendingMovies(movieRepository);
export const getMovieDetailUseCase = getMovieDetail(movieRepository);
export const searchMoviesUseCase = searchMovies(movieRepository);

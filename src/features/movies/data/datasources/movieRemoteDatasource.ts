import { apiClient } from '@core/network/apiClient';
import {
  MovieDetailSchema,
  PaginatedResponseSchema,
  type MovieDetailDTO,
  type PaginatedResponseDTO,
} from './movieApi.schemas';

export interface MovieRemoteDatasource {
  getPopularMovies(page: number): Promise<PaginatedResponseDTO>;
  getTopRatedMovies(page: number): Promise<PaginatedResponseDTO>;
  getTrendingMovies(page: number): Promise<PaginatedResponseDTO>;
  getMovieDetail(movieId: number): Promise<MovieDetailDTO>;
  searchMovies(query: string, page: number): Promise<PaginatedResponseDTO>;
}

export const movieRemoteDatasource: MovieRemoteDatasource = {
  async getPopularMovies(page: number): Promise<PaginatedResponseDTO> {
    const response = await apiClient.get('/movie/popular', {
      params: { page },
    });
    return PaginatedResponseSchema.parse(response.data);
  },

  async getTopRatedMovies(page: number): Promise<PaginatedResponseDTO> {
    const response = await apiClient.get('/movie/top_rated', {
      params: { page },
    });
    return PaginatedResponseSchema.parse(response.data);
  },

  async getTrendingMovies(page: number): Promise<PaginatedResponseDTO> {
    const response = await apiClient.get('/trending/movie/day', {
      params: { page },
    });
    return PaginatedResponseSchema.parse(response.data);
  },

  async getMovieDetail(movieId: number): Promise<MovieDetailDTO> {
    const response = await apiClient.get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits' },
    });
    return MovieDetailSchema.parse(response.data);
  },

  async searchMovies(query: string, page: number): Promise<PaginatedResponseDTO> {
    const response = await apiClient.get('/search/movie', {
      params: { query, page },
    });
    return PaginatedResponseSchema.parse(response.data);
  },
};

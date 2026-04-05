import { ENV } from '@core/config/env';
import type {
  CastMember,
  CrewMember,
  Movie,
  MovieDetail,
  PaginatedResult,
  ProductionCompany,
} from '@features/movies/domain/entities';
import type {
  MovieDetailDTO,
  MovieListItemDTO,
  PaginatedResponseDTO,
} from '../datasources/movieApi.schemas';

const buildImageUrl = (path: string | null, size = 'w500'): string | null => {
  if (!path) return null;
  return `${ENV.TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const movieMapper = {
  toMovie(dto: MovieListItemDTO): Movie {
    return {
      id: dto.id,
      title: dto.title,
      overview: dto.overview,
      posterUrl: buildImageUrl(dto.poster_path),
      backdropUrl: buildImageUrl(dto.backdrop_path, 'w780'),
      releaseDate: dto.release_date,
      voteAverage: dto.vote_average,
      voteCount: dto.vote_count,
      genreIds: dto.genre_ids,
      popularity: dto.popularity,
      originalLanguage: dto.original_language,
    };
  },

  toPaginatedMovies(dto: PaginatedResponseDTO): PaginatedResult<Movie> {
    return {
      page: dto.page,
      totalPages: dto.total_pages,
      totalResults: dto.total_results,
      results: dto.results.map(movieMapper.toMovie),
    };
  },

  toMovieDetail(dto: MovieDetailDTO): MovieDetail {
    return {
      id: dto.id,
      title: dto.title,
      overview: dto.overview,
      posterUrl: buildImageUrl(dto.poster_path),
      backdropUrl: buildImageUrl(dto.backdrop_path, 'w780'),
      releaseDate: dto.release_date,
      voteAverage: dto.vote_average,
      voteCount: dto.vote_count,
      genres: dto.genres,
      runtime: dto.runtime,
      status: dto.status,
      tagline: dto.tagline,
      budget: dto.budget,
      revenue: dto.revenue,
      productionCompanies: dto.production_companies.map(
        (pc): ProductionCompany => ({
          id: pc.id,
          name: pc.name,
          logoUrl: buildImageUrl(pc.logo_path, 'w200'),
          originCountry: pc.origin_country,
        }),
      ),
      originalLanguage: dto.original_language,
      cast: (dto.credits?.cast ?? []).map(
        (c): CastMember => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profileUrl: buildImageUrl(c.profile_path, 'w185'),
          order: c.order,
          gender: c.gender,
        }),
      ),
      crew: (dto.credits?.crew ?? []).map(
        (c): CrewMember => ({
          id: c.id,
          name: c.name,
          job: c.job,
          department: c.department,
          profileUrl: buildImageUrl(c.profile_path, 'w185'),
        }),
      ),
    };
  },
};

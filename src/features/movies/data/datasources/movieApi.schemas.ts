import { z } from 'zod';

export const MovieListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  genre_ids: z.array(z.number()),
  popularity: z.number(),
  original_language: z.string(),
  adult: z.boolean(),
});

export const PaginatedResponseSchema = z.object({
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
  results: z.array(MovieListItemSchema),
});

export const GenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ProductionCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_path: z.string().nullable(),
  origin_country: z.string(),
});

export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
});

export const CrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
});

export const CreditsSchema = z.object({
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
});

export const MovieDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  genres: z.array(GenreSchema),
  runtime: z.number().nullable(),
  status: z.string(),
  tagline: z.string().nullable(),
  budget: z.number(),
  revenue: z.number(),
  production_companies: z.array(ProductionCompanySchema),
  original_language: z.string(),
  adult: z.boolean(),
  credits: CreditsSchema.optional(),
});

export type MovieListItemDTO = z.infer<typeof MovieListItemSchema>;
export type PaginatedResponseDTO = z.infer<typeof PaginatedResponseSchema>;
export type MovieDetailDTO = z.infer<typeof MovieDetailSchema>;
export type CastMemberDTO = z.infer<typeof CastMemberSchema>;
export type CrewMemberDTO = z.infer<typeof CrewMemberSchema>;
export type GenreDTO = z.infer<typeof GenreSchema>;

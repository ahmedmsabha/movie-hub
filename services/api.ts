import { ofetch } from "ofetch";

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMoviesInfiniteList = async ({
  query,
  page,
}: {
  query: string;
  page: number;
}) => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
        query
      )}&page=${page}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?page=${page}&sort_by=popularity.desc`;

  const response = await ofetch<MovieResponse>(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  return response.results;
};

export const fetchMovieById = async (movieId: string) => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`;
  try {
    const response = await ofetch<MovieDetails>(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    return response;
  } catch (error) {
    throw new Error(`Failed to fetch movie by id: ${error}`);
  }
};

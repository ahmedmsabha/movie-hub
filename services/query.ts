import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { fetchMovieById, fetchMoviesInfiniteList } from "./api";
import { getTrendingMovies } from "./appwrite";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "./storage";
import { queryClient } from "./queryClient";

export function useGetTrendingMovies() {
  return useQuery({
    queryKey: ["trending-movies"],
    queryFn: () => getTrendingMovies(),
  });
}

export function useMoviesInfiniteList({ query }: { query: string }) {
  return useInfiniteQuery({
    queryKey: ["movies-list", { query }],
    queryFn: ({ pageParam }) =>
      fetchMoviesInfiniteList({ query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
}

export function useMovieDetails(movieId: string) {
  return useQuery({
    queryKey: ["movie-details", { movieId }],
    queryFn: () => fetchMovieById(movieId),
    enabled: !!movieId,
  });
}

export function useBookmarkedMovies() {
  return useQuery({
    queryKey: ["bookmarked-movies"],
    queryFn: () => getBookmarks(),
    placeholderData: [], // Return empty array while loading
  });
}

export function useAddBookmark() {
  return useMutation({
    mutationFn: (movie: Movie) => addBookmark(movie),
    onSuccess: () => {
      // Invalidate bookmarks query to refresh the list
      return queryClient.invalidateQueries({ queryKey: ["bookmarked-movies"] });
    },
  });
}

export function useRemoveBookmark() {
  return useMutation({
    mutationFn: (movieId: string) => removeBookmark(movieId),
    onSuccess: () => {
      // Invalidate bookmarks query to refresh the list
      return queryClient.invalidateQueries({ queryKey: ["bookmarked-movies"] });
    },
  });
}

export function useIsBookmarked(movieId: string) {
  return useQuery({
    queryKey: ["is-bookmarked", movieId],
    queryFn: () => isBookmarked(movieId),
    enabled: !!movieId,
  });
}

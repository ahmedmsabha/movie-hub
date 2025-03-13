import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  useMovieDetails,
  useAddBookmark,
  useRemoveBookmark,
  useIsBookmarked,
} from "@/services/query";
import { icons } from "@/constants/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

function MovieInfo({ label, value }: MovieInfoProps) {
  return (
    <View className="flex-col items-center justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
}
export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const { data: movieDetails } = useMovieDetails(id as string);
  const [isToggling, setIsToggling] = useState(false);

  // Use the dedicated hook to check if movie is bookmarked
  const { data: isMovieBookmarked = false, refetch: refetchBookmarkStatus } =
    useIsBookmarked(id as string);

  const { mutate: addBookmark, isPending: isAddingBookmark } = useAddBookmark();
  const { mutate: removeBookmark, isPending: isRemovingBookmark } =
    useRemoveBookmark();

  const insets = useSafeAreaInsets();

  // Toggle bookmark function
  const handleToggleBookmark = () => {
    if (!movieDetails || isToggling) return;

    setIsToggling(true);

    if (isMovieBookmarked) {
      // Remove from bookmarks
      removeBookmark(id as string, {
        onSuccess: () => {
          refetchBookmarkStatus();
          setIsToggling(false);
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to remove bookmark");
          console.error("Error removing bookmark:", error);
          setIsToggling(false);
        },
      });
    } else {
      // Convert MovieDetails to the Movie format expected by addBookmark
      const movieForBookmark: Movie = {
        id: movieDetails.id,
        title: movieDetails.title,
        adult: movieDetails.adult,
        backdrop_path: movieDetails.backdrop_path || "",
        genre_ids: movieDetails.genres?.map((g) => g.id) || [],
        original_language: movieDetails.original_language,
        original_title: movieDetails.original_title,
        overview: movieDetails.overview || "",
        popularity: movieDetails.popularity,
        poster_path: movieDetails.poster_path || "",
        release_date: movieDetails.release_date,
        video: movieDetails.video,
        vote_average: movieDetails.vote_average,
        vote_count: movieDetails.vote_count,
      };

      // Add to bookmarks
      addBookmark(movieForBookmark, {
        onSuccess: () => {
          refetchBookmarkStatus();
          setIsToggling(false);
        },
        onError: (error) => {
          Alert.alert("Error", "Failed to add bookmark");
          console.error("Error adding bookmark:", error);
          setIsToggling(false);
        },
      });
    }
  };

  const isLoading = isAddingBookmark || isRemovingBookmark || isToggling;

  return (
    <View className="bg-primary flex-1" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="relative">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>

          {/* Back button */}
          <TouchableOpacity
            className="absolute top-5 left-5 bg-dark-100/80 rounded-full p-2"
            onPress={router.back}
          >
            <Image
              source={icons.arrow}
              className="size-5 rotate-180"
              tintColor="#fff"
            />
          </TouchableOpacity>

          {/* Bookmark button with animation/loading state */}
          <TouchableOpacity
            className={`absolute top-5 right-5 bg-dark-100/80 rounded-full p-2 ${
              isLoading ? "opacity-70" : "opacity-100"
            }`}
            onPress={handleToggleBookmark}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="size-5 items-center justify-center">
                <Text className="text-white text-xs">...</Text>
              </View>
            ) : (
              <Image
                source={icons.save}
                className="size-5"
                tintColor={isMovieBookmarked ? "#AB8BFF" : "#fff"}
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">
            {movieDetails?.title}
          </Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movieDetails?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">
              {movieDetails?.runtime}m
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movieDetails?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movieDetails?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movieDetails?.overview} />
          <MovieInfo
            label="Genres"
            value={
              movieDetails?.genres?.map((g) => g.name).join(" • ") || "N/A"
            }
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movieDetails?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movieDetails?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movieDetails?.production_companies
                ?.map((c) => c.name)
                .join(" • ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-darkAccent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

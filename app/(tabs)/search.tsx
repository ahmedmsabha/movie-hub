import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useMoviesInfiniteList } from "@/services/query";
import { images } from "@/constants/images";
import { MovieCard } from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { icons } from "@/constants/icons";
import { useDebounce } from "@/hooks/use-debounce";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const insets = useSafeAreaInsets();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500); // 500ms debounce delay

  const {
    data: moviesList,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useMoviesInfiniteList({ query: debouncedQuery });

  useEffect(() => {
    if (moviesList?.pages) {
      const newMovies = moviesList.pages.flatMap((page: any) => page);
      setAllMovies(newMovies);
    }
  }, [moviesList]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#030014",
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 70, // Extra padding for tab bar
      }}
    >
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="contain"
      />

      <FlatList
        data={allMovies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-2 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                autoFocus={true}
              />
            </View>

            {isLoading && <ActivityIndicator size="large" color="#AB8BFF" />}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!isLoading &&
              !error &&
              searchQuery.trim() &&
              allMovies.length > 0 && (
                <Text className="text-white text-xl font-bold mt-5 mb-3">
                  Search results for:{" "}
                  <Text className="text-darkAccent">{debouncedQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !isLoading && !error ? (
            <View className="mx-5 mt-10">
              <Text className="text-gray-500 text-center text-xl font-bold mt-5 mb-3">
                {searchQuery.trim() ? "No movies found" : "Search for a movie"}
              </Text>
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetching) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isFetching ? <ActivityIndicator size="small" color="#AB8BFF" /> : null
        }
      />
    </View>
  );
}

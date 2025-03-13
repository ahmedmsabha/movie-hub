import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "@/components/search-bar";
import { useGetTrendingMovies, useMoviesInfiniteList } from "@/services/query";
import { MovieCard } from "@/components/movie-card";
import React, { useState, useEffect } from "react";
import { TrendingCard } from "@/components/trending-card";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control

  const {
    data: trendingMovies,
    isLoading: isTrendingMoviesLoading,
    error: trendingMoviesError,
    refetch: refetchTrendingMovies,
  } = useGetTrendingMovies();

  const {
    data: moviesInfiniteList,
    isLoading,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch: refetchMoviesInfiniteList,
  } = useMoviesInfiniteList({ query: "" });

  useEffect(() => {
    if (moviesInfiniteList?.pages) {
      const newMovies = moviesInfiniteList.pages.flatMap((page) => page);
      setAllMovies(newMovies);
    }
  }, [moviesInfiniteList]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const { y } = contentOffset;
    const contentHeight = contentSize.height;
    const viewportHeight = layoutMeasurement.height;

    const distanceFromBottom = contentHeight - (y + viewportHeight);
    if (distanceFromBottom < 100 && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchTrendingMovies(), refetchMoviesInfiniteList()]);
    setRefreshing(false);
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 70, // Extra padding for tab bar
      }}
      className="flex-1 bg-primary"
    >
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="contain"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#AB8BFF"
            colors={["#AB8BFF"]}
            progressBackgroundColor="#000000"
          />
        }
      >
        <Image
          source={icons.logo}
          className="w-12 h-10 mx-auto mb-5"
          resizeMode="contain"
        />

        {isLoading || isTrendingMoviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : trendingMoviesError || error ? (
          <View className="mt-10 p-4 bg-red-900/50 rounded-lg">
            <Text className="text-white text-lg font-bold">
              Error Loading Movies
            </Text>
            <Text className="text-white mt-2">
              {error instanceof Error
                ? error.message
                : trendingMoviesError instanceof Error
                ? trendingMoviesError.message
                : "An error occurred"}
            </Text>
          </View>
        ) : (
          <View className="mt-5 flex-1">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}
            <>
              <Text className="text-white text-lg font-bold mt-5 mb-3">
                Latest Movies
              </Text>

              <FlatList
                data={allMovies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  marginBottom: 10,
                  paddingRight: 5,
                }}
                className="mt-2 pb-10"
                scrollEnabled={false}
                ListFooterComponent={() => (
                  <View className="my-4 w-full flex items-center justify-center">
                    {isFetching ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : hasNextPage ? (
                      <Text className="text-white text-center">
                        Scroll to load more...
                      </Text>
                    ) : (
                      <Text className="text-white text-center">
                        No more movies to load
                      </Text>
                    )}
                  </View>
                )}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

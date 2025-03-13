import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import React from "react";
import { BookmarkCard } from "@/components/bookmark-card";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBookmarkedMovies, useRemoveBookmark } from "@/services/query";

export default function Saved() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    data: bookmarks,
    isLoading,
    isError,
    error: bookmarkError,
    refetch,
  } = useBookmarkedMovies();

  const { mutate: removeBookmark } = useRemoveBookmark();

  const handleToggleBookmark = async (movieId: string) => {
    try {
      removeBookmark(movieId);
    } catch (error) {
      Alert.alert("Error", "Failed to remove bookmark");
      console.error("Error removing bookmark:", error);
    }
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

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-light-100 text-2xl font-bold">Bookmarks</Text>
          <Image
            source={icons.logo}
            className="w-10 h-8"
            resizeMode="contain"
          />
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center mt-20">
            <ActivityIndicator size="large" color="#AB8BFF" />
            <Text className="text-light-200 mt-4">
              Loading your bookmarks...
            </Text>
          </View>
        ) : isError ? (
          <View className="mt-10 p-4 bg-red-900/50 rounded-lg">
            <Text className="text-white text-lg font-bold">
              Error Loading Bookmarks
            </Text>
            <Text className="text-white mt-2">
              {bookmarkError instanceof Error
                ? bookmarkError.message
                : "An unknown error occurred"}
            </Text>
            <TouchableOpacity
              className="bg-darkAccent py-2 px-4 rounded-lg mt-4 self-start"
              onPress={() => refetch()}
            >
              <Text className="text-white font-bold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-2">
            <FlatList
              data={bookmarks}
              renderItem={({ item }: { item: StoredBookmark }) => (
                <BookmarkCard
                  movie={item}
                  isBookmarked={true}
                  onToggleBookmark={() => handleToggleBookmark(item.movie_id)}
                />
              )}
              keyExtractor={(item: StoredBookmark) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center mt-20">
                  <Image
                    source={icons.save}
                    className="w-16 h-16 opacity-30"
                    tintColor="#9CA4AB"
                  />
                  <Text className="text-light-100 text-lg font-bold mt-4">
                    No bookmarks yet
                  </Text>
                  <Text className="text-light-300 text-sm text-center mt-2 max-w-[250px]">
                    Save your favorite movies to watch them later
                  </Text>
                  <TouchableOpacity
                    className="bg-darkAccent py-3 px-8 rounded-full mt-6"
                    onPress={() => router.push("/")}
                  >
                    <Text className="text-white font-bold">Explore Movies</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

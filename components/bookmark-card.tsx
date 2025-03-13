import { icons } from "@/constants/icons";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

interface BookmarkCardProps {
  movie: StoredBookmark;
  isBookmarked: boolean;
  onToggleBookmark?: () => void;
}

export function BookmarkCard({
  movie,
  isBookmarked,
  onToggleBookmark,
}: BookmarkCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`mb-4 ${isPressed ? "opacity-80" : "opacity-100"}`}
    >
      <Link href={`/movies/${movie.movie_id}`} asChild>
        <TouchableOpacity>
          <LinearGradient
            colors={["rgba(43, 40, 70, 0.4)", "rgba(15, 13, 35, 0.9)"]}
            className="flex-row items-center p-3 rounded-xl overflow-hidden border border-dark-100"
          >
            <Image
              source={{
                uri: movie.poster_url,
              }}
              className="w-20 h-28 rounded-lg"
              resizeMode="cover"
            />

            <View className="flex-1 ml-4">
              <Text
                className="text-light-100 text-base font-bold mb-1"
                numberOfLines={2}
              >
                {movie.title}
              </Text>

              {movie.release_date && (
                <Text className="text-light-300 text-xs mb-2">
                  {movie.release_date.split("-")[0]}
                </Text>
              )}

              {movie.vote_average && (
                <View className="flex-row items-center mb-2">
                  <Image source={icons.star} className="w-4 h-4 mr-1" />
                  <Text className="text-light-200 text-xs">
                    {Math.round(movie.vote_average / 2)}/5
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              className="p-2 bg-dark-100 rounded-full"
              onPress={onToggleBookmark}
            >
              <Image
                source={icons.save}
                className="w-5 h-5"
                tintColor={isBookmarked ? "#AB8BFF" : "#9CA4AB"}
              />
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </Link>
    </Pressable>
  );
}

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Image, TextInput, View } from "react-native";
import { useState } from "react";

interface SearchBarProps {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}
export default function SearchBar({
  onPress,
  placeholder,
  value,
  onChangeText,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center rounded-full bg-dark-200 px-5 py-4">
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor={"#AB8BFF"}
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-white"
        placeholderTextColor={"#A8B5DB"}
        autoFocus={autoFocus}
      />
    </View>
  );
}

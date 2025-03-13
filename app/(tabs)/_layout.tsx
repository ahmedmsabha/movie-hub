import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

function CustomTabBarIcon({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: any;
  label: string;
}) {
  return (
    <>
      {focused ? (
        <ImageBackground
          source={images.highlight}
          className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 rounded-full justify-center items-center overflow-hidden"
        >
          <Image source={icon} className="size-5" tintColor={"#151312"} />
          <Text className="text-base ms-2 font-semibold text-secondary">
            {label}
          </Text>
        </ImageBackground>
      ) : (
        <View className="flex size-full justify-center items-center rounded-full mt-4">
          <Image source={icon} className="size-5" tintColor={"#A8B5DB"} />
        </View>
      )}
    </>
  );
}

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          },
          tabBarStyle: {
            backgroundColor: "#0f0D23",
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 36,
            height: 52,
            position: "absolute",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#0f0D23",
            zIndex: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <CustomTabBarIcon
                focused={focused}
                icon={icons.home}
                label="Home"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ focused }) => (
              <CustomTabBarIcon
                focused={focused}
                icon={icons.search}
                label="Search"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            tabBarIcon: ({ focused }) => (
              <CustomTabBarIcon
                focused={focused}
                icon={icons.save}
                label="Saved"
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

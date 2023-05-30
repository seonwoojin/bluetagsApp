import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { NewsStackNavParamList } from "./Root";
import UserDetail from "../screens/user/UserDetail";
import News from "../screens/news/News";

const NativeStack = createNativeStackNavigator<NewsStackNavParamList>();

const NewsStack = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "containedModal",
        headerShown: false,
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <NativeStack.Screen name="Main" component={News} />
    </NativeStack.Navigator>
  );
};

export default NewsStack;

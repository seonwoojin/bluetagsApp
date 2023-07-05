import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import Home from "../screens/Home";
import { HomeStackNavParamList } from "./Root";
import UserDetail from "../screens/user/UserDetail";

const NativeStack = createNativeStackNavigator<HomeStackNavParamList>();

const HomeStack = () => {
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
      <NativeStack.Screen name="Main" component={Home} />
    </NativeStack.Navigator>
  );
};

export default HomeStack;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { BLACK_COLOR } from "../color";
import BluecardDetail from "../screens/bluecard/BluecardDetail";
import SignIn from "../screens/signin/SignIn";
import Header from "../components/Header";
import Home from "../screens/Home";
import { HomeStackNavParamList } from "./Root";

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
      <NativeStack.Screen name="BluecardDetail" component={BluecardDetail} />
    </NativeStack.Navigator>
  );
};

export default HomeStack;

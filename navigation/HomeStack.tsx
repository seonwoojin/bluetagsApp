import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import BluecardDetail from "../screens/bluecard/BluecardDetail";
import Home from "../screens/Home";
import { HomeStackNavParamList } from "./Root";
import ProjectDetail from "../screens/project/ProjectDetail";
import UserDetail from "../screens/user/UserDetail";
import Search from "../screens/Search";

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
      <NativeStack.Screen name="ProjectDetail" component={ProjectDetail} />
      <NativeStack.Screen name="UserDetail" component={UserDetail} />
      <NativeStack.Screen name="Search" component={Search} />
    </NativeStack.Navigator>
  );
};

export default HomeStack;

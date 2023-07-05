import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import BluecardDetail from "../screens/bluecard/BluecardDetail";
import Home from "../screens/Home";
import { HomeStackNavParamList, ProjectStackNavParamList } from "./Root";
import WatchList from "../screens/watchlist/WatchList";
import ProjectScreeen from "../screens/project/Project";
import ProjectDetail from "../screens/project/ProjectDetail";
import UserDetail from "../screens/user/UserDetail";

const NativeStack = createNativeStackNavigator<ProjectStackNavParamList>();

const ProjectStack = () => {
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
      <NativeStack.Screen name="Main" component={ProjectScreeen} />
    </NativeStack.Navigator>
  );
};

export default ProjectStack;

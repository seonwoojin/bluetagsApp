import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import BluecardDetail from "../screens/bluecard/BluecardDetail";
import { WatchListStackNavParamList } from "./Root";
import WatchList from "../screens/watchlist/WatchList";
import ProjectDetail from "../screens/project/ProjectDetail";
import UserDetail from "../screens/user/UserDetail";

const NativeStack = createNativeStackNavigator<WatchListStackNavParamList>();

const WatcListStack = () => {
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
      <NativeStack.Screen name="Main" component={WatchList} />
      <NativeStack.Screen name="BluecardDetail" component={BluecardDetail} />
      <NativeStack.Screen name="ProjectDetail" component={ProjectDetail} />
    </NativeStack.Navigator>
  );
};

export default WatcListStack;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import BluecardDetail from "../screens/bluecard/BluecardDetail";
import { WatchListStackNavParamList } from "./Root";
import WatchList from "../screens/watchlist/WatchList";

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
    </NativeStack.Navigator>
  );
};

export default WatcListStack;

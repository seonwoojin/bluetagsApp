import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { StackNavParamList } from "./Root";
import { BLACK_COLOR } from "../color";
import BluecardDetail from "../screens/bluecard/BluecardDetail";

const NativeStack = createNativeStackNavigator<StackNavParamList>();

const Stack = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        headerTitleStyle: {
          color: isDark ? "white" : BLACK_COLOR,
        },
      }}
    >
      <NativeStack.Screen name="BluecardDetail" component={BluecardDetail} />
    </NativeStack.Navigator>
  );
};

export default Stack;

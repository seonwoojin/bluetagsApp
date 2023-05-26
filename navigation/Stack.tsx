import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, TouchableOpacity, useColorScheme } from "react-native";
import { StackNavParamList } from "./Root";
import { BLACK_COLOR } from "../color";
import BluecardDetail from "../screens/bluecard/BluecardDetail";
import SignIn from "../screens/signin/SignIn";
import Header from "../components/Header";

const NativeStack = createNativeStackNavigator<StackNavParamList>();

const Stack = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: "modal",
        headerShown: false,
      }}
    >
      <NativeStack.Screen name="BluecardDetail" component={BluecardDetail} />
      <NativeStack.Screen name="SignIn" component={SignIn} />
    </NativeStack.Navigator>
  );
};

export default Stack;

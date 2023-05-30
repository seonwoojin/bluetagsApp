import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { CalendarStackNavParamList } from "./Root";
import UserDetail from "../screens/user/UserDetail";
import Calendar from "../screens/calendar/Calendar";

const NativeStack = createNativeStackNavigator<CalendarStackNavParamList>();

const CalendarStack = () => {
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
      <NativeStack.Screen name="Main" component={Calendar} />
    </NativeStack.Navigator>
  );
};

export default CalendarStack;

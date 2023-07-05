import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import { CalendarStackNavParamList } from "./Root";
import UserDetail from "../screens/user/UserDetail";
import Calendar from "../screens/calendar/Calendar";
import { BluecardWithProject, Project } from "../libs/schema";

const NativeStack = createNativeStackNavigator<CalendarStackNavParamList>();

interface Props {
  setCalendarDetail: React.Dispatch<React.SetStateAction<string>>;
  setToDos: React.Dispatch<React.SetStateAction<BluecardWithProject[]>>;
  setTodayDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarStack = ({
  setCalendarDetail,
  setToDos,
  setTodayDate,
}: Props) => {
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
      <NativeStack.Screen name="Main">
        {() => (
          <Calendar
            setToDos={setToDos}
            setTodayDate={setTodayDate}
            setCalendarDetail={setCalendarDetail}
          />
        )}
      </NativeStack.Screen>
    </NativeStack.Navigator>
  );
};

export default CalendarStack;

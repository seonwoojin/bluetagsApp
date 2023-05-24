import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Stack from "./Stack";
import { TabNavParamList } from "./Root";
import { BLACK_COLOR, DARK_GREY, YELLOW_COLOR } from "../color";
import Home from "../screens/Home";

const Tab = createBottomTabNavigator<TabNavParamList>();

const Tabs = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: isDark ? BLACK_COLOR : "white",
      }}
      screenOptions={{
        unmountOnBlur: true,
        tabBarStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        tabBarActiveTintColor: isDark ? YELLOW_COLOR : BLACK_COLOR,
        tabBarInactiveTintColor: isDark ? DARK_GREY : LIGHT_GREY,
        headerStyle: {
          backgroundColor: isDark ? BLACK_COLOR : "white",
        },
        headerTitleStyle: {
          color: isDark ? "white" : BLACK_COLOR,
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"film-outline"} color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="WatchList"
        component={WatchList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"search-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"search-outline"} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Project"
        component={Project}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={"search-outline"} color={color} size={size} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default Tabs;

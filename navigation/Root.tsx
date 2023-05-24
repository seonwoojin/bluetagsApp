import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Stack from "./Stack";
import { NavigatorScreenParams } from "@react-navigation/native";

export type TabNavParamList = {
  Home: undefined;
  News: undefined;
  WatchList: undefined;
  Calendar: undefined;
  Project: undefined;
};

export type StackNavParamList = {
  BluecardDetail: undefined;
};

export type RootNavParamList = {
  Tabs: NavigatorScreenParams<TabNavParamList>;
  Stack: StackNavParamList;
};

const Nav = createNativeStackNavigator<RootNavParamList>();

const Root = () => (
  <Nav.Navigator screenOptions={{ presentation: "modal", headerShown: false }}>
    <Nav.Screen name="Tabs" component={Tabs} />
    <Nav.Screen name="Stack" component={Stack} />
  </Nav.Navigator>
);
export default Root;

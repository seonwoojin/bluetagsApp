import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Stack from "./HomeStack";
import { NavigatorScreenParams } from "@react-navigation/native";
import { BluecardWithProject } from "../libs/schema";

export type TabNavParamList = {
  Home: HomeStackNavParamList;
  News: undefined;
  WatchList: undefined;
  Calendar: undefined;
  Project: undefined;
};

export type HomeStackNavParamList = {
  Main: undefined;
  BluecardDetail: BluecardWithProject;
};

export type StackNavParamList = {
  SignIn: undefined;
};

export type RootNavParamList = {
  Tabs: NavigatorScreenParams<TabNavParamList>;
  Stack: NavigatorScreenParams<StackNavParamList>;
};

const Nav = createNativeStackNavigator<RootNavParamList>();

const Root = () => (
  <Nav.Navigator screenOptions={{ presentation: "modal", headerShown: false }}>
    <Nav.Screen name="Tabs" component={Tabs} />
    <Nav.Screen name="Stack" component={Stack} />
  </Nav.Navigator>
);
export default Root;

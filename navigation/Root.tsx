import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { BluecardWithProject, Project } from "../libs/schema";
import SignIn from "../screens/signin/SignIn";
import SignUp from "../screens/signup/SignUp";

export type TabNavParamList = {
  Home: NavigatorScreenParams<HomeStackNavParamList>;
  News: undefined;
  WatchList: undefined;
  Calendar: undefined;
  Project: undefined;
};

export type HomeStackNavParamList = {
  Main: undefined;
  BluecardDetail: BluecardWithProject;
  ProjectDetail: Project;
};

export type StackNavParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootNavParamList = {
  Tabs: NavigatorScreenParams<TabNavParamList>;
  SignIn: undefined;
  SignUp: undefined;
};

const Nav = createNativeStackNavigator<RootNavParamList>();

const Root = () => (
  <Nav.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: "white",
      },
    }}
  >
    <Nav.Screen name="Tabs" component={Tabs} />
    <Nav.Screen name="SignIn" component={SignIn} />
    <Nav.Screen name="SignUp" component={SignUp} />
  </Nav.Navigator>
);
export default Root;

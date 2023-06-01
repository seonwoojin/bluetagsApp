import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { BluecardWithProject, Project } from "../libs/schema";
import SignIn from "../screens/signin/SignIn";
import SignUp from "../screens/signup/SignUp";

export type TabNavParamList = {
  Home: NavigatorScreenParams<HomeStackNavParamList>;
  News: undefined;
  WatchList: NavigatorScreenParams<WatchListStackNavParamList>;
  Calendar: undefined;
  Project: NavigatorScreenParams<ProjectStackNavParamList>;
};

export type HomeStackNavParamList = {
  Main: undefined;
  BluecardDetail: { data?: BluecardWithProject; bluecardId?: string };
  ProjectDetail: Project;
  UserDetail: undefined;
  Search: { query: string };
};

export type NewsStackNavParamList = {
  Main: undefined;
};

export type WatchListStackNavParamList = {
  Main: undefined;
  BluecardDetail: { data?: BluecardWithProject; bluecardId?: string };
  ProjectDetail: Project;
};

export type CalendarStackNavParamList = {
  Main: { setCalendarDetail: React.Dispatch<React.SetStateAction<boolean>> };
};

export type ProjectStackNavParamList = {
  Main: undefined;
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

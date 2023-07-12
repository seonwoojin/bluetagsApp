import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { BluecardWithProject, Project } from "../libs/schema";
import SignIn from "../screens/signin/SignIn";
import SignUp from "../screens/signup/SignUp";
import BluecardDetail from "../screens/bluecard/BluecardDetail";
import ProjectDetail from "../screens/project/ProjectDetail";
import Header from "../components/Header";
import { useState } from "react";
import Notice from "../components/tabs/Notice";
import Detail from "../components/tabs/Detail";
import CalendarDetail from "../components/tabs/CalendarDetail";
import Search from "../screens/Search";
import UserDetail from "../screens/user/UserDetail";
import UserHistory from "../screens/user/UserHistory";
import UserSaved from "../screens/user/UserSaved";
import UserComment from "../screens/user/UserComment";

export type TabNavParamList = {
  Home: NavigatorScreenParams<HomeStackNavParamList>;
  News: undefined;
  WatchList: NavigatorScreenParams<WatchListStackNavParamList>;
  Calendar: undefined;
  Project: NavigatorScreenParams<ProjectStackNavParamList>;
};

export type HomeStackNavParamList = {
  Main: undefined;
};

export type NewsStackNavParamList = {
  Main: undefined;
};

export type WatchListStackNavParamList = {
  Main: undefined;
};

export type CalendarStackNavParamList = {
  Main: {
    setCalendarDetail: React.Dispatch<React.SetStateAction<string>>;
    setToDos: React.Dispatch<React.SetStateAction<BluecardWithProject[]>>;
    setTodayDate: React.Dispatch<React.SetStateAction<Date>>;
  };
};

export type ProjectStackNavParamList = {
  Main: undefined;
};

export type StackNavParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootNavParamList = {
  Tabs: NavigatorScreenParams<TabNavParamList>;
  SignIn: undefined;
  SignUp: undefined;
  BluecardDetail: { data?: BluecardWithProject; bluecardId?: string };
  ProjectDetail: Project;
  Search: { query: string };
  UserDetail: undefined;
  UserHistory: undefined;
  UserSaved: undefined;
  UserComment: undefined;
};

const Nav = createNativeStackNavigator<RootNavParamList>();

const Root = () => {
  const [detail, setDetail] = useState(false);
  const [notice, setNotice] = useState(false);
  const [calendarDetail, setCalendarDetail] = useState("");
  const [toDos, setToDos] = useState<BluecardWithProject[]>([]);
  const [todayDate, setTodayDate] = useState(new Date());
  return (
    <>
      <Nav.Navigator
        screenOptions={{
          contentStyle: {
            backgroundColor: "white",
          },
          header: ({ navigation }) => (
            <Header
              setDetail={setDetail}
              setNotice={setNotice}
              navigation={navigation}
            />
          ),
          animation: "fade",
        }}
      >
        <Nav.Screen name="Tabs">
          {() => (
            <Tabs
              setCalendarDetail={setCalendarDetail}
              setToDos={setToDos}
              setTodayDate={setTodayDate}
            />
          )}
        </Nav.Screen>
        <Nav.Screen name="SignIn" component={SignIn} />
        <Nav.Screen name="SignUp" component={SignUp} />
        <Nav.Screen name="BluecardDetail" component={BluecardDetail} />
        <Nav.Screen name="ProjectDetail" component={ProjectDetail} />
        <Nav.Screen name="Search" component={Search} />
        <Nav.Screen name="UserDetail" component={UserDetail} />
        <Nav.Screen name="UserHistory" component={UserHistory} />
        <Nav.Screen name="UserSaved" component={UserSaved} />
        <Nav.Screen name="UserComment" component={UserComment} />
      </Nav.Navigator>
      {notice ? <Notice notice={notice} setNotice={setNotice} /> : null}
      {detail ? <Detail detail={detail} setDetail={setDetail} /> : null}
      {calendarDetail !== "" ? (
        <CalendarDetail
          todayDate={todayDate}
          toDos={toDos}
          setCalendarDetail={setCalendarDetail}
        />
      ) : null}
    </>
  );
};
export default Root;

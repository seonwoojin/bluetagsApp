import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "react-native";
import { TabNavParamList } from "./Root";
import Svg, { Path } from "react-native-svg";
import Header from "../components/Header";
import Constants from "expo-constants";
import HomeStack from "./HomeStack";
import WatcListStack from "./WatchlistStack";
import ProjectStack from "./ProjectStack";
import Detail from "../components/tabs/Detail";
import NewsStack from "./NewsStack";
import CalendarStack from "./CalendarStack";
import Notice from "../components/tabs/Notice";
import NoticeDetail from "../components/tabs/NoticeDetail";
import { BluecardWithProject } from "../libs/schema";

const Tab = createBottomTabNavigator<TabNavParamList>();

const Tabs = () => {
  const [detail, setDetail] = useState(false);
  const [notice, setNotice] = useState(false);
  const [calendarDetail, setCalendarDetail] = useState("");
  const [toDos, setToDos] = useState<BluecardWithProject[]>([]);
  const [todayDate, setTodayDate] = useState(new Date());
  const isDark = useColorScheme() === "dark";
  return (
    <>
      <Tab.Navigator
        initialRouteName="Calendar"
        sceneContainerStyle={{
          backgroundColor: "#ffffff",
          paddingTop: Constants.statusBarHeight,
        }}
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#f9f8ff",
            height: 50,
          },
          tabBarActiveTintColor: "#3733FF",
          tabBarInactiveTintColor: "#B0B0B0",
          tabBarIconStyle: {
            marginTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 5,
          },
          tabBarItemStyle: {
            justifyContent: "flex-end",
          },
          header: ({ navigation }) => (
            <Header
              navigation={navigation}
              detail={detail}
              setDetail={setDetail}
              notice={notice}
              setNotice={setNotice}
            />
          ),
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M19.77 11.25H15.73C13.72 11.25 12.75 10.36 12.75 8.52V3.98C12.75 2.14 13.73 1.25 15.73 1.25H19.77C21.78 1.25 22.75 2.14 22.75 3.98V8.51C22.75 10.36 21.77 11.25 19.77 11.25ZM15.73 2.75C14.39 2.75 14.25 3.13 14.25 3.98V8.51C14.25 9.37 14.39 9.74 15.73 9.74H19.77C21.11 9.74 21.25 9.36 21.25 8.51V3.98C21.25 3.12 21.11 2.75 19.77 2.75H15.73Z" />
                <Path d="M19.77 22.75H15.73C13.72 22.75 12.75 21.77 12.75 19.77V15.73C12.75 13.72 13.73 12.75 15.73 12.75H19.77C21.78 12.75 22.75 13.73 22.75 15.73V19.77C22.75 21.77 21.77 22.75 19.77 22.75ZM15.73 14.25C14.55 14.25 14.25 14.55 14.25 15.73V19.77C14.25 20.95 14.55 21.25 15.73 21.25H19.77C20.95 21.25 21.25 20.95 21.25 19.77V15.73C21.25 14.55 20.95 14.25 19.77 14.25H15.73Z" />
                <Path d="M8.27 11.25H4.23C2.22 11.25 1.25 10.36 1.25 8.52V3.98C1.25 2.14 2.23 1.25 4.23 1.25H8.27C10.28 1.25 11.25 2.14 11.25 3.98V8.51C11.25 10.36 10.27 11.25 8.27 11.25ZM4.23 2.75C2.89 2.75 2.75 3.13 2.75 3.98V8.51C2.75 9.37 2.89 9.74 4.23 9.74H8.27C9.61 9.74 9.75 9.36 9.75 8.51V3.98C9.75 3.12 9.61 2.75 8.27 2.75H4.23Z" />
                <Path d="M8.27 22.75H4.23C2.22 22.75 1.25 21.77 1.25 19.77V15.73C1.25 13.72 2.23 12.75 4.23 12.75H8.27C10.28 12.75 11.25 13.73 11.25 15.73V19.77C11.25 21.77 10.27 22.75 8.27 22.75ZM4.23 14.25C3.05 14.25 2.75 14.55 2.75 15.73V19.77C2.75 20.95 3.05 21.25 4.23 21.25H8.27C9.45 21.25 9.75 20.95 9.75 19.77V15.73C9.75 14.55 9.45 14.25 8.27 14.25H4.23Z" />
              </Svg>
            ),
          }}
        />
        <Tab.Screen
          name="News"
          component={NewsStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M22 9.25H2C1.59 9.25 1.25 8.91 1.25 8.5C1.25 8.09 1.59 7.75 2 7.75H22C22.41 7.75 22.75 8.09 22.75 8.5C22.75 8.91 22.41 9.25 22 9.25Z" />
                <Path d="M8 17.25H6C5.59 17.25 5.25 16.91 5.25 16.5C5.25 16.09 5.59 15.75 6 15.75H8C8.41 15.75 8.75 16.09 8.75 16.5C8.75 16.91 8.41 17.25 8 17.25Z" />
                <Path d="M14.5 17.25H10.5C10.09 17.25 9.75 16.91 9.75 16.5C9.75 16.09 10.09 15.75 10.5 15.75H14.5C14.91 15.75 15.25 16.09 15.25 16.5C15.25 16.91 14.91 17.25 14.5 17.25Z" />
                <Path d="M17.56 21.25H6.44C2.46 21.25 1.25 20.05 1.25 16.11V7.89C1.25 3.95 2.46 2.75 6.44 2.75H17.55C21.53 2.75 22.74 3.95 22.74 7.89V16.1C22.75 20.05 21.54 21.25 17.56 21.25ZM6.44 4.25C3.3 4.25 2.75 4.79 2.75 7.89V16.1C2.75 19.2 3.3 19.74 6.44 19.74H17.55C20.69 19.74 21.24 19.2 21.24 16.1V7.89C21.24 4.79 20.69 4.25 17.55 4.25H6.44Z" />
              </Svg>
            ),
          }}
        />
        <Tab.Screen
          name="WatchList"
          component={WatcListStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M15.78 2H8.22C4.44 2 3.5 3.01 3.5 7.04V18.3C3.5 20.96 4.96 21.59 6.73 19.69L6.74 19.68C7.56 18.81 8.81 18.88 9.52 19.83L10.53 21.18C11.34 22.25 12.65 22.25 13.46 21.18L14.47 19.83C15.19 18.87 16.44 18.8 17.26 19.68C19.04 21.58 20.49 20.95 20.49 18.29V7.04C20.5 3.01 19.56 2 15.78 2ZM14.75 10.75H9.25C8.84 10.75 8.5 10.41 8.5 10C8.5 9.59 8.84 9.25 9.25 9.25H14.75C15.16 9.25 15.5 9.59 15.5 10C15.5 10.41 15.16 10.75 14.75 10.75Z" />
              </Svg>
            ),
          }}
        />
        <Tab.Screen
          name="Calendar"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Svg viewBox="0 0 448 512">
                <Path
                  fill={color}
                  d="M112 0c8.8 0 16 7.2 16 16V64H320V16c0-8.8 7.2-16 16-16s16 7.2 16 16V64h32c35.3 0 64 28.7 64 64v32 32V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 160 128C0 92.7 28.7 64 64 64H96V16c0-8.8 7.2-16 16-16zM416 192H32V448c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V192zM384 96H64c-17.7 0-32 14.3-32 32v32H416V128c0-17.7-14.3-32-32-32z"
                />
              </Svg>
            ),
          }}
        >
          {() => (
            <CalendarStack
              setToDos={setToDos}
              setTodayDate={setTodayDate}
              setCalendarDetail={setCalendarDetail}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Project"
          component={ProjectStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <Path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" />
                <Path d="M7.33011 15.24C7.17011 15.24 7.01011 15.19 6.87011 15.08C6.54011 14.83 6.48011 14.36 6.73011 14.03L9.11011 10.94C9.40011 10.57 9.81011 10.33 10.2801 10.27C10.7401 10.21 11.2101 10.34 11.5801 10.63L13.4101 12.07C13.4801 12.13 13.5501 12.13 13.6001 12.12C13.6401 12.12 13.7101 12.1 13.7701 12.02L16.0801 9.04001C16.3301 8.71001 16.8101 8.65001 17.1301 8.91001C17.4601 9.16001 17.5201 9.63001 17.2601 9.96001L14.9501 12.94C14.6601 13.31 14.2501 13.55 13.7801 13.6C13.3101 13.66 12.8501 13.53 12.4801 13.24L10.6501 11.8C10.5801 11.74 10.5001 11.74 10.4601 11.75C10.4201 11.75 10.3501 11.77 10.2901 11.85L7.91011 14.94C7.78011 15.14 7.56011 15.24 7.33011 15.24Z" />
              </Svg>
            ),
          }}
        />
      </Tab.Navigator>
      {notice ? <Notice notice={notice} setNotice={setNotice} /> : null}
      {detail ? <Detail detail={detail} setDetail={setDetail} /> : null}
      {calendarDetail !== "" ? (
        <NoticeDetail
          todayDate={todayDate}
          toDos={toDos}
          setCalendarDetail={setCalendarDetail}
        />
      ) : null}
    </>
  );
};

export default Tabs;

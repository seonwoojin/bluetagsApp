import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "styled-components";
import Root from "./navigation/Root";
import { darkTheme, lightTheme } from "./styled";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./libs/context";
import { SocialUser, User } from "./libs/schema";
import Toast from "react-native-toast-message";
import ToastSuccess from "./components/ToastSuccess";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: { text1?: string }) => <ToastSuccess text1={props.text1!} />,
};

export default function App() {
  //rAsyncStorage.clear();
  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState<User | SocialUser | null>(null);
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    const getUser = async () => {
      try {
        const value = await AsyncStorage.getItem("user");
        setUser(value != null ? JSON.parse(value) : null);
        if (value !== null) {
          // value previously stored
        }
      } catch (e) {
        // error reading value
      }
    };
    async function prepare() {
      try {
        await getUser();
        await new Promise((resolve: any) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <NavigationContainer onReady={onLayoutRootView}>
            <StatusBar backgroundColor="white" />
            <Root />
            <Toast config={toastConfig} />
          </NavigationContainer>
        </ThemeProvider>
      </QueryClientProvider>
    </UserContext.Provider>
  );
}

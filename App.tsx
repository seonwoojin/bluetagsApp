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
import { User } from "./libs/schema";
import Toast from "react-native-toast-message";
import ToastSuccess from "./components/ToastSuccess";
import axios from "axios";
import useInterval from "./libs/useInterval";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: { text1?: string }) => <ToastSuccess text1={props.text1!} />,
};

interface Response {
  user: User;
  token?: string;
}

export default function App() {
  //AsyncStorage.clear();
  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>();
  const isDark = useColorScheme() === "dark";

  const storeToken = async (value: string) => {
    try {
      await AsyncStorage.setItem("token", value);
    } catch (e) {}
  };

  const getUser = async (newToken?: string) => {
    try {
      if (newToken) {
        const data = await axios.get<Response>(
          "https://www.bluetags.app/api/users/mobile",
          {
            headers: { Authorization: `Bearer ${newToken}` },
          }
        );
        if (data.data.token === "ExpiredError") {
          return;
        }
        if (data.data.token) {
          await storeToken(data.data.token);
          setToken(data.data.token);
        }
        setUser(data.data.user);
      } else if (token) {
        const data = await axios.get<Response>(
          "https://www.bluetags.app/api/users/mobile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data.data.token) {
          await storeToken(data.data.token);
          setToken(data.data.token);
        }
        setUser(data.data.user);
      }
    } catch (error) {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
    }
  };

  useInterval(async () => {
    await getUser();
  }, 60000);

  useEffect(() => {
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        if (value !== null) {
          setToken(value);
          getUser(value);
        }
      } catch (e) {
        // error reading value
      }
    };
    async function prepare() {
      try {
        await getToken();
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
    <UserContext.Provider value={{ user, setUser, setToken }}>
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

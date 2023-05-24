import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { QueryClient, QueryClientProvider } from "react-query";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Root from "navigation/Root";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "styled";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    async function prepare() {
      try {
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <NavigationContainer onReady={onLayoutRootView}>
          <Root />
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

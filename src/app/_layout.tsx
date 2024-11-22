import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import "../../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "@/hooks/useColorScheme";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useUser } from "@/state/authState";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <OverlayProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <KeyboardProvider>
                <Slot />
                <StatusBar style="auto" />
              </KeyboardProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </OverlayProvider>
    </GluestackUIProvider>
  );
}

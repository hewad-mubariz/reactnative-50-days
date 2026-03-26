import { useState, useEffect } from "react";
import TodoCards from "@/screens/TodoCards";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  RobotoSerif_400Regular,
  RobotoSerif_700Bold,
  RobotoSerif_300Light,
  RobotoSerif_400Regular_Italic,
  RobotoSerif_500Medium,
  RobotoSerif_600SemiBold,
  RobotoSerif_900Black,
} from "@expo-google-fonts/roboto-serif";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function index() {
  const [loaded, error] = useFonts({
    RobotoSerif_400Regular,
    RobotoSerif_700Bold,
    RobotoSerif_300Light,
    RobotoSerif_400Regular_Italic,
    RobotoSerif_500Medium,
    RobotoSerif_600SemiBold,
    RobotoSerif_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return <TodoCards />;
}

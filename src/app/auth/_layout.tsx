import AnalyticsManager, { convertScreenPathToName } from "@/services/analytics/AnalyticsManager";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import React, { useEffect } from "react";

const AuthLayout = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    AnalyticsManager.trackScreenView(convertScreenPathToName(pathname), params);
  }, [pathname, params]);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="signin">
      <Stack.Screen name="signin" />
    </Stack>
  );
};

export default AuthLayout;

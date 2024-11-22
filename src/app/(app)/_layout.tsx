import React, { useEffect } from "react";
import { useUser } from "@/state/authState";
import { Redirect, Stack, useGlobalSearchParams, usePathname } from "expo-router";
import AnalyticsManager, { convertScreenPathToName } from "@/services/analytics/AnalyticsManager";
import { observer } from "@legendapp/state/react";

const AppLayout = observer(() => {
  const user = useUser();
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (user) {
      AnalyticsManager.identifyUser(
        user.id,
        user.email!,
        user.firstName || "",
        user.lastName || ""
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      AnalyticsManager.trackScreenView(convertScreenPathToName(pathname), params);
    }
  }, [pathname, params]);

  if (!user) {
    return <Redirect href="/auth/signin" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="(tabs)"
    ></Stack>
  );
});

export default AppLayout;

import { Image, Platform } from "react-native";
import React, { useState } from "react";
import { Screen } from "@/components/screens/Screen";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { useInAppNotifications } from "@/utils/notificationsHelpers";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { signInWithApple, signInWithGoogle } from "@/utils/authHelpers";
import { router } from "expo-router";

const AuthHomeScreen = () => {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const { showNotification } = useInAppNotifications();

  const onSignUpPressed = () => {
    console.log("Sign up pressed");
  };

  const onSignInPressed = () => {
    console.log("Sign in pressed");
  };

  const onSignUpWithGooglePressed = async () => {
    try {
      const didSignIn = await signInWithGoogle();

      if (didSignIn) {
        router.replace("/");
      }
    } catch {
      showNotification({
        title: "Error",
        description: "Something went wrong and we couldn't sign you in. Please try again.",
        variant: "error",
      });
    }
  };

  const onSignUpWithApplePressed = async () => {
    try {
      await signInWithApple();
      router.replace("/");
    } catch {
      showNotification({
        title: "Error",
        description: "Something went wrong and we couldn't sign you in. Please try again.",
        variant: "error",
      });
    }
  };

  const getAppleButton = () => {
    return Platform.OS === "ios" ? (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={
          mode === "signup"
            ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
            : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
        }
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: "100%", height: 46 }}
        onPress={onSignUpWithApplePressed}
      />
    ) : null;
  };

  const getSignUpUI = () => {
    return (
      <VStack className="flex-1 w-full my-7 " space="lg">
        <Button className="w-full" size="xl" onPress={onSignUpPressed}>
          <ButtonText className="font-medium">Sign up</ButtonText>
        </Button>
        {getAppleButton()}
        <Button
          variant="outline"
          size="xl"
          action="secondary"
          className="w-full gap-1"
          onPress={onSignUpWithGooglePressed}
        >
          <ButtonText className="font-medium">Continue with Google</ButtonText>
          <ButtonIcon as={GoogleIcon} />
        </Button>
      </VStack>
    );
  };

  const getSignInUI = () => {
    return (
      <VStack className="flex-1 w-full my-7 " space="lg">
        <Button className="w-full" size="xl" onPress={onSignInPressed}>
          <ButtonText className="font-medium">Sign In</ButtonText>
        </Button>
        {getAppleButton()}
        <Button
          variant="outline"
          size="xl"
          action="secondary"
          className="w-full gap-1"
          onPress={onSignUpWithGooglePressed}
        >
          <ButtonText className="font-medium">Continue with Google</ButtonText>
          <ButtonIcon as={GoogleIcon} />
        </Button>
      </VStack>
    );
  };

  return (
    <Screen>
      <VStack className="flex-1 justify-between h-full">
        <Center className="h-2/3 w-full">
          <Image
            source={require("@assets/images/app_logo.jpg")}
            style={{ width: "70%", objectFit: "contain" }}
          />
        </Center>

        <VStack className="flex-1 flex-grow justify-end">
          {mode === "signup" ? getSignUpUI() : getSignInUI()}

          <HStack className="self-center" space="sm">
            <Button
              variant="link"
              onPress={() => (mode === "signup" ? setMode("signin") : setMode("signup"))}
            >
              <ButtonText size="md" className="underline">
                {mode === "signup"
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign up"}
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Screen>
  );
};

export default AuthHomeScreen;

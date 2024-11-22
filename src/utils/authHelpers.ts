/**
 * Authentication helper functions for Google and Apple sign-in
 * @module authHelpers
 */

import { signInWithGoogleToBackend } from "@/services/api/auth";
import supabase from "@/services/supabase/supabase";
import { signInUser } from "@/state/authState";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { sliceName } from "./stringsHelpers";
import * as AppleAuthentication from "expo-apple-authentication";

/**
 * Configure Google Sign-In with required OAuth scopes
 * Requires setting up OAuth credentials in Google Cloud Console
 */
GoogleSignin.configure({
  scopes: [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.labels",
  ],
  webClientId: "your app web id from google cloud console ouath section",
  iosClientId: "your app ios id from google cloud console ouath section",
});

/**
 * Handles the Google Sign-In flow
 * @async
 * @returns {Promise<boolean>} Returns true if sign in was successful
 * @throws {Error} If sign in fails or required data is missing
 */
export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    if (!userInfo || !userInfo.data) {
      console.log("No user info");
      return false;
    }

    if (userInfo.data.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data.idToken,
      });
      if (data && data.user && userInfo.data.serverAuthCode) {
        await signInWithGoogleToBackend(userInfo.data.serverAuthCode);

        const { firstName, lastName } = sliceName(data.user.user_metadata?.full_name || "");

        await signInUser({
          email: data.user.email || "",
          id: data.user.id || "",
          avatarUrl: data.user.user_metadata?.avatar_url || "",
          firstName,
          lastName,
        });

        return true;
      } else {
        console.error("Error", error);
        throw new Error("Failed to sign in with Google and Supabase");
      }
    } else {
      throw new Error("no ID token present!");
    }
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

/**
 * Handles the Apple Sign-In flow
 * @async
 * @returns {Promise<User>} Returns the signed in user object
 * @throws {Error} If sign in fails or is cancelled
 */
export async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    // Sign in via Supabase Auth.
    if (credential.identityToken) {
      const {
        error,
        data: { user },
      } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      console.log(JSON.stringify({ error, user }, null, 2));

      if (!user) {
        throw new Error("No user");
      }

      await signInUser({
        email: user.email || "",
        id: user.id || "",
        avatarUrl: user.user_metadata?.avatar_url || "",
      });

      return user;
    } else {
      throw new Error("No identityToken.");
    }
  } catch (e: any) {
    console.error(e);
    if (e.code !== "ERR_REQUEST_CANCELED") {
      throw new Error("Error signing in with Apple");
    }
  }
}

/**
 * @typedef {Object} User
 * @property {string} email - User's email address
 * @property {string} id - User's unique identifier
 * @property {string} avatarUrl - URL to user's avatar image
 * @property {string} [firstName] - User's first name (optional)
 * @property {string} [lastName] - User's last name (optional)
 */

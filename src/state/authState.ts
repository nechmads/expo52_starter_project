/**
 * Authentication state management module using Legend State.
 * Handles user authentication state persistence and provides hooks for accessing user data.
 * @module authState
 */

import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/models/User";
import AnalyticsManager from "@/services/analytics/AnalyticsManager";
import supabase from "@/services/supabase/supabase";

/**
 * Interface defining the structure of the authentication state.
 */
interface AuthState {
  user: User;
}

/**
 * Observable state container for authentication data.
 */
export const authState = observable<AuthState>();

/**
 * Configure persistence for the auth state using AsyncStorage.
 * This ensures the auth state survives app restarts.
 */
syncObservable(authState, {
  persist: {
    name: "authState",
    plugin: new ObservablePersistAsyncStorage({ AsyncStorage }),
  },
});

/**
 * Hook to access the current user data.
 * @param peek - If true, retrieves the value without creating reactive dependencies.
 * @returns The current user object or undefined if not authenticated.
 */
export const useUser = (peek: boolean = false) =>
  peek ? authState.user.peek() : authState.user.get();

/**
 * Hook to access the current user's avatar URL.
 * Uses peek to avoid unnecessary re-renders.
 * @returns The URL of the user's avatar or undefined.
 */
export const useUserAvatarUrl = () => authState.user.avatarUrl.peek();

/**
 * Hook to check if a user is currently authenticated.
 * @returns boolean indicating whether a user is logged in.
 */
export const useIsAuthenticated = () => authState.user.get() !== undefined;

/**
 * Signs in a user and updates the auth state.
 * Also identifies the user in the analytics system.
 * @param user - The user object containing authentication details
 */
export const signInUser = async (user: User) => {
  AnalyticsManager.identifyUser(user.id, user.email!, user.firstName || "", user.lastName || "");
  authState.user.set(user);
};

/**
 * Signs out the current user.
 * Clears the auth state and terminates the Supabase session.
 */
export const signOutUser = async () => {
  authState.user.set(undefined);
  await supabase.auth.signOut();
};

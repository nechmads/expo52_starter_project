import { postApi } from "./base";

export async function signInWithGoogleToBackend(authCode: string) {
  await postApi("/auth/signinWithGoogle", { code: authCode });
}

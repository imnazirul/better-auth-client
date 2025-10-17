import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  plugins: [emailOTPClient()],
});

export const { signIn, signUp, useSession } = createAuthClient();

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: window.location.origin,
  fetchOptions: {
    credentials: 'include'
  }
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
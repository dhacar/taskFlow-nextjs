import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  providers: [Google],
  pages: {
    signIn: "/auth/signin"
  }
} satisfies NextAuthConfig;

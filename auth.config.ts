import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt"
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? ""
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin"
  }
} satisfies NextAuthConfig;

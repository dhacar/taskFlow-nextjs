import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") {
        return "/auth/signin?error=InvalidProvider";
      }

      if (!profile?.email) {
        return "/auth/signin?error=MissingGoogleEmail";
      }

      try {
        await connectToDatabase();

        await User.findOneAndUpdate(
          { email: profile.email.toLowerCase() },
          {
            $set: {
              name: profile.name || profile.email.split("@")[0],
              email: profile.email.toLowerCase(),
              image: typeof profile.image === "string" ? profile.image : "",
              provider: "google"
            }
          },
          { new: true, upsert: true, runValidators: true }
        );
      } catch (error) {
        console.error("GOOGLE_SIGN_IN_USER_UPSERT_FAILED", error);
        return "/auth/signin?error=DatabaseUnavailable";
      }

      return true;
    },
    async jwt({ token, account, profile }) {
      if (profile?.email) {
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: profile.email.toLowerCase() }).select("_id provider").lean<{
            _id: { toString: () => string };
            provider: "google";
          } | null>();

          if (user) {
            token.id = user._id.toString();
            token.provider = user.provider;
          }
        } catch (error) {
          console.error("GOOGLE_JWT_USER_LOOKUP_FAILED", error);
        }
      }

      if (account?.provider) {
        token.provider = "google";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.provider = "google";
      }

      return session;
    }
  }
});

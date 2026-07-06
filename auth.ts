import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/models/user";

function getProvider(provider?: string) {
  return provider === "github" ? "github" : "google";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account, profile }) {
      if (!profile?.email || !account?.provider) {
        return false;
      }

      await connectToDatabase();

      await User.findOneAndUpdate(
        { email: profile.email.toLowerCase() },
        {
          $set: {
            name: profile.name || profile.email.split("@")[0],
            email: profile.email.toLowerCase(),
            image: typeof profile.image === "string" ? profile.image : "",
            provider: getProvider(account.provider)
          }
        },
        { new: true, upsert: true }
      );

      return true;
    },
    async jwt({ token, account, profile }) {
      if (profile?.email) {
        await connectToDatabase();
        const user = await User.findOne({ email: profile.email.toLowerCase() }).select("_id provider").lean<{
          _id: { toString: () => string };
          provider: "google" | "github";
        } | null>();

        if (user) {
          token.id = user._id.toString();
          token.provider = user.provider;
        }
      }

      if (account?.provider) {
        token.provider = getProvider(account.provider);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.provider = token.provider === "github" ? "github" : "google";
      }

      return session;
    }
  }
});

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in"
};

const errorMessages: Record<string, string> = {
  AccessDenied: "The sign-in callback was denied. Check the latest Vercel function logs for the exact reason.",
  CallbackRouteError: "Google returned to the app, but the callback failed. Check OAuth URLs and server logs.",
  Configuration: "Authentication is missing or using invalid environment variables.",
  DatabaseUnavailable: "Google sign-in worked, but TaskFlow could not reach MongoDB to create your user.",
  InvalidProvider: "This app only allows Google sign-in.",
  MissingGoogleEmail: "Google did not send an email address. Make sure the OAuth consent screen includes email/profile scopes."
};

async function signInWithGoogle() {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
}

type SignInPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  const params = await searchParams;
  const error = params?.error;
  const errorMessage = error ? errorMessages[error] || `Authentication failed: ${error}` : null;

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_28rem),hsl(var(--background))] px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-3 grid size-11 place-items-center rounded-md bg-primary text-primary-foreground">
            <CheckCircle2 className="size-6" />
          </Link>
          <CardTitle className="text-2xl">Sign in to TaskFlow</CardTitle>
          <CardDescription>Use Google to access your private task dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {errorMessage ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </div>
          ) : null}
          <form action={signInWithGoogle}>
            <Button className="w-full" variant="outline" type="submit">
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

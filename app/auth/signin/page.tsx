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

async function signInWithGoogle() {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
}

export default async function SignInPage() {
  const session = await auth();

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

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto mb-4 size-10 text-destructive" />
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          TaskFlow could not finish the request. Check your environment settings and try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="max-w-md text-center">
        <SearchX className="mx-auto mb-4 size-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you are looking for does not exist or may have moved.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/">Back to TaskFlow</Link>
        </Button>
      </div>
    </main>
  );
}

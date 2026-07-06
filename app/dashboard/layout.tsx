import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, LayoutDashboard } from "lucide-react";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-muted/35">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background lg:block">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </span>
          <span className="font-bold">TaskFlow</span>
        </div>
        <nav className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold lg:hidden">
            <CheckCircle2 className="size-5 text-primary" />
            TaskFlow
          </Link>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={session.user} />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

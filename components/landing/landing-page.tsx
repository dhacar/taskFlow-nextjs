"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, LayoutDashboard, LockKeyhole, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LandingPageProps = {
  isSignedIn: boolean;
};

const features = [
  {
    icon: LockKeyhole,
    title: "Private by default",
    text: "OAuth sign-in keeps every workspace scoped to the current user."
  },
  {
    icon: BarChart3,
    title: "Useful visibility",
    text: "Track completion, overdue work, priorities, and daily flow from one dashboard."
  },
  {
    icon: Moon,
    title: "Ready for long days",
    text: "A polished responsive interface with dark mode and focused task controls."
  }
];

export function LandingPage({ isSignedIn }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_32rem),hsl(var(--background))]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" />
          </span>
          TaskFlow
        </Link>
        <Button asChild>
          <Link href={isSignedIn ? "/dashboard" : "/auth/signin"}>
            {isSignedIn ? "Open dashboard" : "Sign in"}
            <ArrowRight />
          </Link>
        </Button>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:py-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            Modern task management for focused execution
          </div>
          <h1 className="text-4xl font-bold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
            Turn scattered work into a clean, measurable flow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            TaskFlow gives every signed-in user a private task dashboard with creation, editing, filtering, sorting,
            completion tracking, and polished SaaS-grade controls.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={isSignedIn ? "/dashboard" : "/auth/signin"}>
                {isSignedIn ? "Go to dashboard" : "Start with OAuth"}
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">View features</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="rounded-lg border bg-card p-4 shadow-2xl shadow-primary/10"
        >
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today</p>
              <h2 className="text-xl font-semibold">Dashboard overview</h2>
            </div>
            <LayoutDashboard className="size-5 text-primary" />
          </div>
          <div className="grid gap-3 py-4 sm:grid-cols-3">
            {["12 tasks", "74% done", "3 overdue"].map((item) => (
              <div key={item} className="rounded-md border bg-background p-3 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
          <div className="grid gap-3">
            {[
              ["Prepare launch plan", "High", "Product"],
              ["Review OAuth settings", "Medium", "Engineering"],
              ["Ship customer report", "Low", "Operations"]
            ].map(([title, priority, category]) => (
              <div key={title} className="flex items-center justify-between rounded-md border bg-background p-4">
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{category}</p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">{priority}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto grid w-full max-w-7xl gap-4 px-6 pb-20 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="p-6">
              <feature.icon className="mb-4 size-6 text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

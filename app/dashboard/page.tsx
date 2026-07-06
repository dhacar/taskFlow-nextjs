import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getTasksForCurrentUser } from "@/lib/task-service";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default async function DashboardPage() {
  const tasks = await getTasksForCurrentUser();

  return <DashboardClient tasks={tasks} />;
}

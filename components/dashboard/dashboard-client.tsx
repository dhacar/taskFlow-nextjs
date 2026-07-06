"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, CircleAlert, ListChecks, Plus, Search } from "lucide-react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { TaskCard } from "@/components/dashboard/task-card";
import { TaskForm } from "@/components/dashboard/task-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { taskPriorityLabels, taskStatusLabels } from "@/lib/constants/tasks";
import type { SerializedTask, TaskPriority, TaskStatus } from "@/types/task";

type DashboardClientProps = {
  tasks: SerializedTask[];
};

type StatusFilter = TaskStatus | "all";
type PriorityFilter = TaskPriority | "all";
type SortKey = "newest" | "dueDate" | "priority";

const priorityRank: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export function DashboardClient({ tasks }: DashboardClientProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tasks
      .filter((task) => {
        const matchesQuery =
          task.title.toLowerCase().includes(normalizedQuery) ||
          task.description.toLowerCase().includes(normalizedQuery) ||
          task.category.toLowerCase().includes(normalizedQuery);
        const matchesStatus = status === "all" || task.status === status;
        const matchesPriority = priority === "all" || task.priority === priority;
        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((first, second) => {
        if (sort === "priority") {
          return priorityRank[second.priority] - priorityRank[first.priority];
        }

        if (sort === "dueDate") {
          return first.dueDate.localeCompare(second.dueDate);
        }

        return second.createdAt.localeCompare(first.createdAt);
      });
  }, [priority, query, sort, status, tasks]);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 p-4 lg:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-normal md:text-3xl">Task dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, prioritize, and complete your private task flow.</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Create task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create task</DialogTitle>
              <DialogDescription>Add a task to your private dashboard.</DialogDescription>
            </DialogHeader>
            <TaskForm onSaved={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DashboardStats tasks={tasks} />

      <section className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, description, or category"
              className="pl-9"
            />
          </label>

          <Select value={status} onValueChange={(value: StatusFilter) => setStatus(value)}>
            <SelectTrigger aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(taskStatusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={(value: PriorityFilter) => setPriority(value)}>
            <SelectTrigger aria-label="Filter by priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {Object.entries(taskPriorityLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value: SortKey) => setSort(value)}>
            <SelectTrigger aria-label="Sort tasks">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="dueDate">Due date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {filteredTasks.length ? (
        <section className="grid gap-4 xl:grid-cols-3">
          {(["todo", "in-progress", "completed"] as TaskStatus[]).map((columnStatus) => {
            const columnTasks = filteredTasks.filter((task) => task.status === columnStatus);
            const columnIcon = columnStatus === "todo" ? ListChecks : columnStatus === "in-progress" ? CalendarClock : CheckCircle2;
            const Icon = columnIcon;

            return (
              <div key={columnStatus} className="grid content-start gap-3 rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" />
                    <h2 className="font-semibold">{taskStatusLabels[columnStatus]}</h2>
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="grid gap-3">
                  {columnTasks.length ? (
                    columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
                  ) : (
                    <div className="grid min-h-32 place-items-center rounded-md border border-dashed text-sm font-medium text-muted-foreground">
                      No matching tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="grid min-h-80 place-items-center rounded-lg border border-dashed bg-card p-8 text-center">
          <div className="max-w-md">
            <CircleAlert className="mx-auto mb-4 size-9 text-muted-foreground" />
            <h2 className="text-lg font-semibold">No tasks found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Create your first task or adjust the current filters.</p>
          </div>
        </section>
      )}
    </main>
  );
}

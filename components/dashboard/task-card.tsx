"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Edit3, MoreHorizontal, Trash2, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { deleteTaskAction, toggleTaskCompletedAction } from "@/actions/tasks";
import { TaskForm } from "@/components/dashboard/task-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { taskPriorityLabels, taskStatusLabels } from "@/lib/constants/tasks";
import { cn } from "@/lib/utils";
import type { SerializedTask } from "@/types/task";

type TaskCardProps = {
  task: SerializedTask;
};

const priorityTone = {
  high: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
} as const;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

function isOverdue(task: SerializedTask) {
  const today = new Date().toISOString().slice(0, 10);
  return !task.completed && task.dueDate < today;
}

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  function runAction(action: () => Promise<{ success: boolean; message: string }>) {
    startTransition(async () => {
      const result = await action();

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <article className="grid gap-4 rounded-lg border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={priorityTone[task.priority]}>
            {taskPriorityLabels[task.priority]}
          </Badge>
          <Badge variant="secondary">{taskStatusLabels[task.status]}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Open actions for ${task.title}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit3 className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => runAction(() => toggleTaskCompletedAction(task.id, !task.completed))}>
              {task.completed ? <Undo2 className="size-4" /> : <Check className="size-4" />}
              {task.completed ? "Reopen" : "Mark completed"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => runAction(() => deleteTaskAction(task.id))}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <h3 className={cn("font-semibold leading-6", task.completed && "text-muted-foreground line-through")}>{task.title}</h3>
        {task.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{task.description}</p> : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">{task.category}</span>
        <span className={cn("inline-flex items-center gap-1.5 font-medium", isOverdue(task) && "text-destructive")}>
          <CalendarDays className="size-4" />
          {formatDate(task.dueDate)}
        </span>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Update task details, priority, status, and due date.</DialogDescription>
          </DialogHeader>
          <TaskForm task={task} onSaved={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {isPending ? <span className="sr-only">Updating task</span> : null}
    </article>
  );
}

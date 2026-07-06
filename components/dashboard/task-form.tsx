"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createTaskAction, updateTaskAction } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { taskPriorityLabels, taskStatusLabels } from "@/lib/constants/tasks";
import { taskFormSchema, type TaskFormValues } from "@/lib/validations/task";
import type { SerializedTask } from "@/types/task";

type TaskFormProps = {
  task?: SerializedTask;
  onSaved?: () => void;
};

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  category: "General",
  dueDate: new Date().toISOString().slice(0, 10)
};

function getDefaultValues(task?: SerializedTask): TaskFormValues {
  if (!task) {
    return emptyValues;
  }

  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate
  };
}

export function TaskForm({ task, onSaved }: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getDefaultValues(task)
  });

  useEffect(() => {
    reset(getDefaultValues(task));
  }, [reset, task]);

  const onSubmit: SubmitHandler<TaskFormValues> = (values) => {
    startTransition(async () => {
      const result = task ? await updateTaskAction(task.id, values) : await createTaskAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset(getDefaultValues());
      onSaved?.();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Prepare product update" {...register("title")} />
        {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Add useful context, criteria, or links." {...register("description")} />
        {errors.description ? <p className="text-sm text-destructive">{errors.description.message}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(taskStatusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid gap-2">
          <Label>Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(taskPriorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" placeholder="Marketing" {...register("category")} />
          {errors.category ? <p className="text-sm text-destructive">{errors.category.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
          {errors.dueDate ? <p className="text-sm text-destructive">{errors.dueDate.message}</p> : null}
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : task ? "Save changes" : "Create task"}
      </Button>
    </form>
  );
}

import type { taskPriorities, taskStatuses } from "@/lib/constants/tasks";

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskPriority = (typeof taskPriorities)[number];

export type SerializedTask = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

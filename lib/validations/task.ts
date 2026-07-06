import { z } from "zod";
import { taskPriorities, taskStatuses } from "@/lib/constants/tasks";

export const taskFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters.").max(120),
  description: z.string().trim().max(1000),
  status: z.enum(taskStatuses),
  priority: z.enum(taskPriorities),
  category: z.string().trim().min(1, "Category is required.").max(40),
  dueDate: z.string().min(1, "Due date is required.")
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

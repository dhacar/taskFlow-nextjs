"use server";

import { revalidatePath } from "next/cache";
import {
  createTaskForCurrentUser,
  deleteTaskForCurrentUser,
  setTaskCompletedForCurrentUser,
  updateTaskForCurrentUser
} from "@/lib/task-service";
import { taskFormSchema, type TaskFormValues } from "@/lib/validations/task";

export type ActionResult = {
  success: boolean;
  message: string;
};

function validateObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

function getActionError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createTaskAction(values: TaskFormValues): Promise<ActionResult> {
  const parsed = taskFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid task." };
  }

  try {
    await createTaskForCurrentUser(parsed.data);
    revalidatePath("/dashboard");
    return { success: true, message: "Task created." };
  } catch (error) {
    return { success: false, message: getActionError(error) };
  }
}

export async function updateTaskAction(taskId: string, values: TaskFormValues): Promise<ActionResult> {
  if (!validateObjectId(taskId)) {
    return { success: false, message: "Invalid task id." };
  }

  const parsed = taskFormSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Invalid task." };
  }

  try {
    await updateTaskForCurrentUser(taskId, parsed.data);
    revalidatePath("/dashboard");
    return { success: true, message: "Task updated." };
  } catch (error) {
    return { success: false, message: getActionError(error) };
  }
}

export async function deleteTaskAction(taskId: string): Promise<ActionResult> {
  if (!validateObjectId(taskId)) {
    return { success: false, message: "Invalid task id." };
  }

  try {
    await deleteTaskForCurrentUser(taskId);
    revalidatePath("/dashboard");
    return { success: true, message: "Task deleted." };
  } catch (error) {
    return { success: false, message: getActionError(error) };
  }
}

export async function toggleTaskCompletedAction(taskId: string, completed: boolean): Promise<ActionResult> {
  if (!validateObjectId(taskId)) {
    return { success: false, message: "Invalid task id." };
  }

  try {
    await setTaskCompletedForCurrentUser(taskId, completed);
    revalidatePath("/dashboard");
    return { success: true, message: completed ? "Task completed." : "Task reopened." };
  } catch (error) {
    return { success: false, message: getActionError(error) };
  }
}

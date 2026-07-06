import { Types } from "mongoose";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Task, type TaskDocument } from "@/lib/models/task";
import { User } from "@/lib/models/user";
import type { TaskFormValues } from "@/lib/validations/task";
import type { SerializedTask } from "@/types/task";

function serializeTask(task: TaskDocument): SerializedTask {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate.toISOString().slice(0, 10),
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}

export async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("You must be signed in to continue.");
  }

  if (session.user.id) {
    return session.user.id;
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email.toLowerCase() }).select("_id").lean<{
    _id: { toString: () => string };
  } | null>();

  if (!user) {
    throw new Error("Your account could not be found.");
  }

  return user._id.toString();
}

export async function getTasksForCurrentUser() {
  const userId = await getCurrentUserId();
  await connectToDatabase();

  const tasks = await Task.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  return tasks.map(serializeTask);
}

export async function createTaskForCurrentUser(values: TaskFormValues) {
  const userId = await getCurrentUserId();
  await connectToDatabase();

  await Task.create({
    ...values,
    dueDate: new Date(`${values.dueDate}T00:00:00.000Z`),
    completed: values.status === "completed",
    userId: new Types.ObjectId(userId)
  });
}

export async function updateTaskForCurrentUser(taskId: string, values: TaskFormValues) {
  const userId = await getCurrentUserId();
  await connectToDatabase();

  await Task.findOneAndUpdate(
    { _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(userId) },
    {
      $set: {
        ...values,
        dueDate: new Date(`${values.dueDate}T00:00:00.000Z`),
        completed: values.status === "completed"
      }
    },
    { new: true }
  );
}

export async function deleteTaskForCurrentUser(taskId: string) {
  const userId = await getCurrentUserId();
  await connectToDatabase();

  await Task.findOneAndDelete({
    _id: new Types.ObjectId(taskId),
    userId: new Types.ObjectId(userId)
  });
}

export async function setTaskCompletedForCurrentUser(taskId: string, completed: boolean) {
  const userId = await getCurrentUserId();
  await connectToDatabase();

  await Task.findOneAndUpdate(
    { _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(userId) },
    {
      $set: {
        completed,
        status: completed ? "completed" : "todo"
      }
    }
  );
}

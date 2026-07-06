import { model, models, Schema, Types, type InferSchemaType, type Model } from "mongoose";
import { taskPriorities, taskStatuses } from "@/lib/constants/tasks";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000
    },
    status: {
      type: String,
      enum: taskStatuses,
      default: "todo",
      required: true
    },
    priority: {
      type: String,
      enum: taskPriorities,
      default: "medium",
      required: true
    },
    category: {
      type: String,
      trim: true,
      default: "General",
      maxlength: 40
    },
    dueDate: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, status: 1 });

export type TaskDocument = InferSchemaType<typeof taskSchema> & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Task =
  (models.Task as Model<TaskDocument> | undefined) ?? model<TaskDocument>("Task", taskSchema);

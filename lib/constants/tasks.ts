export const taskStatuses = ["todo", "in-progress", "completed"] as const;
export const taskPriorities = ["low", "medium", "high"] as const;

export const taskStatusLabels = {
  todo: "To do",
  "in-progress": "In progress",
  completed: "Completed"
} as const;

export const taskPriorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High"
} as const;

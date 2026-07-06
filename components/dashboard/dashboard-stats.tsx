import { AlertTriangle, CheckCircle2, Clock3, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SerializedTask } from "@/types/task";

type DashboardStatsProps = {
  tasks: SerializedTask[];
};

function isOverdue(task: SerializedTask) {
  const today = new Date().toISOString().slice(0, 10);
  return !task.completed && task.dueDate < today;
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const active = tasks.filter((task) => !task.completed).length;
  const overdue = tasks.filter(isOverdue).length;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  const cards = [
    { label: "Total tasks", value: total, icon: ListTodo },
    { label: "Active", value: active, icon: Clock3 },
    { label: "Completed", value: `${completion}%`, icon: CheckCircle2 },
    { label: "Overdue", value: overdue, icon: AlertTriangle }
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-bold">{card.value}</p>
            </div>
            <span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
              <card.icon className="size-5" />
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

"use client";
import { useAppSelector } from "@/store";

export default function TasksPage() {
  const items = useAppSelector((s) => s.tasks.items);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <ul className="grid gap-3">
        {items.map((t) => (
          <li key={t.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-gray-500">{t.status} • {t.priority}</div>
              </div>
              <a className="btn-primary" href={`/tasks/${t.id}`}>Open</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

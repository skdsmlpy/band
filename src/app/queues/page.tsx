"use client";
import { useAppSelector } from "@/store";

export default function QueuesPage() {
  const items = useAppSelector((s) => s.tasks.items);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Queues</h1>
      <div className="grid gap-3">
        {items.map((t) => (
          <a key={t.id} href={`/tasks/${t.id}`} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-gray-500">Status: {t.status} • Priority: {t.priority}</div>
            </div>
            <span className="text-teal-500 text-sm">View</span>
          </a>
        ))}
      </div>
    </div>
  );
}

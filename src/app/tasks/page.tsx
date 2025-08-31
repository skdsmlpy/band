"use client";
import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type BTask = { id: string; title: string; status: string; priority: string };

export default function TasksPage() {
  const token = useAppSelector((s) => s.auth.token);
  const [items, setItems] = useState<BTask[]>([]);

  useEffect(() => {
    let active = true;
    apiGet<BTask[]>("/tasks", token || undefined)
      .then((data) => { if (active) setItems(data as any); })
      .catch(() => {});
    return () => { active = false; };
  }, [token]);

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

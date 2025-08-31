"use client";
import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type BTask = { id: string; title: string; status: string; priority: string };

export default function QueuesPage() {
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

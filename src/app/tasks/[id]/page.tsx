"use client";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/store";
import Link from "next/link";

export default function TaskDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const task = useAppSelector((s) => s.tasks.items.find((i) => i.id === id));

  if (!task) {
    return (
      <div className="space-y-3">
        <div className="text-red-600">Task not found</div>
        <Link className="btn-primary" href="/tasks">Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{task.title}</h1>
      <div className="card p-4">
        <div className="text-sm text-gray-500">Status: {task.status} • Priority: {task.priority}</div>
        <div className="mt-4">
          <Link className="btn-primary" href="/workflows">Open Workflow Form</Link>
        </div>
      </div>
    </div>
  );
}

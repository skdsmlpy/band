"use client";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const queues = useAppSelector((s) => s.queues);
  const tasks = useAppSelector((s) => s.tasks.items);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Welcome{user ? `, ${user.name}` : ""}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:assignment" className="text-teal-500" width={28} />
            <div>
              <div className="text-sm text-gray-500">My Queue</div>
              <div className="text-2xl font-semibold">{queues.myCount}</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:inbox" className="text-teal-500" width={28} />
            <div>
              <div className="text-sm text-gray-500">Available</div>
              <div className="text-2xl font-semibold">{queues.availableCount}</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:task" className="text-teal-500" width={28} />
            <div>
              <div className="text-sm text-gray-500">Open Tasks</div>
              <div className="text-2xl font-semibold">{tasks.length}</div>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Icon icon="material-symbols:notifications" className="text-teal-500" width={28} />
            <div>
              <div className="text-sm text-gray-500">Notifications</div>
              <div className="text-2xl font-semibold">Live</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <a className="btn-primary" href="/queues">Go to Queues</a>
          <a className="btn-primary" href="/tasks">View Tasks</a>
          <a className="btn-primary" href="/workflows">Open Workflow Renderer</a>
          <a className="btn-primary" href="/signature">Capture Signature</a>
        </div>
      </div>
    </div>
  );
}

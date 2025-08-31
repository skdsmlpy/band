"use client";
import { Icon } from "@iconify/react";

export function WidgetCard({ title, children, status }: { title: string; children: React.ReactNode; status?: "green"|"yellow"|"red" }) {
  const statusColor = status === "green" ? "#22C55E" : status === "yellow" ? "#F59E0B" : status === "red" ? "#ef4444" : undefined;
  return (
    <section className="rounded-lg p-4 shadow-md border border-indigo-200/40 dark:border-teal-700/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur" aria-label={title}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {statusColor && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColor }} aria-label={`status ${status}`} />}
      </div>
      {children}
    </section>
  );
}

export function ChartStub({ label, value, max=100 }: { label: string; value: number; max?: number }) {
  const width = 240, height = 100;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <svg role="img" aria-label={`${label} ${value}/${max}`} width={width} height={height} className="block">
      <title>{label}</title>
      <rect x="0" y="0" width={width} height={height} fill="url(#g)" rx="8" />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4338CA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="12" y="40" width={width-24} height="12" fill="#E5E7EB" rx="6" />
      <rect x="12" y="40" width={(width-24)*pct} height="12" fill="#14B8A6" rx="6" />
    </svg>
  );
}

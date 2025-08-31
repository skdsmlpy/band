"use client";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { theme, setTheme } = useTheme();
  return (
    <header className="h-[var(--header-height)] sticky top-0 z-40 bg-white/60 dark:bg-gray-900/60 backdrop-blur border-b border-indigo-200/30 dark:border-teal-700/30">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 bg-indigo-600 text-white px-2 py-1 rounded">Skip to content</a>
      <div className="container-max h-full flex items-center gap-3">
        <button aria-label="Toggle sidebar" onClick={onToggleSidebar} className="rounded-md p-2 hover:bg-indigo-50 dark:hover:bg-teal-900/30">
          <Icon icon="material-symbols:menu" width={24} />
        </button>
        <div className="font-semibold tracking-tight">Watchtower</div>
        <div className="flex-1 flex items-center justify-center">
          <input aria-label="Search" className="input-field w-full max-w-xl" placeholder="Search..." />
        </div>
        <button className="relative rounded-md p-2 hover:bg-indigo-50 dark:hover:bg-teal-900/30" aria-label="Notifications">
          <Icon icon="material-symbols:notifications" width={24} />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs">3</span>
        </button>
        <select aria-label="Theme" className="input-field w-28" value={theme} onChange={(e)=>setTheme(e.target.value)}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <div className="ml-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500" aria-hidden />
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}

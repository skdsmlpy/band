"use client";
import { Header } from "@/components/shell/Header";
import { Sidebar } from "@/components/shell/Sidebar";
import { useUI } from "@/store/ui";

export function AppShell({ children }: { children: React.ReactNode }) {
  const toggle = useUI((s) => s.toggleSidebar);
  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#F9FAFB,#E0E7FF)] dark:bg-[linear-gradient(to_bottom,#312E81,#0F766E)] text-slate-800 dark:text-white">
      <Header onToggleSidebar={toggle} />
      <div className="flex">
        <Sidebar />
        <main id="content" className="flex-1 p-4 container-max">
          {children}
        </main>
      </div>
    </div>
  );
}

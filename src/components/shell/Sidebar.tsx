"use client";
import { useUI } from "@/store/ui";
import { Icon } from "@iconify/react";

const nav = [
  { section: "Favorites", items: [] },
  { section: "Data Sources", items: [
    { label: "All Sources", icon: "material-symbols:database", href: "#" },
    { label: "Add Data Source", icon: "material-symbols:add" , href: "#"},
  ]},
  { section: "Governance", items: [ { label: "Policies", icon: "material-symbols:policy", href: "#" } ]},
  { section: "Security", items: [ { label: "Findings", icon: "material-symbols:shield", href: "#" } ]},
  { section: "Marketplace", items: [ { label: "Browse", icon: "material-symbols:storefront", href: "#" } ]},
  { section: "Settings", items: [ { label: "General", icon: "material-symbols:settings", href: "#" } ]},
];

export function Sidebar() {
  const collapsed = useUI((s) => s.sidebarCollapsed);
  return (
    <aside aria-label="Primary" className={`transition-all duration-200 border-r border-indigo-200/30 dark:border-teal-700/30 bg-white/40 dark:bg-gray-900/40 backdrop-blur ${collapsed ? "w-16" : "w-64"}`}>
      <nav className="p-2">
        {nav.map((group) => (
          <div key={group.section} className="mb-3">
            {!collapsed && <div className="px-2 py-1 text-xs uppercase tracking-wide text-gray-500">{group.section}</div>}
            <ul className="space-y-1">
              {group.items.map((it) => (
                <li key={it.label}>
                  <a href={it.href} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-indigo-50 dark:hover:bg-teal-900/30" aria-current={false}>
                    <Icon icon={it.icon} width={22} />
                    {!collapsed && <span className="text-sm">{it.label}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

"use client";
import { useUI } from "@/store/ui";
import { Icon } from "@iconify/react";
import { useAppSelector } from "@/store";

const nav = [
  { section: "Favorites", items: [] },
  { 
    section: "Equipment", 
    items: [
      { label: "All Equipment", icon: "material-symbols:music-note", href: "/equipment", roles: ["Admin", "Band Director", "Equipment Manager"] },
      { label: "Check Out", icon: "material-symbols:qr-code-scanner", href: "/equipment/checkout", roles: ["Student", "Band Director", "Equipment Manager"] },
      { label: "My Equipment", icon: "material-symbols:assignment-ind", href: "/equipment/my", roles: ["Student"] },
      { label: "Maintenance", icon: "material-symbols:build", href: "/equipment/maintenance", roles: ["Equipment Manager", "Band Director"] }
    ]
  },
  { 
    section: "Band Management", 
    items: [
      { label: "Students", icon: "material-symbols:school", href: "/students", roles: ["Band Director", "Supervisor"] },
      { label: "Performances", icon: "material-symbols:theater-comedy", href: "/performances", roles: ["Band Director", "Student"] },
      { label: "Practice Sessions", icon: "material-symbols:timer", href: "/practice", roles: ["Band Director", "Student"] },
      { label: "Sections", icon: "material-symbols:groups", href: "/sections", roles: ["Band Director"] }
    ]
  },
  { 
    section: "Workflows", 
    items: [
      { label: "My Tasks", icon: "material-symbols:task", href: "/tasks", roles: ["Student", "Band Director", "Equipment Manager"] },
      { label: "Queues", icon: "material-symbols:queue", href: "/queues", roles: ["Band Director", "Equipment Manager", "Supervisor"] },
      { label: "Workflow Builder", icon: "material-symbols:account-tree", href: "/workflows", roles: ["Admin", "Band Director"] }
    ]
  },
  { 
    section: "Communication", 
    items: [
      { label: "Messages", icon: "material-symbols:chat", href: "/messages", roles: ["Student", "Band Director", "Equipment Manager"] },
      { label: "Notifications", icon: "material-symbols:notifications", href: "/notifications", roles: ["Student", "Band Director", "Equipment Manager"] }
    ]
  },
  { 
    section: "Settings", 
    items: [
      { label: "Profile", icon: "material-symbols:person", href: "/profile", roles: ["Student", "Band Director", "Equipment Manager", "Admin"] },
      { label: "System", icon: "material-symbols:settings", href: "/settings", roles: ["Admin", "Band Director"] }
    ]
  }
];

// Helper function to get section color based on content
function getSectionColor(section: string): string {
  switch (section) {
    case "Equipment": return "text-brass-500";
    case "Band Management": return "text-woodwind-500"; 
    case "Workflows": return "text-percussion-500";
    case "Communication": return "text-string-500";
    default: return "text-gray-500";
  }
}

export function Sidebar() {
  const collapsed = useUI((s) => s.sidebarCollapsed);
  const userRole = useAppSelector((s) => s.auth.user?.role);
  
  // Filter navigation items based on user role
  const filterItemsByRole = (items: any[]) => {
    if (!userRole) return [];
    return items.filter(item => 
      !item.roles || item.roles.includes(userRole)
    );
  };

  return (
    <aside 
      aria-label="Primary navigation" 
      className={`
        transition-all duration-300 ease-in-out
        border-r border-indigo-200/30 dark:border-teal-700/30 
        bg-white/40 dark:bg-gray-900/40 backdrop-blur-md
        ${collapsed ? "w-16" : "w-64"}
        lg:block
      `}
    >
      <nav className="p-2 h-full overflow-y-auto">
        {nav.map((group) => {
          const filteredItems = filterItemsByRole(group.items);
          
          // Don't render empty sections
          if (filteredItems.length === 0 && group.items.length > 0) {
            return null;
          }

          return (
            <div key={group.section} className="mb-4">
              {!collapsed && (
                <div className={`px-2 py-1 text-xs uppercase tracking-wide font-semibold ${getSectionColor(group.section)}`}>
                  {group.section}
                </div>
              )}
              <ul className="space-y-1">
                {filteredItems.map((item) => (
                  <li key={item.label}>
                    <a 
                      href={item.href} 
                      className={`
                        mobile-nav-item
                        flex items-center gap-3 rounded-lg px-2 py-2 
                        text-gray-700 dark:text-gray-300
                        hover:bg-teal-50 dark:hover:bg-teal-900/20 
                        hover:text-teal-700 dark:hover:text-teal-300
                        transition-colors duration-150
                        ${!collapsed ? 'justify-start' : 'justify-center'}
                      `}
                      aria-current={false}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon 
                        icon={item.icon} 
                        width={22} 
                        height={22}
                        className="flex-shrink-0"
                      />
                      {!collapsed && (
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        
        {/* Mobile-only quick actions */}
        <div className="mt-auto pt-4 border-t border-gray-200/30 dark:border-gray-700/30 lg:hidden">
          {!collapsed && (
            <div className="px-2 py-1 text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Quick Actions
            </div>
          )}
          <ul className="space-y-1">
            <li>
              <a 
                href="/equipment/checkout" 
                className="mobile-nav-item flex items-center gap-3 rounded-lg px-2 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300"
              >
                <Icon icon="material-symbols:qr-code-scanner" width={22} />
                {!collapsed && <span className="text-sm font-medium">Quick Scan</span>}
              </a>
            </li>
            <li>
              <a 
                href="/messages" 
                className="mobile-nav-item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <Icon icon="material-symbols:chat" width={22} />
                {!collapsed && <span className="text-sm font-medium">Messages</span>}
                {!collapsed && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    3
                  </span>
                )}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

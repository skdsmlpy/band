import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar(): void;
  widgetsOrder: string[];
  setWidgetsOrder(ids: string[]): void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      widgetsOrder: ["systemHealth","dataQuality","compliance","costAnalytics"],
      setWidgetsOrder: (ids) => set({ widgetsOrder: ids }),
    }),
    { name: "ui-state" }
  )
);

"use client";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        {/* Socket client mounts globally */}
        <SocketClient />
      </ThemeProvider>
    </ReduxProvider>
  );
}

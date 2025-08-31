"use client";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { SocketClient } from "@/components/providers/SocketClient";
import { QueryProvider } from "@/components/providers/QueryProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryProvider>
          {children}
          <SocketClient />
        </QueryProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

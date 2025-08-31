import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "Band Workflow Manager",
  description: "Cross-platform workflow management (MVP)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="h-[var(--header-height)] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
              <div className="container-max h-full flex items-center justify-between">
                <a href="/" className="font-semibold tracking-tight">Band Workflow</a>
                <nav className="flex items-center gap-3">
                  <a className="hover:underline" href="/dashboard">Dashboard</a>
                  <a className="hover:underline" href="/queues">Queues</a>
                  <a className="hover:underline" href="/tasks">Tasks</a>
                  <a className="hover:underline" href="/workflows">Workflows</a>
                  <a className="hover:underline" href="/signature">Signature</a>
                  <a className="hover:underline" href="/profile">Profile</a>
                </nav>
              </div>
            </header>
            <main className="flex-1 container-max py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

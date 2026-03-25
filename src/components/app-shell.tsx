"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { Sidebar } from "@/components/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Sidebar />
      <main className="ml-[240px] flex-1 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </AuthProvider>
  );
}

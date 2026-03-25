"use client";

import { useAuth, UserRole } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";

interface RouteGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export function RouteGuard({ requiredRole, children }: RouteGuardProps) {
  const { role } = useAuth();
  const router = useRouter();

  const hasAccess = requiredRole === "evaluator" || role === "admin";

  useEffect(() => {
    if (!hasAccess) {
      const timer = setTimeout(() => router.push("/"), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasAccess, router]);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-in fade-in duration-300">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          This page is restricted to administrators. Redirecting you to the
          dashboard…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

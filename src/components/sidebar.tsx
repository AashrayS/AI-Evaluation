"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth, UserRole } from "@/contexts/auth-context";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole: "admin" | "all";
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, requiredRole: "all" },
  { href: "/transcribers", label: "Transcribers", icon: Users, requiredRole: "admin" },
  { href: "/evaluations", label: "Evaluations", icon: ClipboardCheck, requiredRole: "all" },
  { href: "/metrics", label: "Metrics", icon: BarChart3, requiredRole: "admin" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { role, setRole } = useAuth();

  const visibleItems = navItems.filter(
    (item) => item.requiredRole === "all" || role === "admin"
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Activity className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              VoiceAI
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Eval Platform
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">

        {visibleItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="border-t border-border px-3 py-3">
        <button
          onClick={() => setRole(role === "admin" ? "evaluator" : "admin")}
          title={collapsed ? `Role: ${role}` : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center"
          )}
        >
          {role === "admin" ? (
            <Shield className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <UserCheck className="h-5 w-5 shrink-0 text-blue-400" />
          )}
          {!collapsed && (
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">Role</span>
              <span className="capitalize text-foreground">{role}</span>
            </div>
          )}
        </button>
      </div>

      {/* Collapse Button */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

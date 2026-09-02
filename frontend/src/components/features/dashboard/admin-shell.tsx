"use client";

import { useState } from "react";

import { AdminSidebar } from "@/components/features/dashboard/admin-sidebar";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  user: { name: string; email: string };
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div
        className="fixed inset-y-0 left-0 z-30 hidden lg:block"
        style={{ width: "var(--sidebar-width)" }}
      >
        <AdminSidebar user={user} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width)] transform transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <AdminSidebar user={user} mobile onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-[var(--sidebar-width)]">
        <div className="sticky top-0 z-20 flex h-[var(--topbar-height)] items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-text-primary">Admin Panel</span>
        </div>

        <main className="admin-scroll flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/common/logout-button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: ROUTES.dashboard,
    label: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: ROUTES.users,
    label: "Users",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: ROUTES.settings,
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  user: { name: string; email: string };
  mobile?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ user, mobile, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-surface-sidebar",
        !mobile && "border-r border-border",
      )}
      style={{ boxShadow: mobile ? undefined : "var(--shadow-sidebar)" }}
    >
      <div className="flex h-[var(--topbar-height)] items-center gap-3 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{siteConfig.name}</p>
          <p className="truncate text-xs text-text-muted">Admin Panel</p>
        </div>
      </div>

      <nav className="admin-scroll flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.dashboard && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-surface-sidebar-active text-text-accent shadow-sm"
                  : "text-text-secondary hover:bg-surface-sidebar-hover hover:text-text-primary",
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive ? "text-accent" : "text-text-muted group-hover:text-text-secondary",
                )}
              >
                {item.icon}
              </span>
              {item.label}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-surface-muted p-3">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
            <p className="truncate text-xs text-text-muted">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AdminTopbar({
  title,
  description,
  user,
}: {
  title?: string;
  description?: string;
  user: { name: string };
}) {
  return (
    <header className="sticky top-0 z-20 flex h-[var(--topbar-height)] items-center justify-between gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="min-w-0">
        {title && (
          <h1 className="truncate text-lg font-semibold text-text-primary">{title}</h1>
        )}
        {description && (
          <p className="truncate text-sm text-text-muted">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <span className="hidden text-sm text-text-secondary sm:inline">{user.name}</span>
        <LogoutButton />
      </div>
    </header>
  );
}

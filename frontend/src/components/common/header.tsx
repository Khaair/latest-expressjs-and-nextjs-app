import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/lib/api/auth";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-text-primary">{siteConfig.name}</span>
        </Link>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href={ROUTES.dashboard}>
              <Button size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href={ROUTES.login}>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href={ROUTES.register}>
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

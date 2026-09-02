import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} {siteConfig.name}. Built with Next.js App Router.
        </p>
      </div>
    </footer>
  );
}

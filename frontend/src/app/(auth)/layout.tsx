export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-background px-4 py-10 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,var(--accent-muted)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

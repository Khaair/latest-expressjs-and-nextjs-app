import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "accent";
  className?: string;
}) {
  const variants = {
    default: "bg-surface-muted text-text-secondary ring-1 ring-border",
    success: "bg-success-muted text-success ring-1 ring-success/20",
    warning: "bg-warning-muted text-warning ring-1 ring-warning/20",
    accent: "bg-accent-muted text-text-accent ring-1 ring-accent/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
}

const variants = {
  primary:
    "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover active:scale-[0.98] focus-visible:ring-ring",
  secondary:
    "border border-border bg-surface text-text-primary shadow-sm hover:bg-surface-muted active:scale-[0.98] focus-visible:ring-ring",
  ghost:
    "text-text-secondary hover:bg-surface-muted hover:text-text-primary active:scale-[0.98] focus-visible:ring-ring",
  danger:
    "bg-danger text-white shadow-sm hover:bg-danger/90 active:scale-[0.98] focus-visible:ring-danger",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Spinner />}
      {loading ? (loadingText ?? "Loading...") : children}
    </button>
  );
}

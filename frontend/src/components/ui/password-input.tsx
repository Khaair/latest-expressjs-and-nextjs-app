"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
}

export function PasswordInput({ className, label, error, id, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border bg-surface py-2 pl-3 pr-10 text-sm text-text-primary shadow-sm placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

export type PasswordStrengthLevel = "weak" | "medium" | "strong" | "empty";

export function getPasswordStrength(password: string): PasswordStrengthLevel {
  if (!password) return "empty";
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

const strengthConfig = {
  empty: { label: "", width: "0%", color: "bg-border" },
  weak: { label: "Weak", width: "33%", color: "bg-danger" },
  medium: { label: "Medium", width: "66%", color: "bg-warning" },
  strong: { label: "Strong", width: "100%", color: "bg-success" },
};

export function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const config = strengthConfig[strength];

  const requirements = [
    { met: password.length >= 8, label: "At least 8 characters" },
    { met: /[A-Z]/.test(password), label: "One uppercase letter" },
    { met: /[a-z]/.test(password), label: "One lowercase letter" },
    { met: /[0-9]/.test(password), label: "One number" },
  ];

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted">Password strength</span>
          {config.label && (
            <span
              className={cn(
                "font-medium",
                strength === "weak" && "text-danger",
                strength === "medium" && "text-warning",
                strength === "strong" && "text-success",
              )}
            >
              {config.label}
            </span>
          )}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn("h-full rounded-full transition-all duration-300", config.color)}
            style={{ width: config.width }}
          />
        </div>
      </div>
      <ul className="space-y-1">
        {requirements.map((req) => (
          <li key={req.label} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full",
                req.met ? "bg-success-muted text-success" : "bg-surface-muted text-text-muted",
              )}
            >
              {req.met ? "✓" : "·"}
            </span>
            <span className={req.met ? "text-text-secondary" : "text-text-muted"}>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

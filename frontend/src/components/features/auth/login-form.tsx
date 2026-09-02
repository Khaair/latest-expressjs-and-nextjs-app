"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  AuthBrand,
  AuthCard,
  AuthDivider,
  AuthFooterLink,
  FormAlert,
  GoogleAuthButton,
} from "@/components/features/auth/auth-layout-parts";
import { loginAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import type { ActionResult } from "@/types/api";
import type { AuthUser } from "@/types/auth";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    ActionResult<AuthUser> | null,
    FormData
  >(loginAction, null);

  return (
    <div className="space-y-8">
      <AuthBrand />

      <AuthCard>
        <form action={formAction} className="space-y-5">
          {state?.error && <FormAlert>{state.error}</FormAlert>}

          <Input
            name="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            required
            autoComplete="email"
            error={state?.fieldErrors?.email?.[0]}
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-text-secondary">
                Password
              </label>
              <Link
                href={ROUTES.forgotPassword}
                className="text-xs font-medium text-text-accent hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              error={state?.fieldErrors?.password?.[0]}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isPending} loadingText="Signing in...">
            Sign In
          </Button>

          <AuthDivider />
          <GoogleAuthButton label="Continue with Google" />
        </form>
      </AuthCard>

      <AuthFooterLink
        text="Don't have an account?"
        linkText="Create account"
        href={ROUTES.register}
      />
    </div>
  );
}

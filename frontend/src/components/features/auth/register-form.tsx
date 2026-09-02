"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import {
  AuthBrand,
  AuthCard,
  AuthDivider,
  AuthFooterLink,
  FormAlert,
  GoogleAuthButton,
} from "@/components/features/auth/auth-layout-parts";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput, PasswordStrength } from "@/components/ui/password-input";
import { ROUTES } from "@/constants/routes";
import type { ActionResult } from "@/types/api";
import type { AuthUser } from "@/types/auth";

export function RegisterForm() {
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState<
    ActionResult<AuthUser> | null,
    FormData
  >(registerAction, null);

  return (
    <div className="space-y-8">
      <AuthBrand />

      <AuthCard>
        <form action={formAction} className="space-y-5">
          {state?.error && <FormAlert>{state.error}</FormAlert>}

          <Input
            name="name"
            type="text"
            label="Full name"
            placeholder="Full name"
            required
            autoComplete="name"
            error={state?.fieldErrors?.name?.[0]}
          />

          <Input
            name="email"
            type="email"
            label="Email address"
            placeholder="Email address"
            required
            autoComplete="email"
            error={state?.fieldErrors?.email?.[0]}
          />

          <div className="space-y-3">
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={state?.fieldErrors?.password?.[0]}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordInput
            name="confirmPassword"
            label="Confirm password"
            placeholder="Confirm password"
            required
            autoComplete="new-password"
            error={state?.fieldErrors?.confirmPassword?.[0]}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
            loadingText="Creating account..."
          >
            Create Account
          </Button>

          <AuthDivider />
          <GoogleAuthButton label="Continue with Google" />

          <p className="text-center text-xs text-text-muted">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-text-accent hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </AuthCard>

      <AuthFooterLink
        text="Already have an account?"
        linkText="Sign in"
        href={ROUTES.login}
      />
    </div>
  );
}

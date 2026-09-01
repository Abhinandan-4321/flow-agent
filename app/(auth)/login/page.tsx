"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/features/auth/actions";

const CALLBACK_ERRORS: Record<string, string> = {
  verification_failed:
    "The verification link is invalid or has expired. Please sign up again or request a new link.",
  reset_link_invalid:
    "The password reset link is invalid or has expired. Please request a new one.",
};

const CALLBACK_MESSAGES: Record<string, string> = {
  password_updated: "Your password has been updated. Sign in with your new password.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const callbackMessage = searchParams.get("message");
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to your FlowAgent account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4" noValidate>
          {callbackMessage && CALLBACK_MESSAGES[callbackMessage] && (
            <div
              role="status"
              className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
            >
              {CALLBACK_MESSAGES[callbackMessage]}
            </div>
          )}

          {(state?.error || (callbackError && CALLBACK_ERRORS[callbackError])) && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state?.error ?? CALLBACK_ERRORS[callbackError!]}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              aria-invalid={!!state?.fieldErrors?.email}
              aria-describedby={
                state?.fieldErrors?.email ? "email-error" : undefined
              }
              disabled={pending}
            />
            {state?.fieldErrors?.email && (
              <p id="email-error" className="text-xs text-destructive">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!state?.fieldErrors?.password}
              aria-describedby={
                state?.fieldErrors?.password ? "password-error" : undefined
              }
              disabled={pending}
            />
            {state?.fieldErrors?.password && (
              <p id="password-error" className="text-xs text-destructive">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
